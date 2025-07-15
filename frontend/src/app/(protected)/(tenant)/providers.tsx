"use client";
import TenantProvider from "@/providers/TenantProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TenantProvider>
        {children}
    </TenantProvider>
    


  );
};

export default Providers;
