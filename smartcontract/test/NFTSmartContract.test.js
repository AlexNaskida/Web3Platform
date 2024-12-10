const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Marketplace", function () {
  let nftContract;
  let marketplaceContract;
  let owner;
  let seller;
  let buyer;
  const feePercent = 5; // 5% marketplace fee

  beforeEach(async function () {
    // Get signers
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy NFT Contract
    const NFTContract = await ethers.getContractFactory("NFTSmartContract");
    nftContract = await NFTContract.connect(seller).deploy();
    await nftContract.waitForDeployment();

    // Deploy Marketplace Contract
    const MarketplaceContract = await ethers.getContractFactory("MarketPlace");
    marketplaceContract = await MarketplaceContract.connect(owner).deploy(
      feePercent
    );
    await marketplaceContract.waitForDeployment();
  });

  describe("NFT Contract", function () {
    it("Should mint a new NFT", async function () {
      const tokenURI = "https://example.com/token1.json";
      const tx = await nftContract.connect(seller).mint(tokenURI);
      const receipt = await tx.wait();

      const tokenId = receipt.logs[0].args[2];
      expect(tokenId).to.equal(1n);

      const ownerOfToken = await nftContract.ownerOf(tokenId);
      expect(ownerOfToken).to.equal(seller.address);
    });
  });

  describe("Marketplace Contract", function () {
    let tokenId;
    const price = ethers.parseEther("1"); // 1 ETH

    beforeEach(async function () {
      // Mint an NFT
      const tokenURI = "https://example.com/token1.json";
      const tx = await nftContract.connect(seller).mint(tokenURI);
      const receipt = await tx.wait();
      tokenId = receipt.events[0].args[2].toNumber();

      // Approve marketplace to transfer NFT
      await nftContract
        .connect(seller)
        .approve(marketplaceContract.address, tokenId);
    });

    it("Should create a marketplace item", async function () {
      const tx = await marketplaceContract
        .connect(seller)
        .createItem(nftContract.address, tokenId, price);
      const receipt = await tx.wait();

      const itemCount = await marketplaceContract.itemCount();
      expect(itemCount).to.equal(1);

      const item = await marketplaceContract.items(itemCount);
      expect(item.id).to.equal(itemCount);
      expect(item.nft.toLowerCase()).to.equal(
        nftContract.address.toLowerCase()
      );
      expect(item.tokenId).to.equal(tokenId);
      expect(item.price).to.equal(price);
      expect(item.seller).to.equal(seller.address);
      expect(item.sold).to.be.false;
    });

    it("Should prevent creating an item with zero price", async function () {
      await expect(
        marketplaceContract
          .connect(seller)
          .createItem(nftContract.address, tokenId, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should purchase a marketplace item", async function () {
      // Create marketplace item
      await marketplaceContract
        .connect(seller)
        .createItem(nftContract.address, tokenId, price);
      const itemCount = await marketplaceContract.itemCount();

      // Calculate total price including fee
      const totalPrice = await marketplaceContract.getTotalPrice(itemCount);

      // Track initial balances
      const sellerInitialBalance = await seller.getBalance();
      const ownerInitialBalance = await owner.getBalance();

      // Purchase item
      const tx = await marketplaceContract
        .connect(buyer)
        .purchaseItem(itemCount, { value: totalPrice });
      const receipt = await tx.wait();

      // Check NFT ownership transferred
      const newOwner = await nftContract.ownerOf(tokenId);
      expect(newOwner).to.equal(buyer.address);

      // Check item marked as sold
      const item = await marketplaceContract.items(itemCount);
      expect(item.sold).to.be.true;

      // Verify seller received correct amount
      const sellerFinalBalance = await seller.getBalance();
      expect(sellerFinalBalance).to.equal(sellerInitialBalance.add(price));
    });

    it("Should calculate total price correctly with marketplace fee", async function () {
      // Create marketplace item
      await marketplaceContract
        .connect(seller)
        .createItem(nftContract.address, tokenId, price);
      const itemCount = await marketplaceContract.itemCount();

      const totalPrice = await marketplaceContract.getTotalPrice(itemCount);
      const expectedTotalPrice = price.mul(105).div(100); // 5% fee
      expect(totalPrice).to.equal(expectedTotalPrice);
    });

    it("Should prevent purchasing an already sold item", async function () {
      // Create and sell item
      await marketplaceContract
        .connect(seller)
        .createItem(nftContract.address, tokenId, price);
      const itemCount = await marketplaceContract.itemCount();
      const totalPrice = await marketplaceContract.getTotalPrice(itemCount);
      await marketplaceContract
        .connect(buyer)
        .purchaseItem(itemCount, { value: totalPrice });

      // Try to purchase again
      await expect(
        marketplaceContract
          .connect(buyer)
          .purchaseItem(itemCount, { value: totalPrice })
      ).to.be.revertedWith("Item already sold");
    });
  });
});
