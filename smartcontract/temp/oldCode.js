const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("Staking", function () {
  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    console.log("Owner:", owner.address);
    console.log("Wallet 1:", wallet1.address);
    console.log("Wallet 2:", wallet2.address);

    // Getting Smart Contract Factories
    Staking = await ethers.getContractFactory("Staking", owner);
    Token = await ethers.getContractFactory("Token", wallet1);

    console.log("Staking:", Staking);
    console.log("Token:", Token);

    // Deploying Smart Contracts
    const staking = await Staking.deploy();
    await staking.waitForDeployment();

    const token = await Token.deploy();
    await token.waitForDeployment();

    console.log("Staking deployed to:", staking);
    console.log("Token deployed to:", token, token.address);

    token.connect(wallet1).transfer(wallet2.address, 1000);

    console.log(token.connect(wallet1).transfer(wallet2.address, 1000));

    await token.connect(wallet1).approve(staking.address, 4000);
    await token.connect(wallet2).approve(staking.address, 1000);

    TOKEN = ethers.utils.formatBytes32String("TOKEN");
    console.log("-----TOKEN------:", TOKEN);
    await staking.whiteListToken(TOKEN, token.address);
  });

  describe("deployment", function () {
    it("should mint tokens to wallet 1", async function () {
      expect(await token.balanceOf(wallet1.address)).to.equal(4000);
    });

    it("should transfer tokens to wallet 2", async function () {
      expect(await token.balanceOf(wallet2.address)).to.equal(1000);
    });

    it("should whitelist token on the contract", async function () {
      expect(await staking.whitelistedTokens(TOKEN)).to.equal(token.address);
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
      ).to.be.revertedWith("Insufficent funds");
    });
  });
});
