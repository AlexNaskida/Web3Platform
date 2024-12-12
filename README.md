## FirstProject

Welcome to Web3 World!

This project is a Web3 platform that enables users to engage in cryptocurrency transactions, including buying, selling, and transferring various digital assets. In the future, we intend to incorporate a staking contract, allowing users to earn rewards by depositing their cryptocurrencies into secure vaults. 🚀💰

## Features

- Wallet Integration
- Fund Management (with the potential for future swapping functionality)
- NFT Token Creation
- NFT Token Trading on the Marketplace (with the possibility of introducing bidding)

## Deployment Process

### Required Software

- IPFS
- Docker

### Deployment Stages

For usage of Crypto Platform, follow these steps:

#### Clone the repository:

```bash
git clone https://github.com/AlexNaskida/Web3Platform.git
```

#### Launch the Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Installing Requirements, Launch Backend, Database, and IPFS

```bash
cd Web3Platform/smartcontract
npm install
```

##### Running the Database

```bash
docker-compose up -d
```

##### Running the IPFS

```bash
Run the IPFS Desktop App
```

##### Running the Backend

```bash
cd backend
python3 -m venv backend/venv
venv\Scripts\activate (Windows)
source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
uvicorn main:app —reload
```

#### Compiling the Contract

```bash
cd smartcontract
npm install
npx hardhat compile
```

Copy the Created JSON ABI file to the frontend’s src/assets directory.
Then, in the smart contract directory, execute the following commands:

#### Launching the Blockchain and Smart Contracts

```bash
npx hardhat node
npx hardhat run scripts/deploy.js —network localhost
```

This will launch the chain, deploy the tokens, and NFTs.

Now you will be able to see the smart contract on the chain

Double-check the contract address. Compare it to the address written in src/constants/constant.ts file.

Note: Some functionalities are still in development or need to be fixed

## Feel Free to Start Exploring the Platform…
