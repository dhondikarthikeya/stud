import React from "react";

const activities = [
  { id: 1, activity: "Submitted Math assignment", time: "1h ago" },
  { id: 2, activity: "Paid tuition fees", time: "2d ago" },
  { id: 3, activity: "Attended Science lecture", time: "3d ago" },
];

const RecentActivityLog = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 overflow-auto max-h-48">
      <h2 className="text-lg font-semibold text-indigo-800 mb-4">Recent Activity</h2>
      <ul className="text-sm text-gray-700 space-y-2">
        {activities.map(({ id, activity, time }) => (
          <li key={id} className="flex justify-between border-b pb-1 last:border-b-0">
            <span>{activity}</span>
            <span className="text-gray-400 text-xs">{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityLog;
