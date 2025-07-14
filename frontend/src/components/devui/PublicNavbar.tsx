"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { Button } from "../ui/button";

const PublicNavbar = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:text-primary-300"
        >
          <Image
            src="/logo.svg"
            alt="Rentiful Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-xl font-bold">
            RENT
            <span className="text-secondary-500 font-light">IFUL</span>
          </span>
        </Link>

        {/* Sign In / Sign Up */}
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <Button
              variant="outline"
              className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;
