import { UserRound } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useContext } from "react";
import { MainContext } from "@/views/MainPage/MainContext";

const MainHeader = () => {
  const { connectWalletHandler } = useContext(MainContext);

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex items-center p-4 h-12">
        <p className="text-2xl text-black font-bold">Dashboard</p>
      </div>
      <div className="flex flex-row w-2/5 justify-end gap-5">
        <button
          className="flex flex-row gap-2 justify-start items-center px-4 w-fit bg-foreground border-3 border-primary rounded-full hover:bg-primary-50"
          onClick={() => connectWalletHandler()}
        >
          <p className="text-lg font-bold text-primary">Connect Wallet</p>
          <Image src="/MetaMaskLogo.png" width={40} height={40} />
        </button>
        {/* <div className="flex items-center justify-center size-12 bg-foreground p-1 border-3 border-primary rounded-full">
          <Bell size={30} className="text-primary" />
        </div> */}
        <button className="flex justify-center items-center size-12 bg-white border-3 border-muted-foreground rounded-full hover:bg-primary-50">
          <UserRound size={40} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
