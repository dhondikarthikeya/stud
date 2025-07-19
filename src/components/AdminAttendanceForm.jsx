import React, { useEffect, useState } from "react";

export default function AdminAttendance({ className, token }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submittedAttendance, setSubmittedAttendance] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // today

  // Fetch students by class on mount or when className changes
  useEffect(() => {
    async function fetchStudents() {
      const res = await fetch(`http://localhost:5000/api/admin/class/${className}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
      
      // Initialize attendance state for all students as 'Absent' (or empty)
      const initialAttendance = {};
      data.forEach((student) => {
        initialAttendance[student.studentId] = "Absent";
      });
      setAttendance(initialAttendance);
    }
    fetchStudents();
  }, [className, token]);

  // Handle radio button change
  const handleChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // Submit attendance to backend
  const handleSubmit = async () => {
    const attendanceArray = students.map((student) => ({
      studentId: student.studentId,
      status: attendance[student.studentId],
    }));

    const res = await fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        className,
        date,
        attendance: attendanceArray,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setSubmittedAttendance(attendanceArray);
      alert("Attendance saved successfully!");
    } else {
      alert(result.message || "Error saving attendance");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mark Attendance for {className}</h2>

      <label>
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 rounded"
        />
      </label>

      <table className="w-full mt-4 border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Present</th>
            <th className="border p-2">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map(({ studentId, firstName, lastName }) => (
            <tr key={studentId}>
              <td className="border p-2">{studentId}</td>
              <td className="border p-2">{firstName} {lastName}</td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`attendance-${studentId}`}
                  checked={attendance[studentId] === "Present"}
                  onChange={() => handleChange(studentId, "Present")}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="radio"
                  name={`attendance-${studentId}`}
                  checked={attendance[studentId] === "Absent"}
                  onChange={() => handleChange(studentId, "Absent")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Attendance
      </button>

      {/* Show submitted attendance after submit */}
      {submittedAttendance && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Submitted Attendance</h3>
          <ul>
            {submittedAttendance.map(({ studentId, status }) => (
              <li key={studentId}>
                {studentId}: {status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
