import React from "react";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Image } from "@nextui-org/react";

type DisplayWalletCardProps = {
  walletBalanceInUSD: string;
  walletAddress: string;
  walletBalance: string;
  alexTokenBalance: string;
};

const DisplayWalletCard = ({
  walletAddress,
  walletBalance,
  alexTokenBalance,
  walletBalanceInUSD,
}: DisplayWalletCardProps) => {
  const [walletCopied, setWalletCopied] = useState<boolean>(false);
  const formatWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}`;
  };

  const formatNumberWithCommas = (number: string) => {
    const parts = number.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const formatCryptoBalaceNumber = (cryptoAmount: string) => {
    const decimalIndex = cryptoAmount.indexOf(".");

    if (decimalIndex !== -1) {
      return `${cryptoAmount.slice(0, decimalIndex + 3)}`;
    }

    return cryptoAmount.slice(0, 6);
  };

  const CopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1000);
  };

  const CryptoStoredInWallet = [
    { crypto: "Ethereum", amount: walletBalance, currency: "ETH", icon: "" },
    {
      crypto: "Alex Token",
      amount: alexTokenBalance,
      currency: "AT",
      icon: "",
    },
    {
      crypto: "crypto-third",
      amount: "100",
      currency: "ETH",
      icon: "",
    },
  ];

  return (
    <div className="flex flex-row p-4 h-full w-full">
      <div className="flex flex-col justify-between w-2/3 h-full">
        <div className="flex flex-col gap-1">
          <p className="text-md text-white">Current Balance</p>
          <p className="text-5xl font-bold text-white">
            ${formatNumberWithCommas(walletBalanceInUSD)}
          </p>
          <div className="flex flex-row mt-2 gap-2">
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

          {/* <p className="text-lg text-white">{walletBalance.slice(0, 7)} ETH</p> */}
        </div>
        <div className="flex flex-row w-full h-32 justify-start items-center gap-4">
          {CryptoStoredInWallet.map((crypto, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex flex-row justify-start items-center gap-1">
                  <div className="size-10 bg-white rounded-full border-3 border-orange-600">
                    <Image
                      src={crypto.icon}
                      alt={crypto.crypto}
                      width={25}
                      height={25}
                    />
                  </div>
                  <p className="text-lg text-white">{crypto.crypto}</p>
                </div>
                <p className="text-lg text-white">
                  {formatCryptoBalaceNumber(crypto.amount)} {crypto.currency}
                </p>

                {index < CryptoStoredInWallet.length - 1 && (
                  <div className="h-full w-[10px] text-white" /> //// this code doesn't work
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 justify-center items-center">
        <div className="flex flex-row items-center gap-4"></div>
      </div> */}
      {/* <div className="flex flex-row w-4/5 justify-evenly">
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
            <div className="flex items-center justify-center size-16 bg-orange-600 rounded-full">
            <Diff size={40} strokeWidth={2} className="text-white" />
          </button>
          <p className="text-lg text-white">Buy/Sell</p>
        </div>
      </div> */}
    </div>
  );
};

export default DisplayWalletCard;
