from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status, Cookie, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import engine, SessionLocal, Base
from pydantic import BaseModel
from ipfs_client import upload_file_to_ipfs, upload_metadata_to_ipfs, fetch_metadata_from_ipfs, fetch_image_from_ipfs
import models
import base64

app = FastAPI()
Base.metadata.create_all(bind=engine)

class ConnectWallet(BaseModel):
    wallet_address: str
    wallet_balance: float
    wallet_AlexToken_balance: float

class CreateNFT(BaseModel):
    name: str
    description: str
    image: str

class MetadataRequest(BaseModel):
    uri: str

class ImageRequest(BaseModel):
    imageURL: str

origins = [
    "http://localhost:8777",
    "http://localhost:8000",
    "http://127.0.0.1:8777",
    "http://127.0.0.1:8000"
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

@app.post("/wallet_connect")
async def connect_wallet(wallet: ConnectWallet, db: Session = Depends(get_db)):
    
    wallet_exists = db.execute(
        select(models.Wallet).where(models.Wallet.wallet_address == wallet.wallet_address)
    ).scalar_one_or_none()

    if wallet_exists:
       
        if (wallet_exists.wallet_balance == wallet.wallet_balance and 
            wallet_exists.wallet_AlexToken_balance == wallet.wallet_AlexToken_balance):
            return {"status": 200, "detail": "Wallet Exists and is Up to Date"}
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


@app.post("/upload_to_ipfs")
async def upload_to_ipfs(file: UploadFile = File(...)):
    try:
        ipfs_hash = await upload_file_to_ipfs(file)
        return {"status": 200, "detail": "File uploaded to IPFS successfully.", "IPFSHash": ipfs_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Occured in File Upload to IPFS: {str(e)}")
        

@app.post("/create_nft")
async def create_nft(metadata: CreateNFT):

    name = metadata.name
    description = metadata.description
    image = metadata.image

    try:
        ipfs_result_hash = await upload_metadata_to_ipfs({
            "name": name,
            "description": description,
            "image": image,
        })

        if ipfs_result_hash:
            return {"status": 200, "detail": "NFT created successfully", "ipfs_result_hash": ipfs_result_hash}
       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Occured in Metadata Upload to IPFS: {str(e)}")


@app.post("/fetch_metadata")
async def fetch_metadata(request: MetadataRequest):
    uri = request.uri
    try:
        data = await fetch_metadata_from_ipfs(uri)
        if data:
            return {"status": 200, "detail": "Metadata fetched successfully", "metadata": data}
       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Occured in Metadata from IPFS: {str(e)}")


@app.post("/fetch_image")
async def fetch_image(request: ImageRequest):
    image_uri = request.imageURL
    try:
        image = await fetch_image_from_ipfs(image_uri)
               

        if image:
            base64_image = base64.b64encode(image).decode('utf-8')

        return {
            "status": 200, 
            "detail": "Image fetched successfully", 
            "image": f"data:image/jpeg;base64,{base64_image}"
        }       
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Occured in Metadata from IPFS: {str(e)}")
