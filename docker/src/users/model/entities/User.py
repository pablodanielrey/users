import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, func

from users.model.entities import generate_id, Base

class User(Base):

    __tablename__ = 'users'

    id = Column(String, primary_key=True, default=generate_id)
    dni = Column(String)
    name = Column(String)
    lastname = Column(String)
    gender = Column(String)
    birthdate = Column(Date)
    city = Column(String)
    country = Column(String)
    address = Column(String)
    residence_city = Column(String)
    created = Column(DateTime, server_default=func.now())
    updated = Column(DateTime, onupdate=func.now())



if __name__ == '__main__':
    import logging
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine('postgresql://postgres:clavesecreta@localhost:5432/testing')
    Base.metadata.create_all(engine)

    Sm = sessionmaker(bind=engine)
    s = Sm()
    s.add_all([
        User(dni='27294557', name='Pablo Daniel', lastname='Rey'),
        User(dni='27294558', name='Pablo Daniel1', lastname='Rey'),
        User(dni='27294559', name='Pablo Daniel2', lastname='Rey'),
        User(dni='27294550', name='Pablo Daniel3', lastname='Rey')
    ])
    s.commit()
    for t in s.query(User).all():
        print(t.__json__())
    #logging.info(Telephone.findAll(s))














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
