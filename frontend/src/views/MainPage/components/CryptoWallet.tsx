import { Button } from "@nextui-org/react";
import DisplayWalletCard from "@/components/Cards/DisplayWalletCard";

interface CryptoWalletProps {
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  walletBalanceInUSD: string;
  connectWalletHandler: () => void;
}

const CryptoWallet = ({
  walletConnected,
  walletAddress,
  walletBalance,
  walletBalanceInUSD,
  connectWalletHandler,
}: CryptoWalletProps) => {
  return (
    <div className="flex flex-row h-96 pr-10 w-full justify-between">
      <div className="flex flex-col w-full bg-primary rounded-xl justify-center items-center text-black">
        {walletConnected ? (
          <>
            <DisplayWalletCard
              walletAddress={walletAddress}
              walletBalance={walletBalance}
              walletBalanceInUSD={walletBalanceInUSD}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-20">
            <Button
              onClick={() => connectWalletHandler()}
              className="bg-orange-600 text-xl font-semibold px-4 py-2 rounded-xl"
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
