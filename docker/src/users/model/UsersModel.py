import uuid
import datetime

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
