// src/components/PeriodAttendanceCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PeriodAttendanceCard = ({ studentId = "stud1234" }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/attendance/daily/${studentId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Attendance fetch error:", err));
  }, [studentId]);

  const countStatus = (status) =>
    data.filter((entry) => entry.status === status).length;

  const present = countStatus("Present");
  const absent = countStatus("Absent");
  const late = countStatus("Late");

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      <h2 className="text-lg font-semibold text-indigo-800 mb-2">
        Period-wise Attendance
      </h2>

      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
          ✅ {present} Present
        </span>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
          ❌ {absent} Absent
        </span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
          ⏱️ {late} Late
        </span>
      </div>

      <ul className="space-y-2">
        {data.map(({ period, subject, status }) => {
          let badgeColor = "";
          let icon = "";

          if (status === "Present") {
            badgeColor = "bg-green-500";
            icon = "✅";
          } else if (status === "Absent") {
            badgeColor = "bg-red-500";
            icon = "❌";
          } else if (status === "Late") {
            badgeColor = "bg-yellow-500";
            icon = "⏱️";
          }

          return (
            <li
              key={period}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Period {period}: {subject}
                </p>
              </div>
              <span
                className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}
              >
                {icon} {status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PeriodAttendanceCard;

