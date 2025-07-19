// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Home, BookOpen, Bell, User, Menu } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-lg p-4">
      <div className="text-2xl font-bold text-indigo-700 mb-6">📚 Stud</div>
      <nav className="space-y-4">
        <SidebarLink icon={<Home size={20} />} label="Dashboard" />
        <SidebarLink icon={<BookOpen size={20} />} label="Attendance" />
        <SidebarLink icon={<Bell size={20} />} label="Notifications" />
        <SidebarLink icon={<User size={20} />} label="Profile" />
      </nav>
    </div>
  );
};

const SidebarLink = ({ icon, label }) => (
  <div className="flex items-center space-x-3 text-indigo-800 hover:text-indigo-600 cursor-pointer">
    {icon}
    <span className="text-base font-medium">{label}</span>
  </div>
);

export default Sidebar;
