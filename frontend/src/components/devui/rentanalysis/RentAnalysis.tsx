"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashflowChart from "./CashFlowChart";
import RentBreakdownChart from "./RentBreakDownChart";
import OverpaymentChart from "./RentOverpayment";


export default function RentAnalysis() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Cashflow Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <CashflowChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Rent vs Tenant Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <RentBreakdownChart />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Tenant Over/Under Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <OverpaymentChart />
        </CardContent>
      </Card>
    </div>
  );
}
