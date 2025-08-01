"use client";

import { RentCoherenceTable } from "./CoherenceTable";
import { UnpaidRentsTable } from "./UnpaidRentsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const RentPaymentsDashboard = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Rent Coherence by Property</CardTitle>
        </CardHeader>
        <CardContent>
          <RentCoherenceTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unpaid Rent Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <UnpaidRentsTable />
        </CardContent>
      </Card>
    </div>
  );
};
