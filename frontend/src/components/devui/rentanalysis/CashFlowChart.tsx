"use client";

import ReactECharts from "echarts-for-react";

const CashflowChart = () => {
  const option = {
    title: { text: "Monthly Rent Cashflow", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Expected", "Received"], bottom: 0 },
    xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    yAxis: { type: "value" },
    series: [
      { name: "Expected", type: "line", data: [4000, 4200, 4100, 4400, 4300, 4500] },
      { name: "Received", type: "line", data: [3900, 4100, 3900, 4350, 4000, 4400] },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default CashflowChart;
