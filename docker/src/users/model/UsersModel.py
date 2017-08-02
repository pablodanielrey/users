
from . import Session
from .entities import *

class UsersModel:

    @staticmethod
    def _aplicar_filtros_comunes(q, offset, limit):
        q = q.offset(offset) if offset else q
        q = q.limit(limit) if limit else q
        return q

    @classmethod
    def usuarios(cls, offset=None, limit=None):
        session = Session()
        q = session.query(Usuario)
        q = cls._aplicar_filtros_comunes(q, offset, limit)
        return q.all()
