from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from model_utils import Base


class ResetClave(Base):

    __tablename__ = 'reset_clave'
    __table_args__ = ({'schema': 'users'})

    dni = Column(String)
    intentos = Column(Integer, default=0)

    usuario_id = Column('user_id', String, ForeignKey('profile.users.id'))
    usuario = relationship('Usuario')
