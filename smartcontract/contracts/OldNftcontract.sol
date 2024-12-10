// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OldMarketPlace is ReentrancyGuard, Ownable {
    // Mapping to store active listings: listingId => Listing
    mapping(uint256 => Listing) public listings;
    uint256 private listingCounter; // Counter to track listing IDs
   
    // Structure to store information about listed NFTs
    struct Listing {
        address seller;     // Address of the seller
        address nftAddress; // Address of the NFT contract
        uint256 tokenId;    // Token ID of the listed NFT
        uint256 price;     // Price of the NFT in wei
        bool sold;           // Flag to track if the NFT has been sold
    }

    // Event to log when an NFT is listed for sale
    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed nftAddress, uint256 tokenId, uint256 price, bool sold);

    // Event to log when an NFT is purchased
    event NFTSold(uint256 indexed listingId, address indexed buyer, address indexed nftAddress, uint256 tokenId, uint256 price);

    // Function to list an NFT for sale
    function listNFT(address nftAddress, uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be greater than zero");

        // Ensure the caller owns the NFT
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "You must own the NFT to list it");

        // Ensure the marketplace contract is approved to transfer the NFT
        require(nft.getApproved(tokenId) == address(this), "Marketplace must be approved to transfer this NFT");

        // Create a new listing
        listingCounter += 1;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
            sold: false
        });

        emit NFTListed(listingCounter, msg.sender, nftAddress, tokenId, price, false);
    }

    // Function to buy an NFT
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing memory listing = listings[listingId];

        // Ensure the listing exists and the correct price is paid
        require(listing.price > 0, "This listing does not exist");
        require(!listing.sold, "NFT already sold");
        require(msg.value == listing.price, "Incorrect payment amount");

        // Transfer the NFT to the buyer
        IERC721 nft = IERC721(listing.nftAddress);
        nft.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        // Pay the seller
        payable(listing.seller).transfer(listing.price);

        // Remove the listing
        delete listings[listingId];

        emit NFTSold(
            listingId,
            msg.sender,
            listing.nftAddress,
            listing.tokenId,
            listing.price
        );
    }
}