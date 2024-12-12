import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { alexTokenContract } from "@/constants/constant";
import { apiInstance } from "@/hooks/mainhook";
// import { AxiosError, AxiosResponse } from "axios";

export type WalletData = {
  address: string;
  // balanceInEth: string;
  // balanceInAlexToken: string;
  connected: boolean;
};

export type SaveWalletDataProps = {
  wallet_address: string;
  wallet_balance: string;
  wallet_AlexToken_balance: string;
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
    setWalletBalanceInUSD("");
    setWalletBalance("");
    toast({
      title: "Wallet Disconnected Successfully",
      variant: "default",
      className: "bg-green-400 text-white border-none",
    });
  };

  const saveWalletData = async (data: SaveWalletDataProps) => {
    try {
      const response = await apiInstance.post("/wallet_connect", data);

      if (response.status === 200) {
        toast({
          title: response?.data?.detail,
          variant: "default",
          className: "bg-green-400 text-white border-none",
        });
      }
    } catch {
      toast({
        title: "Failed To Connect Wallet",
        variant: "default",
        className: "bg-red-500 text-white border-none",
      });
      return null;
    }
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
    const walletEthBalance = await getWalletBalance(account);
    const walletAlexTokenBalance = await getAlexTokenBalance(account);
  
    try {
      if (walletEthBalance && walletAlexTokenBalance) {
        const success = await saveWalletData({
          wallet_address: account,
          wallet_balance: walletEthBalance,
          wallet_AlexToken_balance: walletAlexTokenBalance,
        });

        if (success !== null) {
          setWalletConnected(true);
        }
      } else {
        console.log("Error while fetching wallet balance");
      }
    } catch {
      console.log("Error while fetching wallet balance");
    }

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

    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });

    const walletEthBalance = ethers.formatUnits(balance);
    setWalletBalance(walletEthBalance);
    return walletEthBalance;
  };

  const getAlexTokenBalance = async (account: string) => {
    if (!window.ethereum) {
      console.log(
        "Error while connecting Metamask. MetaMask is not installed or wallet address is not set"
      );
      return;
    }

    try {
      const balance: string = await alexTokenContract.methods
        .balanceOf(account)
        .call();
      const walletAlexTokenBalance = ethers.formatUnits(balance);
      setAlexTokenBalance(walletAlexTokenBalance);
      return walletAlexTokenBalance;
    } catch (error) {
      console.error("Error fetching AlexToken balance:", error);
    }
  };

  const fetchCryptoPricesInUSD = async () => {
    setAlexTokenPriceInUSD(2.188); // Price of AlexToken is set manually
 
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEthPriceInUSD(data.ethereum.usd);
    } catch  {
      setEthPriceInUSD(3600);
      return null;
    }
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
