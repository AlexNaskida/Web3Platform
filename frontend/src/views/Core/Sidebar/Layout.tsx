import Sidebar from "@/views/Core/Sidebar/Sidebar";
import MainLayout from "@/views/Core/MainPages/Layout";

const CoreLayout = () => {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <MainLayout />
    </div>
  );
};

export default CoreLayout;
