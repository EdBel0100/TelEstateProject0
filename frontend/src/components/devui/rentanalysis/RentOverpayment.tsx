"use client";

import ReactECharts from "echarts-for-react";

const OverpaymentChart = () => {
  const option = {
    title: { text: "Tenant Over/Under Payment", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Tenant A", "Tenant B", "Tenant C", "Tenant D"] },
    yAxis: { type: "value", name: "Difference ($)" },
    series: [
      {
        name: "Difference",
        type: "bar",
        data: [-100, 50, 0, -150],
        itemStyle: {
          color: (params: any) => (params.value >= 0 ? "#22c55e" : "#ef4444"),
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default OverpaymentChart;
