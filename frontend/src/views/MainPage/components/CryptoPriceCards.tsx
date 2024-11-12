import { Ellipsis } from "lucide-react";

const CryptoPriceCards = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-row w-full justify-between">
        <p className="text-black font-semibold text-lg">Watch list:</p>
        <button>
          <Ellipsis size={25} className="text-black" />
        </button>
      </div>
      <div className="h-full w-96 grid grid-rows-2 grid-cols-2 text-black gap-4">
        <div>
          <div className="h-full bg-background rounded-2xl p-4 text-white">
            cnskonc
          </div>
        </div>
        <div>
          <div className="h-full bg-background rounded-2xl p-4 text-white">
            cnskonc
          </div>
        </div>
        <div>
          <div className="h-full bg-background rounded-2xl p-4 text-white">
            cnskonc
          </div>
        </div>
        <div>
          <div className="h-full bg-background rounded-2xl p-4 text-white">
            cnskonc
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col h-full justify-between">
        <div className="flex items-center w-96 h-20 justify-center border border-border rounded-md"></div>
        <div className="flex items-center w-96 h-20 justify-center border border-border rounded-md"></div>
        <div className="flex items-center w-96 h-20 justify-center border border-border rounded-md"></div>
        <div className="flex items-center w-96 h-20 justify-center border border-border rounded-md"></div>
      </div> */}
    </div>
  );
};

export default CryptoPriceCards;
