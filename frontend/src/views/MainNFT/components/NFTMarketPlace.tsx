import { useContext } from "react";
import { MainNFTContext } from "@/views/Core/components/MainNFTContext";
import NFTcard from "@/views/MainNFT/components/NFTcard";

const MarketPlace = () => {
  const { items } = useContext(MainNFTContext);

  return (
    <div className="flex flex-row w-full text-black h-full gap-5 flex-wrap">
      {items && items.length > 0 ? (
        items.map((item) => <NFTcard key={item.id} item={item} />)
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-muted-foreground text-4xl font-semibold">
            No NFTs Found
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
