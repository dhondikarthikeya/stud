import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// ✅ Declare SUBJECTS locally
const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// ✅ Admin: POST attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    if (!className || !subject || !date || !attendance) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existing = await Attendance.findOne({ className, subject, date });
    if (existing) {
      return res.status(409).json({ message: "Attendance already submitted for this date and subject." });
    }

    const newAttendance = new Attendance({
      className,
      subject,
      date,
      attendance: attendance.map((item) => ({
        studentId: item.studentId.toString(),
        status: item.status,
      })),
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance saved successfully." });
  } catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Student: Get all subject-wise attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; // from token

    const records = await Attendance.find({ "attendance.studentId": studentId });

    const studentAttendance = records.map((record) => {
      const studentRecord = record.attendance.find((a) => a.studentId === studentId);
      return {
        date: record.date,
        subject: record.subject,
        status: studentRecord ? studentRecord.status : "Absent",
      };
    });

    res.status(200).json(studentAttendance);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Student: Get subject-wise summary (present count, total count, %)
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = {};

    for (const subject of SUBJECTS) {
      const records = await Attendance.find({
        subject,
        "attendance.studentId": studentId,
      });

      const total = records.length;
      const present = records.filter((r) => {
        const student = r.attendance.find((a) => a.studentId === studentId);
        return student?.status === "Present";
      }).length;

      result[subject] = {
        present,
        total,
        percentage: total === 0 ? 0 : Math.round((present / total) * 100),
      };
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching subject-wise attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
};
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const todayAttendance = await Attendance.find({
      date: today,
      "attendance.studentId": studentId,
    });

    const result = todayAttendance.map((entry) => {
      const record = entry.attendance.find((a) => a.studentId === studentId);
      return {
        subject: entry.subject,
        status: record ? record.status : "Absent",
        date: entry.date,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching today's subject attendance:", error);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
};
