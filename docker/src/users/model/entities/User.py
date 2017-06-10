import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, func, or_
from sqlalchemy.orm import relationship

from model_utils import Base

class User(Base):

    __tablename__ = 'users'
    __table_args__ = ({'schema': 'users'})


    dni = Column(String)
    name = Column(String)
    lastname = Column(String)
    gender = Column(String)
    birthdate = Column(Date)
    city = Column(String)
    country = Column(String)
    address = Column(String)
    residence_city = Column(String)

    telephones = relationship('Telephone', back_populates='user')
    mails = relationship('Mail', back_populates='user')

    @property
    def age(self):
        if not self.birthdate:
            return 0
        today = datetime.datetime.now()
        born = self.birthdate
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    @classmethod
    def search(cls, s, regex):
        """ busca por nombre, apellido o dni personas """
        regs = regex.split(' ')
        terms = []
        for r in regs:
            terms.append(cls.name.ilike('{}{}{}'.format('%',r,'%')))
            terms.append(cls.lastname.ilike('{}{}{}'.format('%',r,'%')))
            terms.append(cls.dni.ilike('{}{}{}'.format('%',r,'%')))
        re = s.query(cls).filter(or_(*terms))
        return re


"""
class Student(User, Entity):

    def __init__(self):
        super().__init__()
        self.studentNumber = None
        self.condition = None
"""
