"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface DashboardCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({ className, children }: DashboardCardProps) {
  return (
    <div className={cn("max-w w-full", className)}>
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent bg-gray-200 dark:border-neutral-800",
          "h-96" 
        )}
      >
        {children}
      </div>
    </div>
  );
}
