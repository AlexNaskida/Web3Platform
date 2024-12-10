import { UserRound } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { MainContext } from "@/views/Core/components/MainContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MainHeader = () => {
  const {
    walletAddress,
    walletConnected,
    connectWalletHandler,
    disconnectWallet,
  } = useContext(MainContext);

  const location = useLocation();
  const { toast } = useToast();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/nft":
        return "NFT Market Place";
      default:
        return "Dashboard";
    }
  };

  const formatWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 10)}...${walletAddress.slice(-5)}`;
  };

  const CopyWalletAddress = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Wallet Copied",
      description: `Wallet Address: ${walletAddress}`,
      variant: "default",
      className: "bg-yellow-400 text-xl text-white border-none",
    });
  };

  const Profile = () =>
    walletConnected ? (
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-lg font-bold">Coming Soon</p>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-center">
          Connect your wallet first to view settings
        </p>
        <Button onClick={() => connectWalletHandler()} className="w-2/3">
          Connect
        </Button>
      </div>
    );

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex items-center p-4 h-12">
        <p className="text-2xl text-black font-bold">{getPageTitle()}</p>
      </div>
      <div className="flex flex-row w-2/5 justify-end gap-5">
        {!walletConnected ? (
          <button
            className="flex flex-row gap-2 justify-start text-primary items-center px-4 w-fit bg-foreground border-3 border-primary rounded-full hover:bg-primary-50"
            onClick={() => connectWalletHandler()}
          >
            <p className="text-lg font-bold text-primary">Connect Wallet</p>
            <Image src="/MetaMaskLogo.png" width={40} height={40} />
          </button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex flex-row gap-2 justify-start text-primary items-center px-4 w-fit bg-foreground border-3 border-primary rounded-full hover:bg-primary-50">
                {formatWalletAddress(walletAddress)}
                <Image src="/MetaMaskLogo.png" width={40} height={40} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black font-bold text-xl">
                  Wallet Settings
                </AlertDialogTitle>
                <AlertDialogDescription className="text-black font-semibold text-md">
                  This action cannot be undone. This will permanently disconnect
                  your wallet and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row w-full justify-around">
                <AlertDialogAction
                  className="text-black font-bold bg-white border-2 border-black"
                  onClick={() => CopyWalletAddress(walletAddress)}
                >
                  Copy Address
                </AlertDialogAction>
                <AlertDialogCancel className="bg-slate-500 font-bold text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="text-white font-bold bg-primary border-3 border-primary"
                  onClick={() => disconnectWallet()}
                >
                  Disconnect Wallet
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="flex justify-center items-center size-12 bg-white border-3 border-muted-foreground rounded-full hover:bg-primary-50">
          <Popover>
            <PopoverTrigger>
              <UserRound size={44} className="text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent>
              <Profile />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
