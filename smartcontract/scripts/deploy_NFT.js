async function main() {
  [owner, wallet1, wallet2] = await ethers.getSigners();

  const NFTSmartContract = await ethers.getContractFactory("NFTSmartContract");
  const MarketPlace = await ethers.getContractFactory("MarketPlace");

  const NFTsmartcontract = await NFTSmartContract.deploy();
  const marketplace = await MarketPlace.deploy(1);

  await NFTsmartcontract.waitForDeployment();
  await marketplace.waitForDeployment();

  console.log(
    "\nAddress of the NFT SmartContract is:",
    await NFTsmartcontract.getAddress()
  );
  console.log(
    "Address of the MarketPlace Smartcontract is:",
    await marketplace.getAddress()
  );
  console.log("\nAddress of the Owner is:", owner.address);
  console.log("Address of the Wallet1 is:", wallet1.address);
  console.log("Address of the Wallet2 is:", wallet2.address);

  const ownerBalance = await ethers.provider.getBalance(owner.address);
  const wallet1Balance = await ethers.provider.getBalance(wallet1.address);
  const wallet2Balance = await ethers.provider.getBalance(wallet2.address);

  console.log("\nOwner Balance: ", ethers.formatEther(ownerBalance), "ETH");
  console.log("Wallet1 Balance: ", ethers.formatEther(wallet1Balance), "ETH");
  console.log("Wallet2 Balance: ", ethers.formatEther(wallet2Balance), "ETH");

  // Does the same as npx hardhat compile
  //   saveFrontendFiles(NFTsmartcontract, "NFTSmartContract");

  //   function saveFrontendFiles(contract, name) {
  //     const fs = require("fs");
  //     const contractsDir = __dirname + "/../NFTContractFiles";

  //     console.log(contractsDir);
  //     console.log("-----------------------------------");
  //     if (!fs.existsSync(contractsDir)) {
  //       fs.mkdirSync(contractsDir);
  //     }

  //     fs.writeFileSync(
  //       contractsDir + `/${name}-address.json`,
  //       JSON.stringify({ address: contract.address }, undefined, 2)
  //     );

  //     const contractArtifact = artifacts.readArtifactSync(name);
  //     console.log("contractArtifact: ", contractArtifact);

  //     fs.writeFileSync(
  //       contractsDir + `/${name}.json`,
  //       JSON.stringify(contractArtifact, null, 2)
  //     );
  //   }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
