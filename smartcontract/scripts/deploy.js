const hre = require("hardhat"); // not used

async function main() {
  [owner] = await ethers.getSigners();

  const SmartContract = await ethers.getContractFactory("SmartContract", owner);
  const OwnToken = await ethers.getContractFactory("AlexToken", owner);

  const smartContract = await SmartContract.deploy();
  const alexToken = await OwnToken.deploy();

  await smartContract.waitForDeployment();
  await alexToken.waitForDeployment();

  console.log("Owner of the SmartContract is:", owner.address);
  console.log("\nSmartContract deployed to:", await smartContract.getAddress());
  console.log("AlexToken deployed to:", await alexToken.getAddress());
  console.log("Save this addresses to use in your interaction scripts!\n");

  owner_balance = await alexToken.balanceOf(owner.address);
  console.log(owner_balance);

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
