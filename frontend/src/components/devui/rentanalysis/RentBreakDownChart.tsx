"use client";

import ReactECharts from "echarts-for-react";

const RentBreakdownChart = () => {
  const option = {
    title: { text: "Rent vs Tenant Contributions", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Property A", "Property B", "Property C"] },
    yAxis: { type: "value" },
    legend: { bottom: 0 },
    series: [
      { name: "Total Rent Due", type: "bar", data: [3000, 2500, 2800] },
      { name: "Sum of Tenant Payments", type: "bar", data: [2900, 2400, 2900] },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default RentBreakdownChart;
