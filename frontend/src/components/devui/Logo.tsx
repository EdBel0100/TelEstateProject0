"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const TelEstateLogo = () => {
  return (
    <a
      href="/"
      className="flex items-center space-x-2 py- px-2 text-lg font-bold text-black dark:text-white"
    >
      <Image
        src="/TelEstateLogo.png" // Place your logo image here
        alt="TelEstate Logo"
        width={50}
        height={50}
        className="rounded"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="tracking-wide text-xl"
      >
        TelEstate
      </motion.span>
    </a>
  );
};
