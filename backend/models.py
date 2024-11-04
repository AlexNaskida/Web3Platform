from sqlalchemy import Column, Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String(60))
    wallet_connected = Column(Boolean, default=False)

    cookies = relationship("Cookies", back_populates="user")


class Wallet(Base):
    __tablename__ = 'crypto_wallets'

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True)
    wallet_balance = Column(Integer)
    wallet_id = Column(Integer, ForeignKey('users.id'))

class Cookies(Base):
    __tablename__ = 'cookies'

    cookie_id = Column(Integer, primary_key=True, index=True)
    cookie_value = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="cookies")
