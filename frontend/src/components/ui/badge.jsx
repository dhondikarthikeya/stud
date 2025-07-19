import * as React from "react";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const colors = {
    default: "bg-indigo-100 text-indigo-700",
    success: "bg-emerald-100 text-emerald-700",
    destructive: "bg-red-100 text-red-700",
    secondary: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
