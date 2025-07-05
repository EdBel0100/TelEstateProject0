"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing-splash.jpg"
          alt="Rentiful Rental Platform section"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Start your journey
        </h1>
        <p className="text-xl text-white mb-8">
          Explore possibilities
        </p>
      </motion.div>
    </div>
  );
};

export default HeroSection;
