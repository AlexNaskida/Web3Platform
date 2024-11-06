from sqlalchemy import Column, Boolean, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import PkBase



class User(PkBase):
    __tablename__ = 'users'

    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String(60))
    wallet_connected = Column(Boolean, default=False)

    cookies = relationship("Cookies", back_populates="user")


class Wallet(PkBase):
    __tablename__ = 'crypto_wallets'

    wallet_address = Column(String, unique=True)
    wallet_balance = Column(Integer)
    wallet_id = Column(Integer, ForeignKey('users.id'))


class Cookies(PkBase):
    __tablename__ = 'cookies'

    cookie_value = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)