"use client";
import ManagerProvider from "@/providers/ManagerProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ManagerProvider>
        {children}
    </ManagerProvider>
    


  );
};

export default Providers;
