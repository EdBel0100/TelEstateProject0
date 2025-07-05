"use client"

import { DashboardCard } from '@/components/devui/DashboardCard'
import ReactECharts from "echarts-for-react";

// Dummy payments graph option
const PaymentsGraph = () => {
  const option = {
    title: { text: "Payments Over Time" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [500, 700, 1200, 900, 1400, 1600, 1800],
        type: "line",
        smooth: true,
        areaStyle: {},
        color: "#4f46e5", // Indigo 600
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

// Simple placeholder for tickets management
const ManageTickets = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Manage Tickets</h2>
      <div className="bg-gray-300 dark:bg-neutral-700 w-full h-full rounded-md flex justify-center items-center text-gray-600 dark:text-gray-400">
        Tickets Management UI Placeholder
      </div>
    </div>
  );
};

// Simple placeholder for chats management
const ManageChats = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Manage Chats</h2>
      <div className="bg-gray-300 dark:bg-neutral-700 w-full h-full rounded-md flex justify-center items-center text-gray-600 dark:text-gray-400">
        Chats Management UI Placeholder
      </div>
    </div>
  );
};

const page = () => {
  return (
    <div className="flex-1 flex-col space-y-2 p-4 h-full">
      {/* Top row: two smaller cards */}
      <div className="flex flex-row space-x-2 flex-1 min-h-0">
        <DashboardCard className="flex-1 min-h-0">
          <ManageTickets />
        </DashboardCard>
        <DashboardCard className="flex-1 min-h-0">
          <ManageChats />
        </DashboardCard>
      </div>

      {/* Bottom row: large payments graph */}
      <DashboardCard className="h-max">
        <PaymentsGraph />
      </DashboardCard>
    </div>
  );
};

export default page;



