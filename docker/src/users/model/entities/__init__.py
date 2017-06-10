
import uuid

def generate_id():
    return str(uuid.uuid4())

from sqlalchemy import Column, Integer, String, Date, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from flask_jsontools import JsonSerializableBase

class MyBaseClass:

    created = Column(DateTime, server_default=func.now())
    updated = Column(DateTime, onupdate=func.now())


Base = declarative_base(cls=(JsonSerializableBase,MyBaseClass))

__all__ = []
