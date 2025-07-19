import React from "react";

const notifications = [
  { message: "Assignment due tomorrow", time: "2h ago" },
  { message: "Fee payment confirmed", time: "1d ago" },
  { message: "New class schedule updated", time: "3d ago" },
];

const NotificationsPanel = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-indigo-800 mb-4">Notifications</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {notifications.map((note, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-2 last:border-b-0"
          >
            <span>{note.message}</span>
            <span className="text-gray-400 text-xs whitespace-nowrap">{note.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
