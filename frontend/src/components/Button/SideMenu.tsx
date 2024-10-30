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

  const content = (
    <div className="flex flex-row text-black items-center px-3 py-2 gap-2">
      <div className="flex justify-center items-center text-white size-10 bg-primary rounded-full border border-primary">
        {icon}
      </div>
      <p className="text-black text-xl font-medium">{text}</p>
    </div>
  );

  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        cn(isActive ? "bg-slate-200 rounded-md" : "bg-white rounded-md")
      }
    >
      {content}
    </NavLink>
  );
};

export default SideMenu;
