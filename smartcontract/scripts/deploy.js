const hre = require("hardhat"); // not used

async function main() {
  [owner, wallet1, wallet2] = await ethers.getSigners();

  const SmartContract = await ethers.getContractFactory("SmartContract", owner);
  const AlexToken = await ethers.getContractFactory("AlexToken", owner);

  const NFTSmartContract = await ethers.getContractFactory(
    "NFTSmartContract",
    owner
  );
  const MarketPlace = await ethers.getContractFactory("MarketPlace", owner);

  const initialSupply = ethers.parseEther("1000000"); // 1,000,000 tokens

  const smartContract = await SmartContract.deploy();
  const alexToken = await AlexToken.deploy(initialSupply);

  const NFTsmartcontract = await NFTSmartContract.deploy();
  const marketplace = await MarketPlace.deploy(1);

  await smartContract.waitForDeployment();
  await alexToken.waitForDeployment();

  await NFTsmartcontract.waitForDeployment();
  await marketplace.waitForDeployment();

  console.log("\nOwner of the SmartContract is:", owner.address);
  console.log("Wallet1 Address:", wallet1.address);
  console.log("Wallet2 Address:", wallet2.address, "\n");
  console.log("SmartContract deployed to:", await smartContract.getAddress());
  console.log("AlexToken deployed to:", await alexToken.getAddress(), "\n");
  console.log(
    "NFT Smart Contract deployed to:",
    await NFTsmartcontract.getAddress()
  );
  console.log("NFT Marketplace deployed to:", await marketplace.getAddress());
  console.log("Save this addresses to use in your interaction scripts!\n");

  async function mintTokens(to, amount) {
    const tx = await alexToken.mint(to, amount);
    await tx.wait();
  }

  const recipientWallet1Address = wallet1.address;
  const recipientWallet2Address = wallet2.address;

  const amountToMint1 = ethers.parseUnits("10000", 18); // 10,000 tokens
  const amountToMint2 = ethers.parseUnits("1000", 18); // 1,000 tokens

  mintTokens(recipientWallet1Address, amountToMint1);
  mintTokens(recipientWallet2Address, amountToMint2);

  // const mintAmount = ethers.parseUnits("2000", 18);

  // const tx = await alexToken.mint(owner, mintAmount);
  // await tx.wait();

  // console.log(`Minted ${mintAmount} tokens to ${owner}`);

  // Block information
  // console.log("Transaction Hash:", receipt.transactionHash);
  // console.log("Block Number:", receipt.blockNumber);
  // console.log("Gas Used:", receipt.gasUsed.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Deploy command
// npx hardhat run scripts/deploy.js --network localhost
