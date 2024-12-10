import { Image } from "@nextui-org/react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useContext } from "react";
import { NFTItem } from "@/views/Core/components/MainNFTContext";
import { MainNFTContext } from "@/views/Core/components/MainNFTContext";
import PurchaseNFT from "@/views/MainNFT/components/PurchaseNFT";

interface NFTCardProps {
  item: NFTItem;
}

const NFTcard = ({ item }: NFTCardProps) => {
  const { toast } = useToast();
  const { fetchImageFromIPFS } = useContext(MainNFTContext);
  const imageUrl = item.image;

  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      try {
        const fetchedImage = await fetchImageFromIPFS(imageUrl);

        if (typeof fetchedImage === "string") {
          setImage(fetchedImage);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setImage("");
        toast({
          title: "Wasn't able to fetch image",
          variant: "default",
          className: "bg-red-400 text-white border-none",
        });
      }
    };

    loadImage();
  }, [imageUrl, fetchImageFromIPFS, toast]);

  const formatWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 10)}...${walletAddress.slice(-7)}`;
  };

  return (
    <div
      key={item.id}
      className="flex flex-col h-full w-72 rounded-2xl border-2 border-primary flex-shrink-0 hover:scale-105"
    >
      <div className="h-64 overflow-hidden flex-shrink-0">
        <Image src={image} alt={item.name} />
      </div>
      <div className="flex flex-col justify-between py-1 px-2 h-48 border-t-2 border-primary flex-shrink-0">
        <div className="flex flex-col h-32 justify-between">
          <div>
            <p className="text-xl font-bold">{item.name}</p>
            <p className="text-md font-medium line-clamp-2">
              {item.description}
            </p>
          </div>

          <div>
            <p className="text-md font-semibold">
              Seller: {formatWalletAddress(item.seller)}
            </p>
            <p className="text-lg font-bold">Price: {item.price} ETH</p>
          </div>
        </div>

        <div className="flex justify-center">
          {item.sold ? (
            <p className="text-red-600 font-bold text-3xl">Sold</p>
          ) : (
            <PurchaseNFT item={item} image={image} />
            //  Make bying impossible if user wallet account isn't connected
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTcard;
