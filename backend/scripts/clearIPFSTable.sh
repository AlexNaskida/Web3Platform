#!/bin/bash

echo "[*] IPFS Cleanup Started..."

# Fetch pinned CIDs
data=$(curl -sX POST http://127.0.0.1:5001/api/v0/pin/ls)
extractedValues=$(echo "$data" | jq -r '.Keys | keys_unsorted[]')

# Check for errors
if [[ $? -ne 0 ]]; then
    echo "[-] Something Went Wrong!!! Exiting..."
    exit 1
fi

# Remove each CID
for i in $extractedValues; do
    echo "[*] Removing Following CID: $i"
    curl -sX POST "http://127.0.0.1:5001/api/v0/pin/rm?arg=$i" > /dev/null
    echo "[*] CID Removed Successfully"
    echo "--------------------------------------------------------"
done

echo "[*] Listing All CIDs to Ensure Everything Was Deleted..."
doubleCheck=$(curl -sX POST http://127.0.0.1:5001/api/v0/pin/ls)

# Verify if cleanup succeeded
if [[ "$doubleCheck" == '{"Keys":{}}' ]]; then
    echo "[*] IPFS Cleanup Completed. Exiting"
    exit 0
else
    echo "[-] Some CIDs Still Remain!!!"
    echo "$doubleCheck"
fi

