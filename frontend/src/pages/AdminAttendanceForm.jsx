// src/pages/AdminAttendanceForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudentsByClass } from "../services/api";
import api from "../services/api";
import { Home, CalendarDays, FileUp, User } from "lucide-react";

const classOptions = ["Class A", "Class B", "Class C", "Class D", "Class E"];

const AdminAttendanceForm = () => {
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const today = new Date().toLocaleDateString('en-CA');
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin" && user?.subject) {
      setSubject(user.subject);
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentsByClass(selectedClass);
        setStudents(res.data);
        const defaultMap = {};
        res.data.forEach((student) => {
          defaultMap[student._id] = "Present";
        });
        setAttendanceMap(defaultMap);
      } catch (err) {
        alert(`Could not fetch students from ${selectedClass}.`);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prevMap) => ({
      ...prevMap,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attendance = students.map((student) => ({
      studentId: student.studentId,
      status: attendanceMap[student._id],
    }));

    try {
      await api.post("/attendance", {
        className: selectedClass,
        date,
        subject,
        attendance,
      });
      alert("Attendance submitted successfully!");
    } catch (error) {
      alert("Failed to submit attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-24">
      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
            <p className="text-sm text-gray-500 mt-1">Select class, subject and mark student attendance.</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="material-icons text-gray-600 text-base">book</span>
            <span className="text-gray-800 font-medium text-sm">Subject: {subject}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full appearance-none px-4 pr-10 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full appearance-none px-4 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-sm text-gray-700">Student ID</th>
                  <th className="px-4 py-3 font-semibold text-sm text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-sm text-center text-gray-700">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((student, index) => (
                  <tr key={student._id} className={index % 2 ? "bg-gray-50/50" : ""}>
                    <td className="px-4 py-3 text-sm font-medium">{student.studentId}</td>
                    <td className="px-4 py-3 text-sm">{student.firstName} {student.lastName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        {["Present", "Absent", "Late"].map((status) => (
                          <label key={status} className="flex items-center space-x-1 text-sm">
                            <input
                              type="radio"
                              name={student._id}
                              value={status}
                              checked={attendanceMap[student._id] === status}
                              onChange={() => handleStatusChange(student._id, status)}
                            />
                            <span>{status}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 px-6 shadow-md hover:shadow-lg transition-all"
            >
              Submit Attendance
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center h-16 z-50 rounded-t-xl md:hidden">
        <Link to="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <Home className="w-6 h-6 mb-1" />Dashboard
        </Link>
        <Link to="/admin/attendance" className="flex flex-col items-center text-indigo-600 font-semibold text-sm">
          <CalendarDays className="w-6 h-6 mb-1 text-indigo-600" />Attendance
        </Link>
        <Link to="/admin/upload-documents" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <FileUp className="w-6 h-6 mb-1" />Documents
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <User className="w-6 h-6 mb-1" />Profile
        </Link>
      </nav>
    </div>
  );
};

export default AdminAttendanceForm;
