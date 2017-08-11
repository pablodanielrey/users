from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship

from model_utils import Base


class ResetClave(Base):

    __tablename__ = 'reset_clave'
    __table_args__ = ({'schema': 'users'})

    dni = Column(String)
    intentos = Column(Integer, default=0)


    email = Column('email', String)
    confirmado = Column('confirmed', Boolean, default=False)
    fecha_confirmado = Column(DateTime)
    hash = Column(String)
    eliminado = Column('eliminado', DateTime)

    usuario_id = Column('user_id', String, ForeignKey('profile.users.id'))
    usuario = relationship('Usuario')
