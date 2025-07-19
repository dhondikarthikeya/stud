import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import {
  Menu, X, LogOut
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTodaySubjectAttendance } from "../services/api";

// Theme/colors/subjects
const COLORS = ["#22C55E", "#EF4444", "#FACC15"];
const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// For Recharts label
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="#fff"
      fontSize={14}
      fontWeight={600}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

// Role-based bottom nav buttons:
const BOTTOM_NAVS = {
  student: [
    { label: "Dashboard", icon: "home", path: "/dashboard" },
    { label: "Attendance", icon: "fact_check", path: "/student-dashboard" },
    { label: "Fees", icon: "currency_rupee", path: "/fee-payment" },
    { label: "Documents", icon: "folder_shared", path: "/documents" },
    { label: "Profile", icon: "person", path: "/profile" },
  ],
  admin: [
    { label: "Dashboard", icon: "home", path: "/dashboard" },
    { label: "Attendance", icon: "fact_check", path: "/admin/attendance" },
    { label: "Documents", icon: "folder_shared", path: "/admin/upload-documents" },
    { label: "Profile", icon: "person", path: "/profile" },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "teacher";
  const [todayAttendance, setTodayAttendance] = useState([]);

  useEffect(() => {
    document.body.classList.add("font-poppins");
    if (!isAdmin) {
      fetchTodaySubjectAttendance()
        .then((res) => setTodayAttendance(res.summary || []))
        .catch((err) => console.error("Attendance Fetch Error:", err));
    }
    return () => document.body.classList.remove("font-poppins");
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--primary-bg)] text-[var(--text-primary)]">
      {/* Mobile Navbar */}
      <Disclosure as="nav" className="md:hidden">
        {({ open }) => (
          <>
            <div className="bg-[#111827] text-white py-4 px-6 flex justify-between items-center shadow-lg rounded-b-2xl sticky top-0 z-40">
              <p className="text-lg font-semibold">Student Dashboard</p>
              <Disclosure.Button>{open ? <X /> : <Menu />}</Disclosure.Button>
            </div>
            <Transition
              enter="transition duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Disclosure.Panel className="bg-[#1F2937] text-white p-6 space-y-4 w-64 h-full fixed z-40 top-0 left-0 shadow-xl rounded-r-2xl">
                <Sidebar user={user} navigate={navigate} isAdmin={isAdmin} onLogout={handleLogout} mobile />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} navigate={navigate} isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto bg-[var(--secondary-bg)] p-6 md:p-10">
          <div className="flex justify-end mb-6 md:hidden">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center shadow"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={18} /> Logout
            </button>
          </div>
          {isAdmin ? (
            <AdminContent />
          ) : (
            <StudentContent user={user} todayAttendance={todayAttendance} />
          )}
        </main>
      </div>

      {/* ✅ Combined Bottom Navigation */}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
};

// ✅ Bottom Mobile Navigation Component
const BottomNav = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const buttons = isAdmin ? BOTTOM_NAVS.admin : BOTTOM_NAVS.student;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around items-center h-16 z-50 md:hidden">
      {buttons.map(({ label, icon, path }) => (
        <button
          key={label}
          onClick={() => navigate(path)}
          className={`flex flex-col items-center text-sm ${location.pathname === path ? "text-blue-600" : "text-gray-700"} hover:text-blue-600`}
        >
          <span className="material-icons text-2xl">{icon}</span>
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
};

// ✅ Sidebar Component
const Sidebar = ({ user, navigate, isAdmin, onLogout, mobile = false }) => (
  <aside className={`bg-[var(--sidebar-bg)] text-[var(--text-primary)] ${mobile ? "block" : "hidden md:flex"} flex-col p-6 shadow-lg w-64 h-screen sticky top-0 overflow-y-auto`}>
    <h1 className="text-2xl font-bold mb-10 text-[var(--accent-indigo)]">Student Dashboard</h1>
    <div className="flex items-center flex-col mb-10">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-indigo)] mb-4 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-[var(--primary-bg)] bg-white text-indigo-700 font-bold text-2xl flex justify-center items-center">
          {(user?.studentId || user?.adminUsername || "U")[0]}
        </div>
      </div>
      <h2 className="font-semibold text-lg">{user?.studentId || user?.adminUsername}</h2>
      <p className="text-sm text-[var(--text-secondary)]">{isAdmin ? "Admin/Teacher" : "Student"}</p>
    </div>
    <nav className="space-y-4 flex-1">
      <SidebarLink label="Dashboard" onClick={() => navigate("/dashboard")} />
      {isAdmin ? (
        <>
          <SidebarLink label="Mark Attendance" onClick={() => navigate("/admin/attendance")} />
          <SidebarLink label="Upload Documents" onClick={() => navigate("/admin/upload-documents")} />
          <SidebarLink label="Manage Students" onClick={() => navigate("/admin/students")} />
        </>
      ) : (
        <>
          <SidebarLink label="Full Attendance" onClick={() => navigate("/student-dashboard")} />
          <SidebarLink label="Profile" onClick={() => navigate("/profile")} />
          <SidebarLink label="Pay Fees" onClick={() => navigate("/fee-payment")} />
          <SidebarLink label="My Documents" onClick={() => navigate("/documents")} />
          <SidebarLink label="Shared Documents" onClick={() => navigate("/student/shared-documents")} />
        </>
      )}
    </nav>
    {mobile && (
      <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-8 rounded-xl w-full">
        Logout
      </button>
    )}
  </aside>
);

// ✅ StudentContent Component
const StudentContent = ({ user, todayAttendance }) => {
  const present = todayAttendance.filter(d => d.status === "Present").length;
  const absent = todayAttendance.filter(d => d.status === "Absent").length;
  const notMarked = SUBJECTS.length - (present + absent);
  const chartData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Not Marked", value: notMarked },
  ];
  const subjectMap = Object.fromEntries(todayAttendance.map(d => [d.subject, d.status]));

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user?.studentId || "Student"}!</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 bg-[var(--card-bg)] p-6 rounded-2xl shadow border border-[var(--border-color)]">
          <p className="text-[var(--accent-indigo)] font-semibold text-lg mb-4">Attendance Overview</p>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  paddingAngle={1}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[48%] left-0 right-0 text-center pointer-events-none">
              <p className="text-3xl font-bold text-[var(--text-primary)]">{Math.round((present / SUBJECTS.length) * 100)}%</p>
              <p className="text-[var(--text-secondary)]">Present</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-[var(--card-bg)] p-6 rounded-2xl shadow border border-[var(--border-color)]">
          <h3 className="text-xl font-semibold mb-4">Today's Subject-wise Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-[#f8f9fa] text-[var(--text-secondary)]">
                <tr>
                  <th className="p-4 font-medium">S.No</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.map((subject, index) => (
                  <tr key={subject} className="border-b border-[var(--border-color)]">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{subject}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        subjectMap[subject] === "Present"
                          ? "bg-green-100 text-green-800"
                          : subjectMap[subject] === "Absent"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {subjectMap[subject] || "Not Marked"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ AdminContent Component
const AdminContent = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-[var(--accent-indigo)]">Welcome Admin!</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-xl shadow">📅 Mark Attendance</button>
      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl shadow">📁 Upload Documents</button>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-4 rounded-xl shadow">🎓 Manage Students</button>
    </div>
  </div>
);

const SidebarLink = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center text-[var(--text-secondary)]
    hover:text-[var(--accent-indigo)]
    hover:bg-[var(--active-item-bg)]
    px-4 py-3 rounded-lg transition font-medium"
  >
    {label}
  </button>
);

export default Dashboard;
