import { Bell, Search } from "lucide-react";

const MainHeader = () => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex items-center p-4 h-12">
        <p className="text-2xl text-black font-bold">Dashboard</p>
      </div>
      <div className="flex flex-row w-2/5 justify-end gap-5">
        <div className="flex flex-row gap-4 justify-start items-center px-4 w-1/2 bg-foreground rounded-full">
          <Search size={25} className="text-primary" />
          <p className="text-lg text-muted-foreground">Search...</p>
        </div>
        <div className="flex items-center justify-center size-12 bg-foreground p-1 border-3 border-primary rounded-full">
          <Bell size={30} className="text-primary" />
        </div>
        <div className="size-12 bg-white rounded-full border-3 border-orange-600" />
      </div>
    </div>
  );
};

export default MainHeader;
