"use client";
// make sure the cognito id is unique
// make sure to hash the cognito id before uploading to the cognito and database
// make the changes to the tradeperson in db
import { useState } from "react";
import SHA256 from "crypto-js/sha256";

import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";

import {
  useCreateTenantMutation,
  useCreateLandlordMutation,
  useCreateTradepersonMutation,
  useGetLandlordCognitoIdByPhoneQuery
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
  const [createLandlord] = useCreateLandlordMutation();
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
    landlordPhoneNumber: "", // new field here
  });
  const {
    data: landlordData,
    error: landlordError,
    isLoading,
  } = useGetLandlordCognitoIdByPhoneQuery(
    { phoneNumber: form.landlordPhoneNumber },
    { skip: !form.landlordPhoneNumber }
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const hashedCognitoId = SHA256(
        form.email.toLowerCase().trim()
      ).toString();

      const landlordCognitoId = landlordData?.cognitoId;
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

      userPool.signUp(
        hashedCognitoId,
        form.password,
        attributes,
        [],
        async (err, result) => {
          if (err || !result) {
            setError(err?.message || "Signup failed");
            setLoading(false);
            return;
          }

          const userData = {
            username: hashedCognitoId,
            email: form.email,
            phone_number: formatPhone(form.phone_number),
            firstName: form.firstName,
            lastName: form.lastName,
            role: form.role,
            address: form.address,
            companyName: form.companyName,
            service: form.service,
            landlordCognitoId: landlordCognitoId,
          };

          localStorage.setItem("pendingSignupUser", JSON.stringify(userData));

          try {
            switch (form.role) {
              case "tenant":
                await createTenant({
                  cognitoId: hashedCognitoId,
                  email: form.email,
                  phoneNumber: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                }).unwrap();
                break;

              case "manager":
                await createLandlord({
                  cognitoId: hashedCognitoId,
                  email: form.email,
                  phoneNumber: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                }).unwrap();
                break;

              case "tradeperson": {
                const landlordCognitoId = landlordData?.cognitoId;

                if (!landlordCognitoId) {
                  setError("Could not find landlord with that phone number.");
                  setLoading(false);
                  return;
                }

                await createTradeperson({
                  cognitoId: hashedCognitoId,
                  email: form.email,
                  phone: formatPhone(form.phone_number),
                  firstName: form.firstName,
                  lastName: form.lastName,
                  address: form.address,
                  companyName: form.companyName,
                  service: form.service,
                  landlord: {
                    connect: {
                      cognitoId: landlordCognitoId,
                    },
                  },
                }).unwrap();
                break;
              }
            }
          } catch (dbError) {
            console.error("Database registration failed:", dbError);
          }

          router.push(
            `/confirm?username=${encodeURIComponent(hashedCognitoId)}`
          );
        }
      );
    } catch (e) {
      console.error("Unexpected signup error:", e);
      setError("Signup error occurred.");
    } finally {
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
                <Label htmlFor="landlordPhoneNumber">
                  Landlord Phone Number
                </Label>
                <Input
                  id="landlordPhoneNumber"
                  name="landlordPhoneNumber"
                  value={form.landlordPhoneNumber}
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
