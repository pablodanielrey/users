from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from model_utils import Base

class Telephone(Base):

    __tablename__ = 'telephones'
    __table_args__ = ({'schema': 'users'})


    number = Column(String)
    type = Column(String)

    user_id = Column(String, ForeignKey('users.users.id'))
    user = relationship('User', back_populates='telephones')
