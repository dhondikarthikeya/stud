// src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-4">
        Admin Dashboard
      </h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-indigo-700">
          Admin / Teacher Panel
        </h2>

        <p className="text-gray-600 mb-4">
          Manage your academic activities from here:
        </p>

        <Link
          to="/admin/attendance"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          📅 Mark Attendance
        </Link>

        <Link
          to="/admin/upload-documents"
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          📁 Upload Shared Documents
        </Link>

        <Link
          to="/admin/students"
          className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          🎓 Manage Students
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-2">
        <h2 className="text-lg font-semibold text-indigo-700">
          Welcome, admin1!
        </h2>
        <p className="text-gray-600">
          Here you can manage attendance, shared documents, students, fees, and schedules.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
