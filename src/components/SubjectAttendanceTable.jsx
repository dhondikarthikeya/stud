// src/components/SubjectAttendanceTable.jsx
import React from "react";

const sampleData = [
  {
    slNo: 1,
    subjectCode: "R22CS601PC",
    subject: "Design and Analysis of Algorithms",
    total: 62,
    attended: 43,
    absent: 19,
    percentage: "69.35%",
  },
  {
    slNo: 2,
    subjectCode: "R22CS602PC",
    subject: "Machine Learning",
    total: 53,
    attended: 36,
    absent: 17,
    percentage: "67.92%",
  },
  {
    slNo: 3,
    subjectCode: "R22CS603PC",
    subject: "Web Technologies",
    total: 66,
    attended: 45,
    absent: 21,
    percentage: "68.18%",
  },
];

const SubjectAttendanceTable = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">My Attendance</h1>
            <p className="text-gray-500 text-sm">III Year II Semester</p>
            <p className="text-gray-400 text-xs mt-1">
              Note: Attendance is calculated based on subject-wise classes attended.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 shadow-sm">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="px-4 py-2 text-left">Sl No</th>
                <th className="px-4 py-2 text-left">Subject Code</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-center">Total</th>
                <th className="px-4 py-2 text-center">Attended</th>
                <th className="px-4 py-2 text-center">Absent</th>
                <th className="px-4 py-2 text-center">%</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.slNo} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{row.slNo}</td>
                  <td className="px-4 py-2">{row.subjectCode}</td>
                  <td className="px-4 py-2">{row.subject}</td>
                  <td className="px-4 py-2 text-center">{row.total}</td>
                  <td className="px-4 py-2 text-center">{row.attended}</td>
                  <td className="px-4 py-2 text-center">{row.absent}</td>
                  <td className="px-4 py-2 text-center font-medium text-indigo-700">
                    {row.percentage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectAttendanceTable;
