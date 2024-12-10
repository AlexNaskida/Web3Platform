import { WalletProvider } from "@/views/Core/components/MainContext";
import Sidebar from "@/views/Core/Sidebar/Sidebar";
import MainLayout from "@/views/Core/MainLayout";

const CoreLayout = () => {
  return (
    <WalletProvider>
      <div className="flex flex-row min-w-screen min-h-screen">
        <Sidebar />
        <MainLayout />
      </div>
    </WalletProvider>
  );
};

export default CoreLayout;
