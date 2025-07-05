"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";
import { Bell } from "lucide-react";
//import { ThemeToggleSlider } from "./theme/ThemetoggleSlider"; // adjust path if needed

const Navbar = () => {
  return (
    <div
      className="flex justify-end items-center w-full px-8 bg-primary-700 text-white shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px`, minWidth: 0 }}
    >
      <div className="flex items-center gap-5">
        <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
        {/* <ThemeToggleSlider /> */}
      </div>
    </div>
  );
};

export default Navbar;
