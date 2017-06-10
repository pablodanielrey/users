
import uuid

def generate_id():
    return str(uuid.uuid4())

from sqlalchemy.ext.declarative import declarative_base
from flask_jsontools import JsonSerializableBase

Base = declarative_base(cls=(JsonSerializableBase,))

__all__ = []
