from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import engine, SessionLocal
from pydantic import BaseModel
import models
import bcrypt

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ConnectWallet(BaseModel):
    wallet_address: str
    wallet_balance: int

origins = [
    "http://localhost:8777",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.execute(
        select(models.User).where(models.User.email == user.email)
    ).scalar_one_or_none()
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User doesn't exist"
        )
    
    # Convert the stored hash from string back to bytes
    stored_password = existing_user.password.encode('utf-8')
    
    try:
        if bcrypt.checkpw(user.password.encode('utf-8'), stored_password):
            return {"status": 200, "detail": "User authenticated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid password hash stored in database"
        )

@app.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.execute(
        select(models.User).where(models.User.email == user.email)
    ).scalar_one_or_none()
    
    if existing_user:  # Fixed the logic here
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password and store it as a string
    hashed_password = bcrypt.hashpw(
        user.password.encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')  # Convert bytes to string for storage
    
    # Create new user with hashed password
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": 200, "detail": "User registered successfully"}