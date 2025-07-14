"use client";

import NavbarProtected from "@/components/devui/PrivateNavbar";
import { SideBar } from "@/components/devui/sidebar/SideBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import AuthProvider from "@/providers/AuthProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full">
        <aside className="w-64 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
          <SideBar />
        </aside>

        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <header style={{ height: NAVBAR_HEIGHT }} className="flex-shrink-0">
            <NavbarProtected />
          </header>

          <main className="flex-1 overflow-auto bg-background text-foreground p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Layout;
