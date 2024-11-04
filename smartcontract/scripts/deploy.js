const hre = require("hardhat"); // not used

async function main() {
  console.log(await ethers.getSigners());
  [owner] = await ethers.getSigners();

  const SmartContract = await ethers.getContractFactory("SmartContract", owner);
  const AlexToken = await ethers.getContractFactory("AlexToken", owner);

  const initialSupply = ethers.parseEther("10000");

  const smartContract = await SmartContract.deploy();
  const alexToken = await AlexToken.deploy(initialSupply);

  await smartContract.waitForDeployment();
  await alexToken.waitForDeployment();

  console.log("\nOwner of the SmartContract is:", owner.address);
  console.log("SmartContract deployed to:", await smartContract.getAddress());
  console.log("AlexToken deployed to:", await alexToken.getAddress());
  console.log("Save this addresses to use in your interaction scripts!\n");

  owner_balance = await alexToken.balanceOf(owner.address);
  console.log(
    "Owner has: ",
    owner_balance.toString() / 10 ** 18,
    "amount of Alex Tokens"
  );

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
