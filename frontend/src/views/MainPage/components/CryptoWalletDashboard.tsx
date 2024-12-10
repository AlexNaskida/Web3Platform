import React from "react";
import { useContext } from "react";
import { MainContext } from "@/views/Core/components/MainContext";
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

const CryptoWalletDashboard = () => {
  const {
    walletConnected,
    walletAddress,
    walletBalance,
    alexTokenBalance,
    walletBalanceInUSD,
    connectWalletHandler,
  } = useContext(MainContext);
  
  const formatNumberWithCommas = (number: string) => {
    if (number === "NaN") {
      return "0";
    }
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

  const CryptoStoredInWallet = [
    {
      crypto: "Ethereum",
      amount: walletBalance,
      currency: "ETH",
      icon: "/ethereum.svg",
    },
    {
      crypto: "Alex Token",
      amount: alexTokenBalance,
      currency: "AT",
      icon: "/alexTokenLogo.svg",
    },
    {
      crypto: "Polygon",
      amount: "100",
      currency: "ETH",
      icon: "/polygon.svg",
    },
  ];

  return (
    <div className="flex flex-row h-72 w-full justify-between">
      <div className="flex flex-col w-full h-full bg-primary rounded-xl text-black">
        {walletConnected ? (
          <div className="flex flex-row p-4 h-full w-full">
            <div className="flex flex-col justify-between w-2/3 h-full">
              <div className="flex flex-col gap-1">
                <p className="text-md text-white">Current Balance</p>
                <p className="text-5xl font-bold text-white">
                  ${formatNumberWithCommas(walletBalanceInUSD)}
                </p>
                <div className="flex flex-row mt-2 gap-2">
                  <p className="text-md text-white">{walletAddress}</p>
                </div>

                {/* <p className="text-lg text-white">{walletBalance.slice(0, 7)} ETH</p> */}
              </div>
              <div className="flex flex-row w-full h-32 justify-start items-center gap-4">
                {CryptoStoredInWallet.map((crypto, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col justify-center flex-shrink-0 items-center gap-2">
                      <div className="flex flex-row justify-start items-center gap-1">
                        <div className="flex justify-center items-center size-10 bg-white rounded-full border-2 border-orange-600">
                          <Image
                            src={crypto.icon}
                            alt={crypto.crypto}
                            width={40}
                            height={40}
                          />
                        </div>
                        <p className="text-lg text-white">{crypto.crypto}</p>
                      </div>
                      <p className="text-lg text-white">
                        {formatCryptoBalaceNumber(crypto.amount)}{" "}
                        {crypto.currency}
                      </p>
                    </div>
                    {index < CryptoStoredInWallet.length - 1 && (
                      <div className="h-3/4 w-[2px] bg-white opacity-25" /> //// this code doesn't work
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Button
              onClick={() => connectWalletHandler()}
              className="bg-white text-xl font-semibold px-4 py-2 rounded-xl"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoWalletDashboard;
