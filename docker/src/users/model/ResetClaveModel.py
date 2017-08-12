import uuid
import datetime
import os

import logging
logging.getLogger().setLevel(logging.DEBUG)

from . import Session, UsersModel, obtener_template, enviar_correo
from .JWTModel import JWTModel
from .entities import *



class ResetClaveModel:

    DECODERS = [
        JWTModel(os.environ['JWT_CLAVE1']),
        JWTModel(os.environ['JWT_CLAVE2']),
        JWTModel(os.environ['JWT_CLAVE3'], 60 * 5),                 # ingresar el código enviado al correo
        JWTModel(os.environ['JWT_CLAVE4'])
    ]

    @staticmethod
    def _obtener_correo_alternativo(usuario):
        for c in usuario.mails:
            if 'econo.unlp.edu.ar' not in c.email:
                return c
        return None

    """
    @classmethod
    def _test_encode_token(cls, encoder):
        ''' metodo de testeo para debug de la app '''
        return cls.DECODERS[encoder].encode_auth_token({'algo_de':'prueba', 'y_otra':'cosa'})
    """

    @classmethod
    def _test_decode_token(cls, encoder, token):
        ''' metodo de testeo para debug de la app '''
        return cls.DECODERS[encoder].decode_auth_token(token)

    @classmethod
    def verificaciones(cls, solo_pendientes=True, limit=None, offset=None):
        session = Session()
        try:
            q = session.query(ResetClaveCodigo)
            q = q.filter(ResetClaveCodigo.verificado == None) if solo_pendientes else q
            q = q.limit(limit) if limit else q
            q = q.offset(offset) if offset else q
            q = q.order_by(ResetClaveCodigo.creado.desc(), ResetClaveCodigo.actualizado.desc())
            return q.all()

        finally:
            session.close()




    @classmethod
    def obtener_token(cls):
        token = cls.DECODERS[0].encode_auth_token()
        return {'estado':'ok', 'token':token}

    @classmethod
    def obtener_usuario(cls, token, dni):
        assert token is not None
        try:
            cls.DECODERS[0].decode_auth_token(token)
        except Exception as e:
            return { 'estado': 'error', 'mensaje': 'token expirado', 'codigo': 1 }


        session = Session()
        try:
            ''' chequeo la cantidad de intentos '''
            reset = session.query(ResetClave).filter(ResetClave.dni == dni).one_or_none()
            if not reset:
                rc = ResetClave(dni=dni, intentos=1)
                session.add(rc)
            else:
                reset.intentos = reset.intentos + 1
            session.commit()

            usuario = session.query(Usuario).filter(Usuario.dni == dni).one_or_none()
            if not usuario:
                return { 'estado': 'error', 'mensaje': 'no existe ese dni', 'codigo': 2 }

            '''
                TODO: chequear aqui la cantidad de intentos a ver si no disparo el error con código 3
            '''

            correo = cls._obtener_correo_alternativo(usuario)
            if not correo:
                return { 'estado': 'error', 'mensaje': 'no tiene registrado cuenta alternativa de correo', 'codigo': 4 }

            rusuario = {
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'dni': usuario.dni,
                'correo': {
                        'email': correo.email,
                    }
            }
            nuevo_token = cls.DECODERS[1].encode_auth_token(datos=rusuario)
            r = { 'estado': 'ok',
                  'usuario':rusuario,
                  'token': nuevo_token}
            return r

        finally:
            session.close()

    @classmethod
    def enviar_codigo(cls, token):
        assert token is not None
        datos = None
        try:
            datos = cls.DECODERS[1].decode_auth_token(token)
        except Exception as e:
            return { 'estado': 'error', 'mensaje': 'token expirado', 'codigo': 1 }

        session = Session()
        try:
            dni = datos['dni']
            correo = datos['correo']['email']
            ahora = datetime.datetime.now()
            rc = session.query(ResetClaveCodigo).filter(ResetClaveCodigo.dni == dni, ResetClaveCodigo.correo == correo, ResetClaveCodigo.expira >= ahora).one_or_none()
            if not rc:
                rc = ResetClaveCodigo(nombre = datos['nombre'] + ' ' + datos['apellido'],
                                      dni = datos['dni'],
                                      codigo = str(uuid.uuid4())[:5],
                                      correo = datos['correo']['email'],
                                      expira = ahora + datetime.timedelta(days=1))
                session.add(rc)
            else:
                rc.expira = rc.expira + datetime.timedelta(days=1)
            session.commit()

            temp = obtener_template('reset_clave.html', rc.nombre, rc.codigo)
            r = enviar_correo('pablo.rey@econo.unlp.edu.ar', rc.correo, 'Código de confirmación de cambio de contraseña', temp)
            if not r.ok:
                return { 'estado': 'error', 'mensaje': 'no se pudo enviar el correo con el código de confirmación', 'codigo': 3 }

            nuevo_token = cls.DECODERS[2].encode_auth_token(datos=rc.id)
            return { 'estado':'ok', 'token': nuevo_token }

        except Exception as e:
            logging.debug(e)
            return { 'estado': 'error', 'mensaje': 'no se pudo enviar el correo con el código de confirmación', 'codigo': 3 }

        finally:
            session.close()

    @classmethod
    def verificar_codigo(cls, token, codigo):
        assert token is not None
        rcid = None
        try:
            rcid = cls.DECODERS[2].decode_auth_token(token)
        except Exception as e:
            return { 'estado': 'error', 'mensaje': 'token expirado', 'codigo': 1 }

        session = Session()
        try:
            ahora = datetime.datetime.now()
            rc = session.query(ResetClaveCodigo).filter(ResetClaveCodigo.id == rcid, ResetClaveCodigo.expira >= ahora).one_or_none()
            if not rc:
                return { 'estado': 'error', 'mensaje': 'token expirado', 'codigo': 1 }

            if rc.codigo != codigo:
                return { 'estado': 'error', 'mensaje': 'error de código', 'codigo': 2 }

            rc.verificado = ahora
            rc.expira = ahora
            session.commit()

            nuevo_token = cls.DECODERS[3].encode_auth_token(datos=rc.dni)
            return { 'estado':'ok', 'token': nuevo_token }

        finally:
            session.close()


    @classmethod
    def cambiar_clave(cls, token, clave):
        assert token is not None
        dni = None
        try:
            dni = cls.DECODERS[3].decode_auth_token(token)
        except Exception as e:
            return { 'estado': 'error', 'mensaje': 'token expirado', 'codigo': 1 }

        try:
            usuario = UsersModel.usuarios(dni=dni)[0]
            UsersModel.crear_clave(usuario.id, clave)
        except Exception as e:
            return { 'estado': 'error', 'mensaje': 'error cambiando la contraseña', 'codigo': 2 }

        session = Session()
        try:
            rc = session.query(ResetClave).filter(ResetClave.dni == dni).one()
            session.delete(rc)
            session.commit()

        finally:
            session.close()

        return { 'estado': 'ok', 'mensaje': 'contraseña cambiada con éxito', 'codigo': 0 }
