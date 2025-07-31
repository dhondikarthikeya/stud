import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";

// Design Colors
const COLOR_PRIMARY = "#6366F1"; // Indigo
const COLOR_LIGHT = "#E5E7EB";  // Gray-200
const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [subjectSummary, setSubjectSummary] = useState([]);

  // Fetch student attendance summary
  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/attendance/subject-wise"); // ✅ Correct route
      setSubjectSummary(res.data || []); // ✅ Set directly from array
    } catch (err) {
      console.error("Error loading attendance summary:", err);
    }
  };
  if (user?.className) fetchData();
}, [user?.className]);

  // Transform summary by subject name
  const summaryMap = Object.fromEntries(subjectSummary.map((s) => [s.subject, s]));

  // Compute total average percentage
  const totalPercentage = subjectSummary.length
    ? subjectSummary.reduce((acc, s) => acc + s.percentage, 0) / subjectSummary.length
    : 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-6 md:px-12 font-poppins">

      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight">
            🎓 Student Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Hello {user?.studentName || "Student"}, view your attendance summary
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm transition"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Attendance by Subject</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-200 bg-[#F3F4F6] text-[13px] text-gray-500 uppercase">
              <tr>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-4 text-center">Total</th>
                <th className="py-2 px-4 text-center">Attended</th>
                <th className="py-2 px-4 text-center">Absent</th>
                <th className="py-2 px-4 text-center">% Present</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {SUBJECTS.map((subject, i) => {
                const stats = summaryMap[subject] || {};
                const percent = stats.percentage || 0;
                return (
                  <tr
                    className="border-b border-gray-100 hover:bg-indigo-50/20 transition"
                    key={subject}
                  >
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{subject}</td>
                    <td className="py-3 px-4 text-center">{stats.totalClasses || 0}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-medium">{stats.classesAttended || 0}</td>
                    <td className="py-3 px-4 text-center text-red-500 font-medium">{stats.classesAbsent || 0}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center min-w-[90px]">
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{percent.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 text-right text-gray-700 text-sm font-semibold">
          Overall Attendance:
          <span className="text-indigo-600 text-lg font-bold ml-2">
            {totalPercentage.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-base font-medium text-gray-700 mb-3 text-center">Overall Attendance Chart</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Present", value: totalPercentage },
                    { name: "Absent", value: 100 - totalPercentage }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  <Cell fill={COLOR_PRIMARY} />
                  <Cell fill={COLOR_LIGHT} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-base font-medium text-gray-700 mb-3 text-center">Subject-wise Performance</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SUBJECTS.map((subject) => ({
                  subject,
                  percentage: summaryMap[subject]?.percentage || 0
                }))}
              >
                <XAxis dataKey="subject" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="percentage" fill={COLOR_PRIMARY} radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* ✅ Mobile Navigation Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md max-w-screen-md mx-auto flex justify-around items-center py-2 z-50 md:max-w-full md:px-4 md:py-3 md:justify-around md:flex-wrap md:gap-4 md:hidden">

  <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-700"}`}>home</span>
    <span className={`${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-700"} text-xs`}>Dashboard</span>
  </button>

  <button onClick={() => navigate("/student-dashboard")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/student-dashboard" ? "text-blue-600" : "text-gray-700"}`}>fact_check</span>
    <span className={`${location.pathname === "/student-dashboard" ? "text-blue-600" : "text-gray-700"} text-xs`}>Attendance</span>
  </button>

  <button onClick={() => navigate("/fee-payment")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/fee-payment" ? "text-blue-600" : "text-gray-700"}`}>currency_rupee</span>
    <span className={`${location.pathname === "/fee-payment" ? "text-blue-600" : "text-gray-700"} text-xs`}>Fees</span>
  </button>

  <button onClick={() => navigate("/documents")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/documents" ? "text-blue-600" : "text-gray-700"}`}>folder_shared</span>
    <span className={`${location.pathname === "/documents" ? "text-blue-600" : "text-gray-700"} text-xs`}>Documents</span>
  </button>

  <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/profile" ? "text-blue-600" : "text-gray-700"}`}>person</span>
    <span className={`${location.pathname === "/profile" ? "text-blue-600" : "text-gray-700"} text-xs`}>Profile</span>
  </button>

</div>

    </div>
  );
};

export default StudentDashboard;
