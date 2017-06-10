
import uuid

def generate_id():
    return str(uuid.uuid4())

from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from flask_jsontools import JsonSerializableBase

class MyBaseClass:

    id = Column(String, primary_key=True, default=generate_id)
    created = Column(DateTime, server_default=func.now())
    updated = Column(DateTime, onupdate=func.now())


Base = declarative_base(cls=(JsonSerializableBase,MyBaseClass))

from .Telephone import Telephone
from .User import User

__all__ = [
    'Telephone',
    'User'
]
