from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from model_utils import Base

class Mail(Base):

    __tablename__ = 'emails'
    __table_args__ = ({'schema': 'users'})

    email = Column(String)
    confirmed = Column(Boolean, default=False)
    hash = Column(String)
    internal = Column(Boolean, default=False)

    user_id = Column(String, ForeignKey('users.users.id'))
    user = relationship('User', back_populates='mails')
