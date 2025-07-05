"use client";

import React from "react";
import Navbar from "@/components/devui/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { SideBar } from "@/components/devui/SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar takes full height */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
        <SideBar />
      </aside>

      {/* Right side: Navbar + main content */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Navbar fixed height at top */}
        <header style={{ height: NAVBAR_HEIGHT }} className="flex-shrink-0">
          <Navbar />
        </header>

        {/* Main content scrollable */}
        <main className="flex-1 overflow-auto bg-background text-foreground p-6">
            
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
