# FirstProject

Welcome to Web3 World!

This project is a Web3 platform, where you can buy, transfer and sell different cryptocurrencies and also trade NFTs. In future we're thinking of adding the staking contract allow users to receive rewards for putting their crypto into the secure vaults.🚀💰

## Features

- Wallet Connection
- Funds Manipulation (+ later swapping will be added)
- NFT token creation
- NFT token selling and buying on marketplace (+ maybe bidding will be introduced)

## How to Deploy

### Required Apps

- Installed IPFS
- Docker

### Stages of Deployment

To get started with Crypto Platfrom Project, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/AlexNaskida/Web3Platform.git
    ```

2.  Fire up Frontend

    #### Running the Frontend

    ```bash
    cd Web3Platform/frontend
    npm install
    npm run dev
    ```

3.  Fire up Backend + DB + IPFS

    #### Installing the requirements

    ```bash
    cd Web3Platform/smartcontract
    npm install
    docker-compose up -d
    Open the
    ```

    #### Running the Database

    ```bash
    docker-compose up -d
    ```

    #### Running the IPFS

    ```bash
    docker-compose up -d
    ```

    #### Running the Backend

    ```bash
    uvicorn main:app --reload
    ```

4.  Lauching Blockchain and Smartcontracts:

    #### Compiling the contract

    ```bash
    cd Web3Platform/smartcontract
    npm install
    npx hardhat compile
    ```

    Copy the Created JSON ABI file to the frontend src/assets directory.
    Then in smartcontract direcotry run the following:

    #### Launching the chain, tokens and NFTs

    ```bash
     npx hardhat node
     npx hardhat run scripts/deploy.js --network localhost
    ```

    Not you will be able to see the smartcontract on the chain

    Note: Double check the contract address. Compare them to the address written in src/constants/constant.ts file

## Usage

To run the application, use the following command:

```bash
npm start
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

If you have any questions or feedback, feel free to reach out to us at [your email address].

Thank you for using Our Platform!
