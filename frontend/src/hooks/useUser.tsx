import { useEffect, useState } from "react";
import { getUser } from "@/utils/userUtils";

type User = {
  username: string;
  attributes: Record<string, string>;
} | null;

export const useUser = (): User => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    let mounted = true;
    getUser()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return user;
};
