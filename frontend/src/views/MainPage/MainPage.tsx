import { WalletProvider } from "@/views/MainPage/MainContext";
import MainHeader from "@/views/MainPage/MainHeader";
import CryptoWallet from "@/views/MainPage/components/Wallet/CryptoWallet";
import RightSideBar from "@/views/MainPage/RightSideBar";

const MainPage = () => {
  return (
    <WalletProvider>
      <div className="flex flex-row w-full h-full overflow-y-hidden">
        <div className="flex flex-col gap-10 w-full h-full py-4 px-10">
          <MainHeader />
          <div className="flex flex-row h-full">
            <CryptoWallet />
            <RightSideBar />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default MainPage;
