from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, UUID


class Base(DeclarativeBase):
    pass


URL_DATABASE = 'postgresql://crypto:cryptocrypto@localhost:5432/Crypto_db'
              

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass


class PkBase(Base):
    """Base model with default columns."""

    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)

