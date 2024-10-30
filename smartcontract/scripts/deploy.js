const hre = require("hardhat");

async function main() {
  const SmartContract = await hre.ethers.getContractFactory("SmartContract");
  const smartContract = await SmartContract.deploy();

  await smartContract.waitForDeployment();

  console.log("\nSmartContract deployed to:", await smartContract.getAddress());
  console.log("Save this address to use in your interaction scripts!\n");

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
