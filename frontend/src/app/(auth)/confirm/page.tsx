"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { useCreateConversationForTenantSignupMutation,useLazyGetTenantManagerQuery } from "@/state/api";


const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const [code, setCode] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signinError, setSigninError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const [createConversation] = useCreateConversationForTenantSignupMutation();
  const [getTenantManager] = useLazyGetTenantManagerQuery();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError(null);
    setLoading(true);

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      setLoading(false);
      if (err) {
        setConfirmError(err.message || "Confirmation failed");
        return;
      }
      setConfirmSuccess(true);
    });
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError(null);
    setLoading(true);

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: async (session) => {
        setLoading(false);
        setSignedIn(true);
      
        const idToken = session.getIdToken().getJwtToken();
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        const tenantCognitoId = payload.sub;
        const role = payload["custom:role"];
      
        // Only proceed for tenants
        if (role === "tenant") {
          try {
            const managerResult = await getTenantManager({ tenantCognitoId });
            const managerCognitoId = managerResult?.data?.property?.manager.cognitoId;
      
            if (!managerCognitoId) {
              console.error("No manager found for tenant");
              return;
            }
      
            await createConversation({
              name: "Your manager",
              managerCognitoId,
              tenantCognitoId,
            });
      
          } catch (err) {
            console.error("Post-login setup failed:", err);
          }
        }
      
        router.push("/dashboard");
      },
      
      onFailure: (err) => {
        setLoading(false);
        if (err.code === "UserNotConfirmedException") {
          setSigninError("Please confirm your email before signing in.");
        } else {
          setSigninError(err.message || "Sign-in failed");
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-6 text-2xl font-semibold text-center">
          {confirmSuccess ? "Sign In" : "Confirm Your Email"}
        </h2>

        {!confirmSuccess ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 6-digit code"
              required
            />

            {confirmError && <p className="text-sm text-red-600">{confirmError}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Confirming..." : "Confirm Email"}
            </Button>
          </form>
        ) : !signedIn ? (
          <form onSubmit={handleSignin} className="space-y-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {signinError && <p className="text-sm text-red-600">{signinError}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In and Continue"}
            </Button>
          </form>
        ) : (
          <p className="text-green-600 text-center">
            ✅ Signed in!
          </p>
        )}
      </Card>
    </div>
  );
}
