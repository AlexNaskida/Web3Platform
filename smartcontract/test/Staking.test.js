const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {
  let owner, wallet1, wallet2;
  let staking, token, AlexToken;

  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();

    // Compiles the smart contracts and generates its ABIs
    Staking = await ethers.getContractFactory("Staking", owner);
    AlexToken = await ethers.getContractFactory("AlexToken", wallet1);

    // Deploying Smart Contracts
    staking = await Staking.deploy();
    const initialSupply = 5000;
    token = await AlexToken.deploy(initialSupply);

    // Wait for the deployment to be completed
    await staking.waitForDeployment();
    await token.waitForDeployment();

    // Transfer tokens to wallet2
    await token.connect(wallet1).transfer(wallet2.address, 1000);

    // Approve staking contract
    await token.connect(wallet1).approve(await staking.getAddress(), 4000);
    await token.connect(wallet2).approve(await staking.getAddress(), 1000);

    // Encode token symbol
    AlexToken = ethers.encodeBytes32String("AlexToken");

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

      expect(await token.balanceOf(wallet1.address)).to.equal(3500);
      expect(
        await staking.accountBalances(wallet1.address, AlexToken)
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
      await expect(
        token.connect(wallet1).transfer(wallet2.address, 10000)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});
