"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoUser,
  AuthenticationDetails,
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

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = new CognitoUser({
      Username: form.email, // uses email here
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: form.email, 
      Password: form.password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onFailure: (err) => {
        setError(err.message || "Authentication failed");
        setLoading(false);
      },
      newPasswordRequired: () => {
        setError("New password required (not handled)");
        setLoading(false);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <h2 className="mb-6 text-2xl font-semibold text-center">Sign In</h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              value={form.password}
              onChange={onChange}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
}