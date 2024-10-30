const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {
  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    // console.log("Owner:", owner.address);
    // console.log("Wallet 1:", wallet1.address);
    // console.log("Wallet 2:", wallet2.address);

    // Compiles the smart contracts and generates its ABIs (Application Binary Interface) along with the bytecodes
    Staking = await ethers.getContractFactory("Staking", owner);
    AlexToken = await ethers.getContractFactory("AlexToken", wallet1); // Gets the 5000 initail supply tokens, since wallet1 is the owner now

    // console.log("------------Staking----------------:", Staking);
    // console.log("------------Token----------------:", AlexToken);

    // Deploying Smart Contracts
    staking = await Staking.deploy();
    token = await AlexToken.deploy();

    // Wait for the deployment to be completed
    await staking.waitForDeployment();
    await token.waitForDeployment();

    // console.log("AlexTokens Smartcontract Address", await token.getAddress());
    // console.log("-----staking------------:", staking);
    // console.log("-----token--------------:", token);

    // Transfer tokens to wallet2
    await token.connect(wallet1).transfer(wallet2.address, 1000);
    //---------------------------------------------------------------------------

    // Approve staking contract(How much the staking contract can spend on behalf of the user)
    await token.connect(wallet1).approve(await staking.getAddress(), 4000);
    await token.connect(wallet2).approve(await staking.getAddress(), 1000);

    // console.log("Staking Address", await staking.getAddress());

    AlexToken = ethers.encodeBytes32String("AlexToken");
    // console.log("----------------AlexToken----------------:", AlexToken);

    // Allow this token to be Staked, by adding to the whitelist
    await staking.connect(owner).Stake(AlexToken, await token.getAddress());
  });

  describe("deployment", function () {
    it("should mint tokens to wallet 1", async function () {
      expect(await token.balanceOf(wallet1.address)).to.equal(4000);
    });

    it("should transfer tokens to wallet 2", async function () {
      expect(await token.balanceOf(wallet2.address)).to.equal(1000);
    });

    it("should whitelist token on the contract", async function () {
      // Changed to match contract mapping name
      expect(await staking.whiteListedTokens(AlexToken)).to.equal(
        await token.getAddress()
      );
    });
  });

  describe("depositTokens", function () {
    it("should deposit token", async function () {
      await staking.connect(wallet1).depositTokens(100, AlexToken);
      await staking.connect(wallet2).depositTokens(50, AlexToken);

      expect(await token.balanceOf(wallet1.address)).to.equal(3900);
      expect(await token.balanceOf(wallet2.address)).to.equal(950);

      expect(
        await staking.accountBalances(wallet1.address, AlexToken)
      ).to.equal(100);
      expect(
        await staking.accountBalances(wallet2.address, AlexToken)
      ).to.equal(50);
    });
  });

  describe("withdraw", function () {
    it("should withdraw tokens from the contract", async function () {
      await staking.connect(wallet1).depositTokens(600, AlexToken);
      await staking.connect(wallet1).withdrawTokens(100, AlexToken);

      expect(await token.balanceOf(wallet1.address)).to.equal(3500); // How many tokens does user have on balance
      expect(
        await staking.accountBalances(wallet1.address, AlexToken) // How many tokens have user staked (Writter in accountBalances mapping)
      ).to.equal(500);
    });

    it("should not allow withdrawing more than has been deposited", async function () {
      await expect(
        staking.connect(wallet1).withdrawTokens(10000, AlexToken)
      ).to.be.revertedWith("Insufficient funds");
    });
  });

  describe("Balance Transfer Exceed", function () {
    it("should not allow to transfer more tokens than the user has.", async function () {
      await expect(token.connect(wallet1).transfer(wallet2.address, 10000)).to
        .be.reverted; // This just checks that it reverts with any error
    });
  });

  // describe("burn", function () {
  //   it("Should Burn tokens", async function () {
  //     await tokens.connect(wallet1).burn(100);

  //     await tokens.connect(wallet2).burn(50);
  //     expect(await token.balanceOf(wallet1.address)).to.equal(3900);
  //     expect(await token.balanceOf(wallet2.address)).to.equal(950);
  //   });
  // });
});
