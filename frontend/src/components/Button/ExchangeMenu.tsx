// ExchangeMenu.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExchangeMenuProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ExchangeMenu: React.FC<ExchangeMenuProps> = ({
  text,
  isActive = false,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "rounded-md",
        isActive
          ? "w-24 bg-primary text-white border-2 border-primary"
          : "bg-white text-black hover:bg-slate-100 border-2 border-black"
      )}
    >
      {text}
    </Button>
  );
};

export default ExchangeMenu;
