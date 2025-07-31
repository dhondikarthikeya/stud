import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// ✅ POST /api/attendance — Admin submits attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    if (!className || !subject || !date || !attendance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRecord = new Attendance({
      className,
      subject,
      date,
      attendance: attendance.map((entry) => ({
        studentId: String(entry.studentId),
        status: entry.status,
      })),
    });

    await newRecord.save();
    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student — Fetch all attendance records for logged-in student
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(403).json({ message: "Student ID missing" });

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    const result = records.map((record) => {
      const studentEntry = record.attendance.find(
        (entry) => entry.studentId === studentId
      );
      return {
        date: record.date,
        subject: record.subject,
        status: studentEntry?.status || "Absent",
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching student attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student/today — Today's subject-wise attendance summary
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(403).json({ message: "Student ID missing" });

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const records = await Attendance.find({ date: today });

    const subjectWise = records
      .map((record) => {
        const studentEntry = record.attendance.find(
          (entry) => entry.studentId === studentId
        );
        return {
          subject: record.subject,
          status: studentEntry ? studentEntry.status : "Absent",
        };
      })
      .filter((entry) => entry.subject);

    res.json(subjectWise);
  } catch (err) {
    console.error("Error fetching today's subject-wise attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/subject-wise — Overall subject-wise attendance % summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    if (!studentId) return res.status(403).json({ message: "Student ID missing" });

    const records = await Attendance.find({ "attendance.studentId": studentId });

    const summary = {};

    SUBJECTS.forEach((subject) => {
      const filtered = records.filter((r) => r.subject === subject);
      const total = filtered.length;
      const present = filtered.reduce((acc, r) => {
        const entry = r.attendance.find((a) => a.studentId === studentId);
        return acc + (entry?.status === "Present" ? 1 : 0);
      }, 0);

      summary[subject] = {
        total,
        present,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : "0.00",
      };
    });

    res.json(summary);
  } catch (err) {
    console.error("Error fetching subject-wise attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};
