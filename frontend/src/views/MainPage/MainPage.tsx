import CryptoWallet from "@/views/MainPage/components/CryptoWalletDashboard";
import RightSideBar from "@/views/MainPage/RightSideBar";
import CryptoFundActions from "@/views/MainPage/components/CryptoFundActions";

const MainPage = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col w-full h-full items-center pr-10 space-y-10">
        <CryptoWallet />
        <CryptoFundActions />
      </div>
      <RightSideBar />
    </div>
  );
};

export default MainPage;
