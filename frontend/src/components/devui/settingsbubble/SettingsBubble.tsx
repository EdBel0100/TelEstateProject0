"use client";

import { Settings } from "lucide-react";
import React from "react";

export const SettingsBubble: React.FC = () => {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 p-4 bg-white dark:bg-neutral-800 text-primary-700 dark:text-white shadow-lg rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
      onClick={() => {
        // open modal or navigate
        alert("Settings clicked!");
      }}
    >
      <Settings className="w-6 h-6" />
    </button>
  );
};
