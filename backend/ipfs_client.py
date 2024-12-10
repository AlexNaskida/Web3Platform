import os
import json
import requests
from fastapi import UploadFile

IPFS_GATEWAY = os.getenv("IPFS_GATEWAY", "http://127.0.0.1:5001")
IPFS_API_URL = f"{IPFS_GATEWAY}/api/v0/add"
IPFS_API_FETCH_URL = f"{IPFS_GATEWAY}/api/v0/cat?arg="  

async def upload_file_to_ipfs(file: UploadFile):

    files = {"file": await file.read()}

    response = requests.post(IPFS_API_URL, files=files)

    if response.status_code == 200:
        return response.json()["Hash"]
    else:
        raise Exception(f"Error uploading file to IPFS: {response.text}")
    
# Later I may save hashes in the db to quicly retrieve them.
async def upload_metadata_to_ipfs(metadata: dict):
    try:
        metadata = json.dumps(metadata)
        
        files = {"file": ("Metadata JSON", metadata)}

        response = requests.post(IPFS_API_URL, files=files)
        
        if response.status_code == 200:
            return response.json()["Hash"]
        else:
            raise Exception(f"Error uploading metadata to IPFS: {response.text}")

    except Exception as e:
        print(e)
        raise Exception(status_code=500, detail="Error Occured in Metadata Upload to IPFS")


async def fetch_metadata_from_ipfs(uri: str):
    try:
        ipfs_hash = uri.split("/ipfs/")[-1]
        
        fetch_url = f"{IPFS_API_FETCH_URL}{ipfs_hash}"
        
        response = requests.post(fetch_url)
        
        if response.status_code == 200:
            metadata = response.json()
            return metadata
        else:
            raise Exception(f"Error fetching metadata from IPFS: {response.text}")
    
    except Exception as e:
        print(e)
        raise Exception(status_code=500, detail="Error Occurred in Metadata Fetch from IPFS")
    
async def fetch_image_from_ipfs(uri: str):
    try:
        image_ipfs_hash = uri.split("/ipfs/")[-1]

        image_fetch_url = f"{IPFS_API_FETCH_URL}{image_ipfs_hash}"

        response = requests.post(image_fetch_url)

        if response.status_code == 200:
            return response.content
        
        else:
            raise Exception(f"Error fetching Image from IPFS: {response.text}")

    except Exception as e:
        print(e)
        raise Exception(status_code=500, detail="Error Occurred in Image Fetch from IPFS")