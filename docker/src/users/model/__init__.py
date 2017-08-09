import os
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateSchema
from sqlalchemy.orm import sessionmaker

from .entities import *

from model_utils import Base

engine = create_engine('postgresql://{}:{}@{}:5432/{}'.format(
    os.environ['USERS_DB_USER'],
    os.environ['USERS_DB_PASSWORD'],
    os.environ['USERS_DB_HOST'],
    os.environ['USERS_DB_NAME']
), echo=True)

Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

from .UsersModel import UsersModel

__all__ = [
    'UsersModel'
]

"""
por ahora usa las tablas generadas en los otros sistemas
def crear_tablas():
    from sqlalchemy.schema import CreateSchema

    engine.execute(CreateSchema(''))
    Base.metadata.create_all(engine)
"""
