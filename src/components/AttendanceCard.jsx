import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", present: 80 },
  { day: "Tue", present: 90 },
  { day: "Wed", present: 75 },
  { day: "Thu", present: 85 },
  { day: "Fri", present: 70 },
];

const AttendanceCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-indigo-800 mb-2">Attendance</h2>
      <p className="text-sm text-gray-600 mb-4">Present: 80% | Absent: 20%</p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} hide />
          <Tooltip />
          <Line type="monotone" dataKey="present" stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceCard;