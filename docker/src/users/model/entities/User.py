import uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

from flask_jsontools import JsonSerializableBase

Base = declarative_base(cls=(JsonSerializableBase,))


class User(Base):

    __tablename__ = 'users'

    id = Column(String, primary_key=True, default=generate_uuid)
    number = Column(String)
    type = Column(String)

    @classmethod
    def findAll(cls, s):
        return s.query(cls).all()


    def __init__(self):
        self.id = None
        self.dni = None
        self.name = None
        self.lastname = None
        self.gender = None
        self.birthdate = None
        self.city = None
        self.country = None
        self.address = None
        self.residence_city = None
        self.created = datetime.datetime.now()
        self.version = 0
        self.photo = None
        self.type = None
        self.telephones = []
        self.type = None

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


class Student(User, Entity):

    def __init__(self):
        super().__init__()
        self.studentNumber = None
        self.condition = None
