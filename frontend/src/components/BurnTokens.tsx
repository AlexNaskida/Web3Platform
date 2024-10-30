import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { contract } from "../constants/constant";
import { parseEther } from "ethers";

// later get the user address using the cookie files or jwt token(ofc with proper validation)
// Vuln in burning the tokens, no validation of the user address. Hacker can send burn request on behalf of the any user's address
const BurnTokens = () => {
  const [burnAmount, setBurnAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleTokenBurn = async (burnAmount: string) => {
    setIsLoading(true);
    setError("");

    try {
      const amount = parseEther(burnAmount);
      const tokenBurnResponse = await contract.methods.burn(amount);

      console.log("Token Burn Response:", tokenBurnResponse);
      console.log("Tokens burned successfully");
      setBurnAmount("");
    } catch (error) {
      console.error("Error burning tokens:", error);
      setError("Failed to burn tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Input
        label="Burn"
        placeholder="Enter Amount"
        value={burnAmount}
        onValueChange={setBurnAmount}
        className="w-full bg-white text-lg rounded-lg"
      />
      <Button
        onClick={() => {
          handleTokenBurn(burnAmount);
        }}
        disabled={isLoading || !burnAmount}
        className="bg-white text-xl w-1/3 font-semibold px-4 py-2 rounded-lg"
      >
        {isLoading ? "Burning..." : "Burn Tokens"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default BurnTokens;
