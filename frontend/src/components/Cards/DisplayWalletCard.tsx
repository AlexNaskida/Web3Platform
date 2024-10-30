import { useState } from "react";
import { Copy, ArrowUpRight, ArrowRightLeft, Diff } from "lucide-react";

type DisplayWalletCardProps = {
  walletBalanceInUSD: string;
  walletAddress: string;
  walletBalance: string;
};

const DisplayWalletCard = ({
  walletAddress,
  walletBalance,
  walletBalanceInUSD,
}: DisplayWalletCardProps) => {
  const [walletCopied, setWalletCopied] = useState<boolean>(false);
  const formatWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 7)}...${walletAddress.slice(-4)}`;
  };

  const formatNumberWithCommas = (number: string) => {
    const parts = number.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const CopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1000);
  };

  return (
    <div className="flex flex-col w-full justify-center gap-10 items-center">
      <p className="text-xl text-white">My Wallet</p>

      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-4xl text-white">{walletBalance.slice(0, 7)} ETH</p>
        <p className="text-2xl text-white">
          ${formatNumberWithCommas(walletBalanceInUSD)}
        </p>
        <div className="flex flex-row items-center gap-4">
          <p className="text-md text-white">
            {formatWalletAddress(walletAddress)}
          </p>
          <button
            title="Copy wallet address"
            onClick={() => CopyWalletAddress()}
          >
            <Copy className="text-white" size={16} />
          </button>
          {walletCopied && <p className="text-secondary">Copied!</p>}
        </div>
      </div>
      <div className="flex flex-row w-4/5 justify-evenly">
        <div className="flex flex-col gap-2 justify-center items-center">
          <button className="flex items-center justify-center size-16 bg-white rounded-full">
            <ArrowUpRight size={40} strokeWidth={2} />
          </button>
          <p className="text-lg text-white">Send</p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <button className="flex items-center justify-center size-16 bg-white rounded-full">
            <ArrowRightLeft size={40} strokeWidth={2} />
          </button>
          <p className="text-lg text-white">Exchange</p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <button className="flex items-center justify-center size-16 bg-orange-600 rounded-full">
            {/* <div className="flex items-center justify-center size-16 bg-orange-600 rounded-full"> */}
            <Diff size={40} strokeWidth={2} className="text-white" />
          </button>
          <p className="text-lg text-white">Buy/Sell</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayWalletCard;
