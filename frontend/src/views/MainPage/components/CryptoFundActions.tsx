import Transfer from "@/views/MainPage/components/CryptoActions/Transfer";
import Receive from "@/views/MainPage/components/CryptoActions/Receive";
import Swap from "@/views/MainPage/components/CryptoActions/Swap";

const CryptoFundActions = () => {
  return (
    <div className="flex flex-row w-full bg-foreground rounded-lg items-center p-4 justify-evenly">
      <Transfer />
      <Receive />
      <Swap />
    </div>
  );
};

export default CryptoFundActions;
