import uuid
import datetime
import base64
import requests

from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from . import Session
from .entities import *

class UsersModel:

    @staticmethod
    def _aplicar_filtros_comunes(q, offset, limit):
        q = q.offset(offset) if offset else q
        q = q.limit(limit) if limit else q
        return q

    @classmethod
    def claves(cls, clave=None):
        session = Session()
        try:
            q = session.query(UsuarioClave)
            q = q.filter(UsuarioClave.id == clave) if clave else q
            q.order_by(UsuarioClave.actualizado.desc())
            return q.all()
        finally:
            session.close()


    @classmethod
    def actualizar_usuario(cls, uid, datos):
        session = Session()
        try:
            print(datos['nombre'])
            print(datos['apellido'])
            usuario = session.query(Usuario).filter(Usuario.id == uid).one()
            if 'nombre' in datos: usuario.nombre = datos['nombre']
            if 'apellido' in datos: usuario.apellido = datos['apellido']
            session.commit()

        finally:
            session.close()


    @classmethod
    def usuarios(cls, usuario=None, dni=None, retornarClave=False, fecha_actualizado=None, offset=None, limit=None):
        session = Session()
        try:
            q = session.query(Usuario)

            q = q.filter(Usuario.id == usuario) if usuario else q
            q = q.filter(Usuario.dni == dni) if dni else q

            q = q.options(joinedload('claves')) if retornarClave else q


            q = q.options(joinedload('mails'), joinedload('telefonos'))

            q = cls._aplicar_filtros_comunes(q, offset, limit)

            return q.all()
        finally:
            session.close()


    @classmethod
    def correos(cls, cid=None, usuario=None, historico=False, offset=None, limit=None):
        session = Session()
        try:
            q = session.query(Mail)

            q = q.filter(Mail.id == cid) if cid else q
            q = q.filter(Mail.usuario_id == usuario) if usuario else q
            q = q.filter(Mail.eliminado == None) if not historico else q
            q = cls._aplicar_filtros_comunes(q, offset, limit)

            return q.all()
        finally:
            session.close()

    @classmethod
    def agregar_correo(cls, uid, datos):
        assert 'email' in datos
        session = Session()
        try:
            if (session.query(Mail).filter(Mail.usuario_id == uid, Mail.email == datos['email'], Mail.eliminado == None).count() >= 1):
                return

            usuario = session.query(Usuario).filter(Usuario.id == uid).one()
            mail = Mail(email=datos['email'].lower())
            usuario.mails.append(mail)
            session.commit()

        finally:
            session.close()

    @classmethod
    def actualizar_correo(cls, cid, datos):
        assert 'email' in datos
        session = Session()
        try:
            mail = session.query(Mail).filter(Mail.id == cid).one()
            mail.email=datos['email'].lower()
            session.commit()

        finally:
            session.close()

    @classmethod
    def eliminar_correo(cls, cid):
        session = Session()
        try:
            correo = session.query(Mail).filter(Mail.id == cid).one()
            correo.eliminado = datetime.datetime.now()
            session.commit()

        finally:
            session.close()

    @classmethod
    def confirmar_correo(cls, cid, code):
        session = Session()
        try:
            correo = session.query(Mail).filter(Mail.id == cid, Mail.hash == code).first()
            if not correo:
                return ''

            correo.confirmado = True
            correo.fecha_confirmado = datetime.datetime.now()
            session.commit()
            return correo.id

        finally:
            session.close()

    @classmethod
    def enviar_confirmar_correo(cls, cid, datos):
        session = Session()
        try:
            correo = session.query(Mail).filter(Mail.id == cid).join(Usuario).one()
            if not correo.hash:
                correo.hash=str(uuid.uuid4())[:5]
                session.commit()

            mail = correo.email.lower().strip()
            codigo = correo.hash
            nombre = correo.usuario.nombre + ' ' + correo.usuario.apellido
            cuerpo = cls.obtener_template(nombre, correo.hash)
            cls.enviar_correo('pablo.rey@econo.unlp.edu.ar', mail, 'Confirmación de cuenta alternativa de contacto', cuerpo)

        finally:
            session.close()


    @staticmethod
    def obtener_template(nombre, codigo):
        with open('users/model/templates/confirmar_correo.html','r') as f:
            template = f.read()
            texto = template.replace('$USUARIO',nombre)\
                    .replace('$CODIGO_CONFIRMACION',codigo)\
                    .replace('$URL_DE_INFORME','http://incidentes.econo.unlp.edu.ar/0293094-df2323-r4354-f34543')
            return texto

    @staticmethod
    def enviar_correo(de, para, asunto, cuerpo):
        ''' https://developers.google.com/gmail/api/guides/sending '''
        bcuerpo = base64.urlsafe_b64encode(cuerpo.encode('utf-8')).decode()
        r = requests.post('http://163.10.56.57:8001/emails/api/v1.0/enviar_correo', json={'de':de, 'para':para, 'asunto':asunto, 'cuerpo':bcuerpo})
        print(str(r))
