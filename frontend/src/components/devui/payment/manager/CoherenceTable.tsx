"use client";

import { useGetManagerPaymentPlanCoherenceQuery } from "@/state/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export const RentCoherenceTable = () => {
  const {
    data: rentCheck = [],
    isLoading,
    isError,
  } = useGetManagerPaymentPlanCoherenceQuery();

  if (isLoading) return <div>Loading rent payment coherence...</div>;
  if (isError)
    return (
      <div className="text-destructive font-semibold">
        Failed to load rent coherence data.
      </div>
    );

  return (
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
                <TableHead>Apartment</TableHead>
                <TableHead>Building Name</TableHead>
                <TableHead className="text-right">Expected</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-center">Matches?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentCheck.map(
                ({ propertyId, isRentAddingUp, expected, actual, property }) => (
                  <TableRow
                    key={propertyId}
                    className={`hover:bg-muted ${
                      isRentAddingUp ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <TableCell>{property?.apartmentNumber ?? "—"}</TableCell>
                    <TableCell>{property?.building?.name ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {expected !== undefined ? `$${expected.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {actual !== undefined ? `$${actual.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {isRentAddingUp ? "✅" : "❌"}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
