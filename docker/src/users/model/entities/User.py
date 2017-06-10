from sqlalchemy import Column, Integer, String, Date, DateTime, func
from sqlalchemy.orm import relationship

from users.model.entities import Base

class User(Base):

    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

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

    """
    def getAge(self):
        today = datetime.datetime.now()
        born = self.birthdate
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    def updateType(self, ctx):
        ctx.dao(self).updateType(ctx, self.id, self.type)
        return self

    @classmethod
    def search(cls, ctx, regex):
        return Ids(cls, ctx.dao(cls).search(ctx, regex))

    @classmethod
    def findPhoto(cls, ctx, pId):
        return ctx.dao(cls).findPhoto(ctx, pId)

    @classmethod
    def findPhotos(cls, ctx, userIds):
        return ctx.dao(cls).findPhotos(ctx, userIds)
    """

"""
class Student(User, Entity):

    def __init__(self):
        super().__init__()
        self.studentNumber = None
        self.condition = None
"""
