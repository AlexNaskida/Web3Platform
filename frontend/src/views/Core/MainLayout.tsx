import { Outlet } from "react-router-dom";
import MainHeader from "@/views/Core/components/MainHeader";

const MainLayout = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row w-full h-fit overflow-hidden">
        <div className="flex flex-col gap-10 w-full h-full py-4 px-10 ">
          <MainHeader />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
