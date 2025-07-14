"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      setLoading(false);
      if (err) {
        setError(err.message || "Confirmation failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-6 text-2xl font-semibold text-center">Confirm Your Email</h2>

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

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">✅ Confirmed! Redirecting...</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Confirming..." : "Confirm Email"}
          </Button>
        </form>
      </Card>
    </div>
  );
}