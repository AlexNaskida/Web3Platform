import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { alexToken } from "@/constants/constant";

export type WalletData = {
  address: string;
  // balanceInEth: string;
  // balanceInAlexToken: string;
  connected: boolean;
};

export const MainContext = createContext<{
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  alexTokenBalance: string;
  walletBalanceInUSD: string;
  connectWalletHandler: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}>({
  walletConnected: false,
  walletAddress: "",
  walletBalance: "",
  alexTokenBalance: "",
  walletBalanceInUSD: "",
  connectWalletHandler: async () => {},
  disconnectWallet: async () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
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

  const disconnectWallet = async () => {
    localStorage.removeItem("walletData");
    setWalletConnected(false);
    setWalletAddress("");
    setWalletBalance("");
    setAlexTokenBalance("");
    setWalletBalance("");
    toast({
      title: "Wallet Disconnected Successfully",
      variant: "default",
      className: "bg-green-400 text-white border-none",
    });
  };

  const connectWalletHandler = async () => {
    // if (walletBalanceInUSD !== "NaN") {
    //   toast({
    //     title: "Something with Metamask",
    //     description: "We are Trying to Your Wallet!",
    //     variant: "default",
    //     className: "bg-orange-400 text-white border-none",
    //   });
    // }
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
    setWalletConnected(true);
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
    setEthPriceInUSD(3051);
    setAlexTokenPriceInUSD(2.1);
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
    <MainContext.Provider
      value={{
        walletConnected,
        walletAddress,
        walletBalance,
        alexTokenBalance,
        walletBalanceInUSD,
        connectWalletHandler,
        disconnectWallet,
      }}
    >
      {children}
      <Toaster />
    </MainContext.Provider>
  );
};
