import { Diff } from "lucide-react";

const Swap = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <button className="flex items-center justify-center size-16 bg-orange-600 rounded-full">
        <div className="flex items-center justify-center size-16 bg-orange-600 rounded-full">
          <Diff size={40} strokeWidth={2} className="text-white" />
        </div>
      </button>
      <p className="text-lg text-black font-semibold">Buy/Sell</p>
    </div>
  );
};

export default Swap;
