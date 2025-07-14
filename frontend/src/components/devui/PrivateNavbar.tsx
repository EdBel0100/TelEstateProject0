"use client";

import { Bell } from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";

const NavbarProtected = () => {
  return (
    <div
      className="flex justify-end items-center w-full px-8 bg-primary-700 text-white shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex items-center gap-5">
        <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
      </div>
    </div>
  );
};

export default NavbarProtected;
