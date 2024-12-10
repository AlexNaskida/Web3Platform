import SideMenu from "@/components/Button/SideMenu";
import { Image } from "@nextui-org/react";
import {
  LayoutGrid,
  Settings,
  GalleryVerticalEnd,
  AlignHorizontalDistributeCenter,
} from "lucide-react";

import { Link } from "react-router-dom";
// import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-10 bg-foreground min-w-72 p-4">
      <Link to="/">
        <div className="flex flex-row gap-4 justify-start items-center h-12 px-3">
          <Image src="/CryptoCoin.svg" width={45} height={45} />
          <h1 className="text-center text-black text-2xl font-bold">
            CryptoCoin
          </h1>
        </div>
      </Link>
      {/* <Separator /> */}
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5">
          <SideMenu
            to="/"
            text="Dashboard"
            icon={<LayoutGrid size={22} strokeWidth={2.5} />}
          />
          <SideMenu
            to="/crypto"
            text="Crypto Trading"
            icon={
              <AlignHorizontalDistributeCenter size={22} strokeWidth={2.5} />
            }
          />
          <SideMenu
            to="/nft"
            text="NFT Album"
            icon={<GalleryVerticalEnd size={22} strokeWidth={2.5} />}
          />

          <SideMenu
            to="/settings"
            text="Settings"
            icon={<Settings size={22} strokeWidth={2.5} />}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
