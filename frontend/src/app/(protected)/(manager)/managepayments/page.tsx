"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TenantRent = {
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  amountDue: number;
  paid: boolean;
};

type PropertyRentSummary = {
  propertyId: string;
  propertyName: string;
  setRent: number;
  totalTenantPayments: number;
  isMatching: boolean;
};

// Replace these mocks with your actual data fetching logic (API, RTK Query, etc.)
async function fetchUnpaidRents(): Promise<TenantRent[]> {
  return [
    {
      tenantId: "t1",
      tenantName: "Alice",
      propertyId: "p1",
      propertyName: "Sunset Villa",
      amountDue: 1200,
      paid: false,
    },
    {
      tenantId: "t2",
      tenantName: "Bob",
      propertyId: "p2",
      propertyName: "Ocean Breeze",
      amountDue: 1500,
      paid: false,
    },
  ];
}

async function fetchRentCheck(): Promise<PropertyRentSummary[]> {
  return [
    {
      propertyId: "p1",
      propertyName: "Sunset Villa",
      setRent: 3000,
      totalTenantPayments: 3000,
      isMatching: true,
    },
    {
      propertyId: "p2",
      propertyName: "Ocean Breeze",
      setRent: 3200,
      totalTenantPayments: 3100,
      isMatching: false,
    },
  ];
}

export default function RentStatusPage() {
  const [unpaidRents, setUnpaidRents] = useState<TenantRent[]>([]);
  const [rentCheck, setRentCheck] = useState<PropertyRentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [unpaid, rentSummary] = await Promise.all([
          fetchUnpaidRents(),
          fetchRentCheck(),
        ]);
        setUnpaidRents(unpaid);
        setRentCheck(rentSummary);
      } catch (e) {
        setError("Failed to load rent data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading rent data...</div>;
  if (error)
    return <div className="text-destructive font-semibold">{error}</div>;

  return (
    <div className="space-y-10 p-6">
      {/* Unpaid Rents Card */}
      <Card>
        <CardHeader>
          <CardTitle>Unpaid Rents</CardTitle>
        </CardHeader>
        <CardContent>
          {unpaidRents.length === 0 ? (
            <p>All rents are paid.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaidRents.map(
                  ({ tenantId, tenantName, propertyName, amountDue }) => (
                    <TableRow key={tenantId} className="hover:bg-muted">
                      <TableCell>{tenantName}</TableCell>
                      <TableCell>{propertyName}</TableCell>
                      <TableCell className="text-right">
                        ${amountDue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Rent Payment Check Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rent Payment Check per Property</CardTitle>
        </CardHeader>
        <CardContent>
          {rentCheck.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-right">Set Rent</TableHead>
                  <TableHead className="text-right">Sum of Tenant Payments</TableHead>
                  <TableHead className="text-center">Matches?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentCheck.map(
                  ({
                    propertyId,
                    propertyName,
                    setRent,
                    totalTenantPayments,
                    isMatching,
                  }) => (
                    <TableRow
                      key={propertyId}
                      className={`hover:bg-muted ${
                        isMatching ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <TableCell>{propertyName}</TableCell>
                      <TableCell className="text-right">
                        ${setRent.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${totalTenantPayments.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {isMatching ? "✅" : "❌"}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
