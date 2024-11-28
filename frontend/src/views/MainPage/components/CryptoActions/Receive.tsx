import { ArrowDownLeft } from "lucide-react";

const Receive = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <button className="flex items-center justify-center size-16 bg-primary rounded-full">
        <ArrowDownLeft size={40} strokeWidth={2} />
      </button>
      <p className="text-lg text-black font-semibold">Receive</p>
    </div>
  );
};

export default Receive;
