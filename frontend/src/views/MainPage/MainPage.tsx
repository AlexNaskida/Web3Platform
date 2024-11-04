import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import RightSideBar from "@/views/MainPage/RightSideBar";
import MainHeader from "@/views/MainPage/MainHeader";
import CryptoWallet from "@/views/MainPage/components/Wallet/CryptoWallet";
import { alexToken } from "@/constants/constant";

// remember this issue here:
// how will the react know if for exmaple user has 200 tokens and then someone sent 100 tokens to current user to the wallet. How should i identify this balance change
export type WalletData = {
  address: string;
  // balanceInEth: string;
  // balanceInAlexToken: string;
  connected: boolean;
};

const MainPage = () => {
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const [walletBalance, setWalletBalance] = useState<string>("");
  const [alexTokenBalance, setAlexTokenBalance] = useState<string>("");

  const [ethPriceInUSD, setEthPriceInUSD] = useState<number>(0);
  const [alexTokenPriceInUSD, setAlexTokenPriceInUSD] = useState<number>(0);

  const [walletBalanceInUSD, setWalletBalanceInUSD] = useState<string>("");

  useEffect(() => {
    const storedWalletData = localStorage.getItem("walletData");
    if (storedWalletData) {
      const parsedWalletData: WalletData = JSON.parse(storedWalletData);
      setWalletAddress(parsedWalletData.address);
      // setWalletBalance(parsedWalletData.balanceInEth);
      // setAlexTokenBalance(parsedWalletData.balanceInAlexToken);
      setWalletConnected(parsedWalletData.connected); // Problem here

      getWalletBalance(parsedWalletData.address);
      getAlexTokenBalance(parsedWalletData.address);
      fetchCryptoPricesInUSD();
    }
  }, []);

  useEffect(() => {
    const balanceInEth = parseFloat(walletBalance);
    const ethValueInUSD = balanceInEth * ethPriceInUSD;

    const balanceInAlexToken = parseFloat(alexTokenBalance);

    const alexTokenValueInUSD = balanceInAlexToken * alexTokenPriceInUSD;
    const totalBalanceInUSD = ethValueInUSD + alexTokenValueInUSD;

    setWalletBalanceInUSD(totalBalanceInUSD.toFixed(2));
  }, [walletBalance, alexTokenBalance, ethPriceInUSD, alexTokenPriceInUSD]);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => connectWalletHandler());
  }

  const setWallet = ({
    address,
    connected,
  }: // balanceInEth,
  // balanceInAlexToken,
  WalletData) => {
    const walletData: WalletData = {
      address: address,
      // balanceInEth: balanceInEth,
      // balanceInAlexToken: balanceInAlexToken,
      connected: connected,
    };

    localStorage.setItem("walletData", JSON.stringify(walletData));
  };

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const walletAddresses = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        accountChangeHandler(walletAddresses[0]);
      } catch (error) {
        console.log("Error while connecting Metamask:", error);
        toast({
          title: "Error While Connecting Metamask",
          description: "Please Check Your MetaMask Wallet!",
          variant: "default",
          className: "bg-red-500 text-white border-none",
        });
      }
    } else {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask browser extension to interact!",
        variant: "default",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  const accountChangeHandler = async (account: string) => {
    setWalletAddress(account);
    getWalletBalance(account);
    getAlexTokenBalance(account);
    setWallet({
      address: account,
      // balanceInEth: walletBalance,
      // balanceInAlexToken: alexTokenBalance,
      connected: true,
    });

    fetchCryptoPricesInUSD();
  };

  const getWalletBalance = async (account: string) => {
    if (!window.ethereum) {
      console.log("Error while connecting Metamask. MetaMask is not installed");
      return;
    }
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });

      setWalletBalance(ethers.formatUnits(balance));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getAlexTokenBalance = async (account: string) => {
    if (!window.ethereum) {
      console.log(
        "Error while connecting Metamask. MetaMask is not installed or wallet address is not set"
      );
      return;
    }

    try {
      const balance: string = await alexToken.methods.balanceOf(account).call();
      setAlexTokenBalance(ethers.formatUnits(balance));
    } catch (error) {
      console.error("Error fetching AlexToken balance:", error);
    }
  };

  const fetchCryptoPricesInUSD = async () => {
    setEthPriceInUSD(2646);
    setAlexTokenPriceInUSD(0.1);
    // try {
    //   const response = await fetch(
    //     "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    //   );
    //   const data = await response.json();
    //   setEthPriceInUSD(data.ethereum.usd);
    // } catch (error) {
    //   console.error("Error fetching ETH price:", error);
    //   return null;
    // }
  };

  return (
    <div className="flex flex-row w-full h-full overflow-y-hidden">
      <div className="flex justify-center items-center h-20">
        <Toaster />
      </div>
      <div className="flex flex-col gap-10 w-full h-full py-4 px-10">
        <MainHeader />
        <div className="flex flex-row h-full">
          <CryptoWallet
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            walletBalance={walletBalance}
            alexTokenBalance={alexTokenBalance}
            walletBalanceInUSD={walletBalanceInUSD}
            connectWalletHandler={connectWalletHandler}
          />

          {/* <CryptoPriceCards /> */}
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
