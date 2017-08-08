import uuid
import datetime
import base64

from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from . import Session
from .entities import *

class UsersModel:

    """
    @staticmethod
    def normalize(resp):
        if len(resp) == 1:
            return resp[0]
        return resp
    """

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
    def usuarios(cls, usuario=None, dni=None, retornarClave=False, offset=None, limit=None):
        session = Session()
        try:
            q = session.query(Usuario)

            q = q.filter(Usuario.id == usuario) if usuario else q
            q = q.filter(Usuario.dni == dni) if dni else q

            q = q.options(joinedload('mails'), joinedload('telefonos'))
            q = q.options(joinedload('claves')) if retornarClave else q

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
            usuario = session.query(Usuario).filter(Usuario.id == uid).one()
            mail = Mail(
                email=datos['email'].lower(),
                confirmado=datos['confirmado'] if 'confirmado' in datos else False,
                hash=str(uuid.uuid4())[:5])
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
            mail.confirmado=datos['confirmado'] if 'confirmado' in datos else False
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
    def confirmar_correo(cls, cid, datos):
        session = Session()
        try:
            correo = session.query(Mail).filter(Mail.id == cid).one()
            mail = correo.email.lower().strip()
            cuerpo = cls.obtener_template()
            cls.enviar_correo(mail, 'pablo.rey@econo.unlp.edu.ar', 'Confirmación de cuenta alternativa de contacto', cuerpo)

        finally:
            session.close()


    @staticmethod
    def obtener_template():
        with open('users/model/templates/confirmar_correo.html','r') as f:
            template = f.read()
            texto = template.replace('$USUARIO','Pablo Daniel Rey')\
                    .replace('$CODIGO_CONFIRMACION','absd')\
                    .replace('$URL_DE_INFORME','http://incidentes.econo.unlp.edu.ar/0293094-df2323-r4354-f34543')
            return texto

    @staticmethod
    def enviar_correo(_to, _from, subject, body):
        ''' https://developers.google.com/gmail/api/guides/sending '''

        from email.mime.text import MIMEText
        from email.header import Header

        correo = MIMEText(body.encode('utf-8'), 'plain', 'utf-8')
        correo['to'] = _to
        correo['from'] = _from
        correo['subject'] = Header(subject, 'utf-8')
        urlsafe = base64.urlsafe_b64encode(correo.as_string().encode()).decode()

        from .accessApi import GAuthApis
        service = GAuthApis.getService('gmail', 'v1', '27294557@econo.unlp.edu.ar')
        m = service.users().messages().send(userId='27294557@econo.unlp.edu.ar', body={'raw':urlsafe}).execute()
        print(m)
