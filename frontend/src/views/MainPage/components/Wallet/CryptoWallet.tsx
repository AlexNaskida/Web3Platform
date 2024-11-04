import { Button } from "@nextui-org/react";
import DisplayWalletCard from "@/components/Cards/DisplayWalletCard";

interface CryptoWalletProps {
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  walletBalanceInUSD: string;
  alexTokenBalance: string;
  connectWalletHandler: () => void;
}

const CryptoWallet = ({
  walletConnected,
  walletAddress,
  walletBalance,
  alexTokenBalance,
  walletBalanceInUSD,
  connectWalletHandler,
}: CryptoWalletProps) => {
  return (
    <div className="flex flex-row h-72 pr-10 w-full justify-between">
      <div className="flex flex-col w-full h-full bg-primary rounded-xl text-black">
        {walletConnected ? (
          <>
            <DisplayWalletCard
              walletAddress={walletAddress}
              walletBalance={walletBalance}
              alexTokenBalance={alexTokenBalance}
              walletBalanceInUSD={walletBalanceInUSD}
            />
          </>
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

      {/* <CryptoPriceCards /> */}
    </div>
  );
};

export default CryptoWallet;
