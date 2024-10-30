import { ArrowUpDown } from "lucide-react";
// import { useState } from "react";

const CryptoExchange = () => {
  //   const [BitcoinPrice, setBitcoinPrice] = useState<number>(0);
  const BitcoinPrice = "60000$";
  const EthereumPrice = "4000$";

  return (
    <div className="flex flex-col h-fit text-muted-foreground justify-between gap-8 border border-border rounded-lg p-8">
      <p className="text-xl font-medium">Exchange</p>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <div className="size-12 bg-white rounded-full border-3 border-orange-600" />
            <div className="flex flex-col">
              <p className="text-md font-medium">BTC</p>
              <p className="text-sm font-medium">1 BTC = {BitcoinPrice}</p>
            </div>
          </div>
          <p className="text-2xl">0.40</p>
          <p className="text-xs">15,000$</p>
        </div>

        <div className="flex flex-row justify-center items-center">
          <div className="w-full h-[1px] bg-white" />
          <div className="p-1 size-fit bg-white rounded-full">
            <ArrowUpDown size={23} className="text-black" />
          </div>
          <div className="w-full h-[1px] bg-white" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4">
            <div className="size-12 bg-white rounded-full border-3 border-orange-600" />
            <div className="flex flex-col">
              <p className="text-md font-medium">ETH</p>
              <p className="text-sm font-medium">1 ETH = {EthereumPrice}</p>
            </div>
          </div>
          <p className="text-2xl">14</p>
          <p className="text-xs">1,130.01$</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;
