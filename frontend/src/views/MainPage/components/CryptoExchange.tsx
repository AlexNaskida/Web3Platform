import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import ExchangeMenu from "@/components/Button/ExchangeMenu";
import { Button } from "@nextui-org/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CryptoExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "swap">("swap");
  const [selectedToken, setSelectedToken] = useState("Ethereum");

  return (
    <div className="flex flex-col h-fit items-center text-muted-foreground gap-4 border-3 border-primary rounded-lg p-8">
      <p className="text-xl font-medium text-start w-full">Exchange</p>
      <div className="w-full h-[2px] bg-black" />
      <div className="flex flex-col h-96 gap-4 w-full">
        <div className="flex flex-row justify-start gap-2">
          <ExchangeMenu
            text="Buy"
            isActive={activeTab === "buy"}
            onClick={() => setActiveTab("buy")}
          />
          <ExchangeMenu
            text="Sell"
            isActive={activeTab === "sell"}
            onClick={() => setActiveTab("sell")}
          />
          <ExchangeMenu
            text="Swap"
            isActive={activeTab === "swap"}
            onClick={() => setActiveTab("swap")}
          />
        </div>

        {activeTab === "swap" && (
          <div className="flex flex-col justify-center items-center gap-2">
            {/* <div className="bg-slate-100 w-full h-10 rounded-md"> */}
            <Select onValueChange={setSelectedToken} value={selectedToken}>
              <SelectTrigger className="bg-slate-100 h-10 rounded-md w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Alex Token">Alex Token</SelectItem>
                <SelectItem value="Polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
            {/* </div> */}
            <div className="bg-slate-100 w-full h-16 rounded-md"></div>
            <ArrowUpDown
              size={16}
              className="size-8 p-2 bg-slate-100 rounded-full"
            />
            <div className="bg-slate-100 w-full h-16 rounded-md"></div>
          </div>
        )}

        <Button className="bg-primary text-white font-semibold rounded-2xl text-md">
          {activeTab === "swap" && <p>Swap</p>}
          {activeTab === "buy" && <p>Buy</p>}
          {activeTab === "sell" && <p>Sell</p>}
        </Button>
      </div>
    </div>
  );
};

export default CryptoExchange;
