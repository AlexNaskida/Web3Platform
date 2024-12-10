import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { apiInstance } from "@/hooks/mainhook";
import {
  NFTContract,
  MarketPlaceContract,
  NFTContractAddress,
  MarketPlaceAddress,
} from "@/constants/constant";

export type NFTItem = {
  id: number;
  nft: string;
  MarketPlaceItemId: bigint;
  price: string;
  seller: string;
  sold: boolean;
  name: string;
  description: string;
  image: string;
};

type fetchedNFTItem = {
  id: number;
  nft: string;
  tokenId: bigint;
  price: string;
  seller: string;
  sold: boolean;
};

export const MainNFTContext = createContext<{
  items: NFTItem[];
  loadMarketPlaceItems: () => void;
  fetchImageFromIPFS: (imageURL: string) => void;
  fetchUserWalletAddress: () => string;
  uploadToIPFS: (file: File) => void;
  createNFT: () => void;
  purchaseNFT: (item: NFTItem) => void;
  price: string;
  name: string;
  description: string;
  setPrice: (price: string) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
}>({
  items: [],
  loadMarketPlaceItems: () => {},
  fetchImageFromIPFS: () => {},
  fetchUserWalletAddress: () => "",
  uploadToIPFS: () => {},
  createNFT: () => {},
  purchaseNFT: () => {},
  price: "",
  name: "",
  description: "",
  setPrice: () => {},
  setName: () => {},
  setDescription: () => {},
});

export const NFTMarketPlaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState<NFTItem[]>([]);
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const fetchUserWalletAddress = () => {
    const storedWalletData = localStorage.getItem("walletData");
    if (storedWalletData) {
      const parsedWalletData = JSON.parse(storedWalletData);
      const walletAddress = parsedWalletData.address;
      return walletAddress;
    } else {
      toast({
        title: "Connect Wallet First to Buy NFT",
        variant: "default",
        className: "bg-orange-400 text-white border-none",
      });
      return null;
    }
  };

  const loadMarketPlaceItems = async () => {
    const itemCount = Number(
      await MarketPlaceContract.methods.itemCount().call()
    );
    const items_list: NFTItem[] = [];

    // Problem is here
    for (let i = 1; i <= itemCount; i++) {
      const item: fetchedNFTItem = await MarketPlaceContract.methods
        .items(i)
        .call();
      // console.log("Item: ", item);

      // get uri url from nft contract
      const uri: string = await NFTContract.methods
        .tokenURI(Number(item.tokenId))
        .call();

      // use uri to fetch the nft metadata stored on ipfs
      const response = await apiInstance.post("/fetch_metadata", { uri });

      // console.log("Response------:", response);
      const metadata = response.data.metadata;

      // get total price of item (item price + fee)
      let totalPrice = (await MarketPlaceContract.methods
        .getTotalPrice(item.tokenId)
        .call()) as string;

      totalPrice = ethers.formatEther(totalPrice);

      // Add item to items array
      items_list.push({
        id: i,
        nft: item.nft,
        MarketPlaceItemId: item.tokenId,
        price: totalPrice,
        seller: item.seller,
        sold: item.sold,

        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      });
      console.log("Items LIST: ", items_list);
    }
    setItems(items_list);
  };

  const uploadToIPFS = async (file: File) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await apiInstance.post("/upload_to_ipfs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (result.status === 200) {
          const ipfs_hash = result.data.IPFSHash;
          console.log("IPFS Hash", ipfs_hash);
          setImage(`https://127.0.0.1:5001/ipfs/${ipfs_hash}`);
          // console.log(image);
        } else {
          console.error("Status code error: ", result.status);
        }
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  };

  // Creates metadata for the NFT and stores it on IPFS
  const createNFT = async () => {
    try {
      const data = { name, description, image };

      const result = await apiInstance.post("/create_nft", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        addNFTToMarketPlace(result.data.ipfs_result_hash);
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
  };

  // This can be done in backend.
  const addNFTToMarketPlace = async (hash: string) => {
    const uri = `http://127.0.0.1:5001/ipfs/${hash}`;

    // Mints the NFT
    const response = await NFTContract.methods
      .mint(uri)
      .send({ from: fetchUserWalletAddress() });

    console.log("Response: ", response);

    const id = await NFTContract.methods.tokenCount().call();
    console.log("Current ID: ", id);

    const approvalRequest = await NFTContract.methods
      .setApprovalForAll(MarketPlaceAddress, true)
      .send({ from: fetchUserWalletAddress() });

    console.log("Approval Request: ", approvalRequest);

    const listingPrice = ethers.parseEther(price);

    // Adds nft to marketplace
    const NFTMintingResponse = await MarketPlaceContract.methods
      .createItem(NFTContractAddress, id, listingPrice)
      .send({ from: fetchUserWalletAddress() });

    console.log("Response: ", NFTMintingResponse);
    console.log("NFT Minted Successfully");
    loadMarketPlaceItems();
  };

  const purchaseNFT = async (item: NFTItem) => {
    try {
      console.log("Price: ", item.price);
      console.log("Price Type: ", item.price);
      console.log("Item: ", ethers.parseEther(item.price).toString());

      const tx = await MarketPlaceContract.methods
        .purchaseItem(item.MarketPlaceItemId)
        .send({
          from: fetchUserWalletAddress(),
          value: ethers.parseEther(item.price).toString(),
        });

      console.log("Transaction: ", tx);
    } catch (error) {
      console.error("Error purchasing NFT: ", error);
      toast({
        title: "Couldn't Purchase NFT",
        description: "Check Your Wallet Balance and Please try again later",
        variant: "default",
        className: "bg-red-500 text-white border-none",
      });
    }

    loadMarketPlaceItems();
  };

  const fetchImageFromIPFS = async (imageURL: string) => {
    const response = await apiInstance.post("/fetch_image", {
      imageURL,
    });
    const image = response.data.image;
    return image;
  };

  useEffect(() => {
    loadMarketPlaceItems();
  }, []);

  return (
    <MainNFTContext.Provider
      value={{
        items,
        loadMarketPlaceItems,
        fetchImageFromIPFS,
        fetchUserWalletAddress,
        uploadToIPFS,
        createNFT,
        purchaseNFT,
        price,
        name,
        description,
        setPrice,
        setName,
        setDescription,
      }}
    >
      {children}
      <Toaster />
    </MainNFTContext.Provider>
  );
};

export default NFTMarketPlaceProvider;
