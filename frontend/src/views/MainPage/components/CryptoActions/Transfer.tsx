import { ArrowUpRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useContext, useState } from "react";
import { MainContext } from "@/views/MainPage/MainContext";

import { contract, alexTokenContract } from "@/constants/constant";
import { ethers } from "ethers";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@nextui-org/input";

const TransactionFormSchema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Amount must be a positive number"
    ),
  message: z
    .string()
    .max(100, "Message must be less than 100 characters")
    .optional(),
});

type TransactionFormFields = z.infer<typeof TransactionFormSchema>;

const Transfer = () => {
  const { walletAddress, walletBalance, alexTokenBalance } =
    useContext(MainContext);
  const [tokenToTransfer, setTokenToTransfer] = useState("Ethereum");

  // const { walletAddress, walletBalance, alexTokenBalance, walletBalanceInUSD } =
  //   useContext(MainContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormFields>({
    resolver: zodResolver(TransactionFormSchema),
  });

  const handleTransferSubmit: SubmitHandler<TransactionFormFields> = async (
    data
  ) => {
    if (data.walletAddress === walletAddress) {
      setError("walletAddress", {
        message: "Cannot send tokens to your own wallet address",
      });
      return;
    }

    if (data.amount === "0") {
      setError("amount", {
        message: "Amount must be greater than zero",
      });
      return;
    }

    const amount = Number(data.amount);

    const balance =
      tokenToTransfer === "Ethereum"
        ? Number(walletBalance)
        : Number(alexTokenBalance);

    if (amount > balance) {
      setError("amount", {
        message: "Amount exceeds the current wallet balance",
      });
      return;
    }
    // console.log(contract);

    try {
      if (tokenToTransfer === "Ethereum") {
        const tx = await contract.methods
          .transferEth(data.walletAddress, data.message || "")
          .send({
            from: walletAddress,
            value: ethers.parseEther(data.amount).toString(),
          });
        console.log(tx);
      } else if (tokenToTransfer === "AlexToken") {
        // console.log(typeof data.amount);
        const tx = await alexTokenContract.methods.transfer(
          data.walletAddress,
          ethers.parseUnits(data.amount, 18).toString()
        );
        console.log(tx);
      }

      console.log("Transfer successful!");
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("walletAddress", {
        message:
          "Transaction failed. Please check the wallet address and try again.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-2 justify-center items-center">
          <button className="flex items-center justify-center size-16 bg-primary rounded-full hover:bg-slate-200 hover:text-black">
            <ArrowUpRight size={40} strokeWidth={2} />
          </button>
          <p className="text-lg text-black font-semibold">Send</p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-fit">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-muted-foreground">
            Transfer Tokens
          </DialogTitle>
          <DialogDescription>
            Transfer Tokens to Another Wallet Address.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col h-full w-full gap-4 justify-center items-center"
          onSubmit={handleSubmit(handleTransferSubmit)}
        >
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center w-full">
            <Label htmlFor="walletAddress" className="text-muted-foreground">
              Wallet Address
            </Label>
            <div className="flex flex-col w-full">
              <Input
                {...register("walletAddress")}
                id="walletAddress"
                type="text"
                placeholder="Wallet Address"
                className={`text-muted-foreground w-full pl-4 ${
                  errors.walletAddress ? "border-red-500" : ""
                }`}
              />
              {errors.walletAddress && (
                <div className="text-red-500 text-sm pl-4 mt-2">
                  {errors.walletAddress.message}
                </div>
              )}
            </div>
            {/* check if amount doesn't exceed the balance (with fees) */}
            <Label htmlFor="amount" className="text-muted-foreground">
              Amount
            </Label>
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col w-2/3">
                <Input
                  {...register("amount")}
                  id="amount"
                  type="text"
                  placeholder="Amount"
                  className={`text-muted-foreground w-full pl-4 ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                />
                {errors.amount && (
                  <div className="text-red-500 text-sm pl-4 mt-2">
                    {errors.amount.message}
                  </div>
                )}
              </div>
              <Select
                onValueChange={setTokenToTransfer}
                value={tokenToTransfer}
              >
                <SelectTrigger className="bg-slate-100 h-10 rounded-md w-1/3">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent className="text-primary font-semibold">
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="AlexToken">Alex Token</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label htmlFor="message" className="text-muted-foreground">
              Message
            </Label>
            <div className="flex flex-col w-full">
              <Input
                {...register("message")}
                id="message"
                type="text"
                placeholder="Message"
                className={`text-muted-foreground w-full pl-4 ${
                  errors.message ? "border-red-500" : ""
                }`}
              />
              {errors.message && (
                <div className="text-red-500 text-sm pl-4 mt-2">
                  {errors.message.message}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Transfer;
