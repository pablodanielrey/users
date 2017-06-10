import uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

from flask_jsontools import JsonSerializableBase

Base = declarative_base(cls=(JsonSerializableBase,))

def generate_uuid():
    return str(uuid.uuid4())


class Telephone(Base):

    __tablename__ = 'telephones'

    id = Column(String, primary_key=True, default=generate_uuid)
    number = Column(String)
    type = Column(String)

    @classmethod
    def findAll(cls, s):
        return s.query(cls).all()


if __name__ == '__main__':
    import logging
    from sqlalchemy import create_engine

    engine = create_engine('postgresql://postgres:clavesecreta@localhost:5432/testing')
    Base.metadata.create_all(engine)

    Sm = sessionmaker(bind=engine)
    s = Sm()
    s.add_all([
        Telephone(number='1', type='cel'),
        Telephone(number='2', type='cel'),
        Telephone(number='3', type='cel'),
        Telephone(number='4', type='cel'),
        Telephone(number='5', type='cel')
    ])
    s.commit()
    for t in s.query(Telephone).all():
        print(t.__json__())
    #logging.info(Telephone.findAll(s))
