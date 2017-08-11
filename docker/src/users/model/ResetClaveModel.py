import uuid
import datetime
import os

from . import Session, UsersModel, obtener_template, enviar_correo
from .JWTModel import JWTModel
from .entities import *



class ResetClaveModel:

    DECODERS = [
        JWTModel(os.environ['JWT_CLAVE1']),
        JWTModel(os.environ['JWT_CLAVE2']),
        JWTModel(os.environ['JWT_CLAVE3']),
    ]

    ERRORES = [
        { 'estado': 'error', 'mensaje': 'no existe ese dni', 'codigo': 0 },
        { 'estado': 'error', 'mensaje': 'no tiene registrado cuenta alternativa de correo', 'codigo': 1 },
        { 'estado': 'error', 'mensaje': 'no se pudo enviar el correo con el código de confirmación', 'codigo': 2 }
    ]



    @staticmethod
    def _obtener_correo_alternativo(usuario):
        for c in usuario.correos:
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
    def obtener_token(cls):
        token = cls.DECODERS[0].encode_auth_token()
        return {'token':token}

    @classmethod
    def obtener_usuario(cls, token, dni):
        assert token is not None
        cls.DECODERS[0].decode_auth_token(token)

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
                return cls.ERRORES[0]

            correo = cls._obtener_correo_alternativo(usuario)
            if not correo:
                return cls.ERRORES[1]

            rusuario = {
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'dni': usuario.dni,
                'correo': {
                        'email': correo.email,
                    }
            }
            nuevo_token = cls.DECODERS[1].encode_auth_token(datos=rusuario)
            r = { 'usuario':rusuario,
                  'token': nuevo_token}
            return r

        finally:
            session.close()

    @classmethod
    def enviar_codigo(cls, token):
        assert token is not None
        datos = cls.DECODERS[1].decode_auth_token(token)
        nombre = datos['nombre'] + ' ' + datos['apellido']
        codigo = str(uuid.uuid4())[:5]
        correo = datos['correo']['email']

        temp = obtener_template('reset_clave.html', nombre, codigo)
        r = enviar_correo('pablo.rey@econo.unlp.edu.ar', correo, 'Código de confirmación de cambio de contraseña', temp)
        if not r.ok:
            return cls.ERRORES[2]

        nuevo_token = cls.DECODERS[2].encode_auth_token(datos=dni)
        r = {'token': nuevo_token}

    @classmethod
    def cambiar_clave(cls, token, clave):
        assert token is not None
        dni = cls.DECODERS[2].decode_auth_token(token)
        usuario = UsersModel.usuarios(dni=dni)[0]
        UsersModel.crear_clave(usuario.id, clave)

        session = Session()
        try:
            rc = session.query(ResetClave).filter(ResetClave.dni == dni).one()
            session.delete(rc)
            session.commit()

        finally:
            session.close()
