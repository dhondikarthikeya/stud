// src/components/AcademicPerformanceChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const grades = [
  { subject: "Math", grade: 85 },
  { subject: "Science", grade: 78 },
  { subject: "English", grade: 92 },
  { subject: "History", grade: 74 },
  { subject: "Physics", grade: 88 },
];

const AcademicPerformanceChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-indigo-800 mb-4">
        Academic Performance
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={grades}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="grade" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcademicPerformanceChart;
