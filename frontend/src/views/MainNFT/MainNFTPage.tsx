import MarketPlace from "@/views/MainNFT/components/NFTMarketPlace";
import NFTMarketPlaceProvider from "@/views/Core/components/MainNFTContext";
import CreateNFT from "@/views/MainNFT/components/CreateNFT";

const MainNFTPage = () => {
  return (
    <NFTMarketPlaceProvider>
      <div className="flex flex-col h-full">
        <div className="flex justify-end h-12">
          <CreateNFT />
        </div>
        <div className="h-3/5">
          <MarketPlace />
        </div>
      </div>
    </NFTMarketPlaceProvider>
  );
};

export default MainNFTPage;
