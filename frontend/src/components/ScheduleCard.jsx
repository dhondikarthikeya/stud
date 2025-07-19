import React from "react";

const classes = [
  { subject: "Math", day: "Monday", time: "10:00 AM" },
  { subject: "Science", day: "Tuesday", time: "11:00 AM" },
  { subject: "English", day: "Wednesday", time: "9:30 AM" },
  { subject: "History", day: "Thursday", time: "1:00 PM" },
  { subject: "Physics", day: "Friday", time: "12:00 PM" },
];

const ScheduleCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-indigo-800 mb-4">Upcoming Classes</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {classes.map((cls, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-1 last:border-b-0"
          >
            <span>{cls.subject}</span>
            <span className="text-indigo-600">{cls.day}, {cls.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleCard;

