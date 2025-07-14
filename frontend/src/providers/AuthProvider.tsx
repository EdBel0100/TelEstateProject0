"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = userPool.getCurrentUser();

    if (!user) {
      router.replace("/signin");
    } else {
      user.getSession((err: any, session: any) => {
        if (err || !session?.isValid()) {
          router.replace("/signin");
        } else {
          setChecking(false);
        }
      });
    }
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
}
