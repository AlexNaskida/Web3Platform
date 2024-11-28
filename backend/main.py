from fastapi import FastAPI, HTTPException, status, Cookie, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import engine, SessionLocal, Base
from pydantic import BaseModel
import models

app = FastAPI()
Base.metadata.create_all(bind=engine)

class ConnectWallet(BaseModel):
    wallet_address: str
    wallet_balance: float
    wallet_AlexToken_balance: float

origins = [
    "http://localhost:8777",
    "http://localhost:8000",
    "http://127.0.0.1:8777",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/wallet_connect")
async def connect_wallet(wallet: ConnectWallet, db: Session = Depends(get_db)):

    wallet_exists = db.execute(
        select(models.Wallet).where(models.Wallet.wallet_address == wallet.wallet_address)
    ).scalar_one_or_none()

    if wallet_exists:
       
        if (wallet_exists.wallet_balance == wallet.wallet_balance and 
            wallet_exists.wallet_AlexToken_balance == wallet.wallet_AlexToken_balance):
            return {"status": 200, "detail": "Wallet Already Exists and is Up to Date"}
        else:
            wallet_exists.wallet_balance = wallet.wallet_balance
            wallet_exists.wallet_AlexToken_balance = wallet.wallet_AlexToken_balance
            db.commit()
            return {"status": 200, "detail": "Wallet Balance Updated Successfully"}

    new_wallet = models.Wallet(
        wallet_address=wallet.wallet_address,
        wallet_balance=wallet.wallet_balance,
        wallet_AlexToken_balance=wallet.wallet_AlexToken_balance
    )
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return {"status": 200, "detail": "Wallet Connected Successfully"}