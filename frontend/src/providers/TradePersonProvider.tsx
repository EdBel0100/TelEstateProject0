"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

export default function TradePersonProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, loading } = useUserRole();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (role === "tradeperson") {
        setChecking(false);
      } else {
        router.replace("/unauthorized"); 
      }
    }
  }, [role, loading, router]);

  if (checking || loading) return null;

  return <>{children}</>;
}
