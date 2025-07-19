// src/components/Topbar.jsx
import React from "react";
import { Bell, UserCircle } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-indigo-800">Student Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell className="text-indigo-600" size={24} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <UserCircle className="text-indigo-600" size={28} />
      </div>
    </div>
  );
};

export default Topbar;
