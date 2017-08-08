import uuid
import datetime

from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from . import Session
from .entities import *

class MailsModel:

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
    def enviar(cls, destinatarios, correo):
        pass
