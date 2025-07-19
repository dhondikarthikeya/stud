// src/components/BottomNavigation.jsx
import React, { useState } from "react";
import { Home, Calendar, Bell, User } from "lucide-react";

const BottomNavigation = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "schedule", label: "Schedule", icon: <Calendar size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around md:hidden z-20 shadow-inner">
      {navItems.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`flex flex-col items-center justify-center py-2 px-4 w-full ${
            active === id ? "text-indigo-600" : "text-gray-500"
          }`}
          aria-label={label}
        >
          {icon}
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
