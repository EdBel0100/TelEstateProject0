"use client";

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

// Mock data for development/testing
const mockRents = [
  {
    tenantId: 1,
    tenantName: "Alice Johnson",
    propertyName: "Apt 101 - Sunset Towers, 123 Elm St",
    amountDue: 1200.0,
  },
  {
    tenantId: 2,
    tenantName: "Bob Smith",
    propertyName: "Apt 205 - Lakeview Heights, 88 Ocean Ave",
    amountDue: 950.5,
  },
  {
    tenantId: 3,
    tenantName: "Charlie Nguyen",
    propertyName: "Apt 3B - Garden Court, 456 Maple Dr",
    amountDue: 1300.75,
  },
];

export function UnpaidRentsTable() {
  const rents = mockRents; // Replace with API data later

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unpaid Rents</CardTitle>
      </CardHeader>
      <CardContent>
        {rents.length === 0 ? (
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
              {rents.map(({ tenantId, tenantName, propertyName, amountDue }) => (
                <TableRow key={tenantId} className="hover:bg-muted">
                  <TableCell>{tenantName}</TableCell>
                  <TableCell>{propertyName}</TableCell>
                  <TableCell className="text-right">${amountDue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
