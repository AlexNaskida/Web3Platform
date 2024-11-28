import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type SideBarButtons = {
  to: string;
  text: string;
  icon?: React.ReactNode;
};

const SideMenu = (props: SideBarButtons) => {
  const { to, text, icon } = props;

  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          isActive
            ? "bg-slate-200 rounded-md"
            : "bg-white rounded-md hover:bg-slate-100"
        )
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <div className="flex flex-row items-center px-3 py-2 gap-2">
          <div
            className={cn(
              "flex justify-center items-center size-10 rounded-full border",
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-black border-white"
            )}
          >
            {icon}
          </div>
          <p
            className={cn(
              "text-xl font-medium",
              isActive ? "text-black" : "text-gray-600"
            )}
          >
            {text}
          </p>
        </div>
      )}
    </NavLink>
  );
};

export default SideMenu;
