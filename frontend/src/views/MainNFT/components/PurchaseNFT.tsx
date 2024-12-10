import { useContext } from "react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import { NFTItem } from "@/views/Core/components/MainNFTContext";
import { MainNFTContext } from "@/views/Core/components/MainNFTContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface NFTCardProps {
  item: NFTItem;
  image: string;
}

const PurchaseNFT = ({ item, image }: NFTCardProps) => {
  const { purchaseNFT } = useContext(MainNFTContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 w-2/3 text-white text-lg font-bold">
          Buy
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1200px] h-4/5 text-muted-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl text-black font-bold">
            Purchase NFT
          </DialogTitle>
          <DialogDescription className="text-lg font-medium">
            Purchase this NFT and add it to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row w-full gap-2">
          <div className="flex justify-center w-1/2 flex-shrink-0">
            <Image src={image} alt={item.name} />
          </div>
          <div className="flex flex-col w-1/2 justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-black text-center w-full">
                {item.name}
              </h2>
              <h3 className="text-xl font-semibold text-center w-full">
                {item.description}
              </h3>
              <span className="text-lg font-semibold">
                Marketplace Item ID:
                <p className="text-2xl text-primary font-bold">
                  {item.MarketPlaceItemId.toString()}
                </p>
              </span>
              <span className="text-lg font-semibold">
                Price:{" "}
                <p className="text-2xl text-primary font-bold">
                  {item.price} ETH = ${Number(item.price) * 3800}
                </p>
              </span>
              {/* <span className="text-lg font-semibold">
                Price in USD:{" "}
                <p className="text-2xl text-primary font-bold">
                  ${Number(item.price) * 3800}
                </p>
              </span> */}

              <span className="text-lg font-semibold">
                Seller:
                <p className="text-xl text-primary font-bold">{item.seller}</p>
              </span>
              <span className="text-lg font-semibold">
                NFT Collection:
                <p className="text-xl text-primary font-bold">{item.nft}</p>
              </span>
              <span className="text-lg font-semibold">
                Status:{" "}
                {!item.sold ? (
                  <span className="text-xl text-green-600">On-Sale</span>
                ) : (
                  <span className="text-xl text-red-600">Sold</span>
                )}
              </span>
            </div>
            <DialogClose asChild>
              <Button
                className="flex justify-center w-full bg-primary text-md text-white font-semibold hover:scale-105"
                type="submit"
                onClick={() => purchaseNFT(item)}
              >
                Purchase NFT for {item.price} ETH
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseNFT;
