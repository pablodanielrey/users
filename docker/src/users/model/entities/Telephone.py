from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from users.model.entities import Base

class Telephone(Base):

    __tablename__ = 'telephones'
    __table_args__ = {'extend_existing': True} 

    number = Column(String)
    type = Column(String)

    user_id = Column(String, ForeignKey('users.id'))
    user = relationship('User', back_populates='telephones')

    @classmethod
    def findAll(cls, s):
        return s.query(cls).all()




if __name__ == '__main__':
    import logging
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

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
