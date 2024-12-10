const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("SmartContract", function () {
  async function deployContractAndSetVariables() {
    const SmartContract = await ethers.getContractFactory("SmartContract");
    const smartContract = await SmartContract.deploy();

    await smartContract.waitForDeployment();
    const [owner] = await ethers.getSigners();
    // const [owner, signer1, signer2] = await ethers.getSigners();

    // console.log(
    //   "-------------------------Signer 1-------------------------",
    //   signer1,
    //   signer1.address
    // );
    // console.log(
    //   "-------------------------Signer 1-------------------------",
    //   signer2,
    //   signer2.address
    // );

    console.log("Smart Contract owner is:", owner.address);
    return { smartContract, owner };
  }

  it("Should deploy and set the owner of the contrats", async function () {
    const { smartContract, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(await smartContract.owner()).to.equal(owner.address);
  });
});
