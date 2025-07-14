import { useEffect, useState } from "react";
import { getUserType } from "@/utils/userUtils";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const r = await getUserType();
        setRole(r);
      } catch (err) {
        setError(err as Error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading, error };
}
