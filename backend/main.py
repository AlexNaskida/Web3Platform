from fastapi import FastAPI, HTTPException, status, Cookie, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import engine, SessionLocal
from pydantic import BaseModel
import models
import secrets
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
async def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    print("Response: ", response)

    existing_user = db.execute(
        select(models.User).where(models.User.email == user.email)
    ).scalar_one_or_none()
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User doesn't exist"
        )
    
    stored_password = existing_user.password.encode('utf-8')
    
    try:
        if bcrypt.checkpw(user.password.encode('utf-8'), stored_password):
            session_id = secrets.token_urlsafe(32)

            #  Save cookie to database that created in models.py
            
            print("Session ID: ", session_id)
            response.set_cookie(
                key="cookie",
                value=session_id,
                httponly=True,
                secure=False,  # Set to True in production
                samesite="lax",
                max_age=1800,
                path="/"
            )
            return {"status": 200, "detail": "User authenticated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid password hash stored in database"
        )


#  Not used now.
def check_auth(session_id: str = Cookie(None), db: Session = Depends(get_db)):
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user_cookie = db.query(models.Cookies).filter(models.Cookies.cookie_value == session_id).first()
    print(user_cookie)

    if user_cookie is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Retrieve the user associated with the cookie
    user = db.query(models.User).filter(models.User.id == user_cookie.user_id).first()
    
    # Check if the user exists
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return the user's email if everything is valid
    return {"status": 200, "detail": "Authenticated"}
    # return {"status": 200, "detail": "Authenticated", "email": user.email} /// return what you need here. e.g. if user access the profile page return everything


@app.post("/logout")
async def logout(response: Response, session_id: str = Cookie(default=None, alias="cookie")): # Alias is used to rename the cookie
    print("Session ID: ", session_id)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    try:
        response.delete_cookie(
            key="cookie",
            path="/",
            httponly=True,
            secure=False
        )
        return {"status_code": status.HTTP_200_OK, "detail": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )



@app.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.execute(
        select(models.User).where(models.User.email == user.email)
    ).scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = bcrypt.hashpw(
        user.password.encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": 200, "detail": "User registered successfully"}

