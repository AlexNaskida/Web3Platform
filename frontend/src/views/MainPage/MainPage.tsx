import { WalletProvider } from "@/views/MainPage/MainContext";
import MainHeader from "@/views/MainPage/MainHeader";
import CryptoWallet from "@/views/MainPage/components/CryptoWalletDashboard";
import RightSideBar from "@/views/MainPage/RightSideBar";
import CryptoActions from "./components/CryptoActions";

const MainPage = () => {
  return (
    <WalletProvider>
      <div className="flex flex-row w-full h-full overflow-y-hidden">
        <div className="flex flex-col gap-10 w-full h-full py-4 px-10">
          <MainHeader />
          <div className="flex flex-row h-full">
            <div className="flex w-full h-full flex-col items-center pr-10 space-y-10">
              <CryptoWallet />
              <CryptoActions />
            </div>
            <RightSideBar />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default MainPage;
