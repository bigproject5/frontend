// src/components/DefectRateChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// 예시 데이터
const data = [
  { date: "07-25", defectRate: 12.5 },
  { date: "07-26", defectRate: 9.2 },
  { date: "07-27", defectRate: 11.1 },
  { date: "07-28", defectRate: 6.8 },
  { date: "07-29", defectRate: 10.4 },
  { date: "07-30", defectRate: 7.6 },
];

const DefectRateChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} unit="%" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="defectRate"
          stroke="#ef4444"
          strokeWidth={3}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DefectRateChart;
