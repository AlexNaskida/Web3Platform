import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Toaster } from "@/components/ui/toaster";
// import TweetCard from "@/components/Cards/TweetCard";
// import BurnTokens from "@/components/BurnTokens";
// import { handleTweetCreation } from "@/components/handleFunctions/handleTweetCreation";
// import CryptoPriceCards from "@/components/Cards/CryptoPriceCards";
import RightSideBar from "@/views/MainPage/RightSideBar";
import MainHeader from "@/views/MainPage/components/MainHeader";
import CryptoWallet from "@/views/MainPage/components/CryptoWallet";

// type TweetDictionaryItem = {
//   0: string;
//   1: string;
//   2: bigint;
//   author: string;
//   content: string;
//   timestamp: number;
// };

type WalletData = {
  address: string;
  balance: string;
  connected: boolean;
};

const MainPage = () => {
  // const [tweetDictionary, setTweetDictionary] = useState<TweetDictionaryItem[]>(
  //   []
  // );
  // const [tweetMessage, setTweetMessage] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [ethPriceInUSD, setEthPriceInUSD] = useState<number>(0);
  const [walletBalanceInUSD, setWalletBalanceInUSD] = useState<string>("");

  useEffect(() => {
    const storedWalletData = localStorage.getItem("walletData");
    if (storedWalletData) {
      const parsedWalletData: WalletData = JSON.parse(storedWalletData);
      setWalletAddress(parsedWalletData.address);
      setWalletBalance(parsedWalletData.balance);
      setWalletConnected(parsedWalletData.connected);
    }
    fetchEthPriceInUSD();
  }, []);

  useEffect(() => {
    if (walletBalance && ethPriceInUSD) {
      const balanceInEth = parseFloat(walletBalance);
      const valueInUSD = balanceInEth * ethPriceInUSD;
      setWalletBalanceInUSD(valueInUSD.toFixed(2));
    }
  }, [walletBalance, ethPriceInUSD]);

  const setWallet = ({ address, balance, connected }: WalletData) => {
    const walletData: WalletData = {
      address: address,
      balance: balance,
      connected: connected,
    };

    // console.log(walletData);
    localStorage.setItem("walletData", JSON.stringify(walletData));
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => connectWalletHandler());
  }

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const walletAddresses = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Wallets:", walletAddresses);

        accountChangeHandler(walletAddresses[0]);
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      console.log("Please install MetaMask browser extension to interact");
    }
  };

  const accountChangeHandler = async (account: string) => {
    setWalletAddress(account);
    getUserBalance(account);
    fetchEthPriceInUSD();
  };

  const getUserBalance = async (address: string) => {
    if (!window.ethereum) {
      console.log("Error while connecting Metamask. MetaMask is not installed");
      return;
    }
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      // console.log("Balance:", balance);
      setWalletBalance(ethers.formatUnits(balance));
      setWalletConnected(true);
      setWallet({
        address: address,
        balance: ethers.formatUnits(balance),
        connected: true,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchEthPriceInUSD = async () => {
    setEthPriceInUSD(2646);
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

///temp code
{
  /* <div className="flex flex-col items-center justify-center gap-6">
          <Input
            label="Message"
            placeholder="Enter message"
            value={tweetMessage}
            onValueChange={setTweetMessage}
            className="w-full bg-white text-lg rounded-lg"
          />

          <Button
            onClick={() => {
              handleTweetCreation({
                walletAddress,
                tweetMessage,
                setTweetDictionary,
                setTweetMessage,
              });
            }}
            className="bg-white text-xl w-1/3 font-semibold px-4 py-2 rounded-lg"
          >
            Create Tweet
          </Button>
        </div>
        <div className="text-black">
          Here will be news/ transactions/ NFT suggestions
        </div>

        <BurnTokens />

        <div className="h-fit flex flex-col gap-4 p-4 bg-[#86b1f7] rounded-lg">
          {tweetDictionary &&
            tweetDictionary.map((tweet, index) => (
              <TweetCard
                key={index}
                walletAddress={tweet.author}
                content={tweet.content}
                timestamp={tweet.timestamp}
              />
            ))}
        </div>
      </div> */
}
