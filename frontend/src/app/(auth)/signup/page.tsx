"use client";
import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";

import {
  useCreateTenantMutation,
  useCreateManagerMutation,
  useCreateTradepersonMutation,
  useGetManagerCognitoIdByPhoneQuery,
} from "@/state/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Role = "tenant" | "manager" | "tradeperson";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export default function SignUpPage() {
  const router = useRouter();

  const [createTenant] = useCreateTenantMutation();
  const [createManager] = useCreateManagerMutation();
  const [createTradeperson] = useCreateTradepersonMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    firstName: "",
    lastName: "",
    role: "tenant" as Role,
    address: "",
    companyName: "",
    service: "",
    managerPhoneNumber: "",
    apartmentNumber: "",
    postalCode: "",
  });

  const {
    data: managerData,
    error: managerError,
    isLoading,
  } = useGetManagerCognitoIdByPhoneQuery(
    { phoneNumber: form.managerPhoneNumber },
    { skip: !form.managerPhoneNumber }
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: Role) => {
    setForm({ ...form, role: value });
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith("+")) return phone;
    return "+1" + phone.replace(/\D/g, "");
  };

  const deleteCognitoUser = async (username: string) => {
    try {
      const response = await fetch("/api/delete-cognito-user", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user from Cognito.");
      }
    } catch (err) {
      console.error("Cognito rollback failed:", err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    setLoading(true);
  
    try {
      const managerCognitoId = managerData?.cognitoId;
      const attributes: CognitoUserAttribute[] = [
        new CognitoUserAttribute({ Name: "email", Value: form.email }),
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: formatPhone(form.phone_number),
        }),
        new CognitoUserAttribute({ Name: "given_name", Value: form.firstName }),
        new CognitoUserAttribute({ Name: "family_name", Value: form.lastName }),
        new CognitoUserAttribute({ Name: "custom:role", Value: form.role }),
      ];
  
      const generatedUsername = uuidv4();
  
      userPool.signUp(
        generatedUsername,
        form.password,
        attributes,
        [],
        async (err, result) => {
          if (err || !result) {
            setError(err?.message || "Signup failed");
            setLoading(false);
            return;
          }
  
          const username = result.user.getUsername(); // Use this for deletion
          const cognitoSub = result.userSub;
  
          try {
            switch (form.role) {
              case "tenant":
                await createTenant({
                  cognitoId: cognitoSub,
                  email: form.email,
                  phoneNumber: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                  apartmentNumber: form.apartmentNumber,
                  address: form.address,
                  postalCode: form.postalCode,
                }).unwrap();
                break;
  
              case "manager":
                await createManager({
                  cognitoId: cognitoSub,
                  email: form.email,
                  phoneNumber: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                }).unwrap();
                break;
  
              case "tradeperson":
                if (!managerCognitoId) {
                  setError("Could not find manager with that phone number.");
                  setLoading(false);
                  await deleteCognitoUser(username); // Correct identifier
                  return;
                }
  
                await createTradeperson({
                  cognitoId: cognitoSub,
                  email: form.email,
                  phone: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                  address: form.address,
                  companyName: form.companyName,
                  service: form.service,
                  manager: {
                    connect: {
                      cognitoId: managerCognitoId,
                    },
                  },
                }).unwrap();
                break;
            }
  
            router.push(`/confirm?username=${encodeURIComponent(username)}`);
          } catch (dbError) {
            console.error("Database registration failed:", dbError);
            setError("Failed to register user in database.");
            await deleteCognitoUser(username); // rollback
          }
  
          setLoading(false);
        }
      );
      //here have a conversation created on accout creation with the landlord
    } catch (e) {
      console.error("Unexpected signup error:", e);
      setError("Signup error occurred.");
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <h2 className="mb-6 text-2xl font-semibold text-center">Sign Up</h2>

        <div className="mb-4">
          <Label className="block mb-2">Select User Role</Label>
          <RadioGroup
            defaultValue={form.role}
            onValueChange={(value: Role) => handleRoleChange(value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tenant" id="r1" />
              <Label htmlFor="r1">Tenant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manager" id="r2" />
              <Label htmlFor="r2">Manager</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tradeperson" id="r3" />
              <Label htmlFor="r3">Tradeperson</Label>
            </div>
          </RadioGroup>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={form.phone_number}
              onChange={onChange}
              required
            />
          </div>

          {form.role === "tenant" && (
            <>
              <div>
                <Label htmlFor="apartmentNumber">Apartment Number</Label>
                <Input
                  id="apartmentNumber"
                  name="apartmentNumber"
                  value={form.apartmentNumber}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={onChange}
                  required
                />
              </div>
            </>
          )}

          {form.role === "tradeperson" && (
            <>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                />
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                />
              </div>

              <div>
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={onChange}
                />
              </div>

              <div>
                <Label htmlFor="managerPhoneNumber">Manager Phone Number</Label>
                <Input
                  id="managerPhoneNumber"
                  name="managerPhoneNumber"
                  value={form.managerPhoneNumber}
                  onChange={onChange}
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
