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
import Attendance from "../models/Attendance.js";
import { SUBJECTS } from "../constants/subjects.js"; // or define inline if not imported

// GET /api/attendance/student — student-only route
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; // from verifyToken
    const subjectStats = {};

    // Initialize counts
    SUBJECTS.forEach((subject) => {
      subjectStats[subject] = {
        subject,
        total: 0,
        attended: 0,
        absent: 0,
      };
    });

    // Fetch all attendance records for this student
    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    records.forEach((record) => {
      const subject = record.subject;
      if (!subjectStats[subject]) return;

      const studentEntry = record.attendance.find(
        (entry) => entry.studentId === studentId
      );

      if (studentEntry) {
        subjectStats[subject].total += 1;
        if (studentEntry.status === "Present") {
          subjectStats[subject].attended += 1;
        } else {
          subjectStats[subject].absent += 1;
        }
      }
    });

    // Convert map to array and calculate %
    const result = SUBJECTS.map((subject) => {
      const { total, attended, absent } = subjectStats[subject];
      const percentage = total === 0 ? 0 : ((attended / total) * 100).toFixed(2);
      return {
        subject,
        total,
        attended,
        absent,
        percentage: parseFloat(percentage),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching subject-wise attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

