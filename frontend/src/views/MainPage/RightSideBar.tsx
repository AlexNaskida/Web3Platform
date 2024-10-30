import CryptoExchange from "@/views/MainPage/components/CryptoExchange";

const RightSideBar = () => {
  return (
    <div className="w-5/12 bg-primary-foreground rounded-lg p-4">
      <CryptoExchange />
    </div>
  );
};

export default RightSideBar;
