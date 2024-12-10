const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlexToken", function () {
  let alexToken;
  let owner;
  let addr1;
  let addr2;
  const initialSupply = ethers.parseEther("1000000");
  const maxSupply = ethers.parseEther("10000000");

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const AlexToken = await ethers.getContractFactory("AlexToken");
    alexToken = await AlexToken.deploy(initialSupply);
    await alexToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await alexToken.owner()).to.equal(owner.address);
    });

    it("Should have correct initial supply", async function () {
      const balance = await alexToken.balanceOf(owner.address);
      expect(balance).to.equal(initialSupply);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await alexToken.name()).to.equal("Alex Token");
      expect(await alexToken.symbol()).to.equal("AT");
    });

    it("Should have the correct max supply", async function () {
      expect(await alexToken.MAX_SUPPLY()).to.equal(maxSupply);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await alexToken.mint(addr1.address, mintAmount);
      expect(await alexToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should emit TokensMinted event", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(alexToken.mint(addr1.address, mintAmount))
        .to.emit(alexToken, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should not allow minting above max supply", async function () {
      // Calculate how much can be minted
      const remainingSupply = maxSupply - initialSupply;
      const overMaxAmount = ethers.parseEther("1");

      // Attempt to mint more than the max supply
      await expect(
        alexToken.mint(addr1.address, remainingSupply + overMaxAmount)
      ).to.be.revertedWith("Would exceed max supply");
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        alexToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for burning tests
      await alexToken.transfer(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("500");
      const initialBalance = await alexToken.balanceOf(addr1.address);

      await alexToken.connect(addr1).burn(burnAmount);

      const finalBalance = await alexToken.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("500");
      await expect(alexToken.connect(addr1).burn(burnAmount))
        .to.emit(alexToken, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should not allow burning more than balance", async function () {
      const tooMuch = ethers.parseEther("2000");
      await expect(alexToken.connect(addr1).burn(tooMuch)).to.be.revertedWith(
        "ERC20: burn amount exceeds balance"
      );
    });
  });

  describe("Supply tracking", function () {
    it("Should correctly track total supply after minting", async function () {
      const mintAmount = ethers.parseEther("1000");
      const initialSupplyTracked = await alexToken.getCurrentSupply();

      await alexToken.mint(addr1.address, mintAmount);

      const finalSupplyTracked = await alexToken.getCurrentSupply();
      expect(finalSupplyTracked).to.equal(initialSupplyTracked + mintAmount);
    });

    it("Should correctly track total supply after burning", async function () {
      // Transfer and burn tokens
      await alexToken.transfer(addr1.address, ethers.parseEther("1000"));
      const burnAmount = ethers.parseEther("500");
      const initialSupplyTracked = await alexToken.getCurrentSupply();

      await alexToken.connect(addr1).burn(burnAmount);

      const finalSupplyTracked = await alexToken.getCurrentSupply();
      expect(finalSupplyTracked).to.equal(initialSupplyTracked - burnAmount);
    });
  });
});
