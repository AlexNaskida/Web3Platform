const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {
  let Staking, Token, staking, token, owner, wallet1, wallet2, TOKEN;

  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    console.log("Owner:", owner.address);
    console.log("Wallet 1:", wallet1.address);
    console.log("Wallet 2:", wallet2.address);

    // Getting Smart Contract Factories
    Staking = await ethers.getContractFactory("Staking", owner);
    Token = await ethers.getContractFactory("Token", wallet1);

    // Deploying Smart Contracts
    staking = await Staking.deploy();
    await staking.waitForDeployment();

    token = await Token.deploy();
    await token.waitForDeployment();

    // Transfer tokens to wallet2
    await token.connect(wallet1).transfer(wallet2.address, 1000);

    // Approve staking contract
    await token.connect(wallet1).approve(await staking.getAddress(), 4000);
    await token.connect(wallet2).approve(await staking.getAddress(), 1000);

    TOKEN = ethers.encodeBytes32String("TOKEN");
    // Changed to use Stake function and connect with owner
    await staking.connect(owner).Stake(TOKEN, await token.getAddress());
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
      expect(await staking.whiteListedTokens(TOKEN)).to.equal(
        await token.getAddress()
      );
    });
  });

  describe("depositTokens", function () {
    it("should deposit token", async function () {
      await staking.connect(wallet1).depositTokens(100, TOKEN);
      await staking.connect(wallet2).depositTokens(50, TOKEN);

      expect(await token.balanceOf(wallet1.address)).to.equal(3900);
      expect(await token.balanceOf(wallet2.address)).to.equal(950);

      expect(await staking.accountBalances(wallet1.address, TOKEN)).to.equal(
        100
      );
      expect(await staking.accountBalances(wallet2.address, TOKEN)).to.equal(
        50
      );
    });
  });

  describe("withdraw", function () {
    it("should withdraw tokens from the contract", async function () {
      await staking.connect(wallet1).depositTokens(600, TOKEN);
      await staking.connect(wallet1).withdrawTokens(100, TOKEN);

      expect(await token.balanceOf(wallet1.address)).to.equal(3500);
      expect(await staking.accountBalances(wallet1.address, TOKEN)).to.equal(
        500
      );
    });

    it("should not allow withdrawing more than has been deposited", async function () {
      await expect(
        staking.connect(wallet1).withdrawTokens(10000, TOKEN)
      ).to.be.revertedWith("Insufficient funds");
    });
  });
});
