import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// ✅ POST — Admin submits attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    if (!className || !subject || !date || !attendance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Attendance.findOne({ className, subject, date });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this class, subject, and date" });
    }

    const formatted = attendance.map(({ studentId, status }) => ({
      studentId: studentId.toString(),
      status,
    }));

    const newAttendance = new Attendance({
      className,
      subject,
      date,
      attendance: formatted,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ GET — Student's individual attendance records
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const records = await Attendance.find({ "attendance.studentId": studentId });

    const formatted = records.map((record) => {
      const entry = record.attendance.find((a) => a.studentId === studentId);
      return {
        date: record.date,
        subject: record.subject,
        status: entry ? entry.status : "N/A",
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student attendance" });
  }
};

// ✅ GET — Student's attendance for today (subject-wise)
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const records = await Attendance.find({
      "attendance.studentId": studentId,
      date: today,
    });

    const summary = SUBJECTS.map((subject) => {
      const match = records.find((r) => r.subject === subject);
      const entry = match?.attendance.find((a) => a.studentId === studentId);
      return {
        subject,
        status: entry ? entry.status : "Not Marked",
      };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today’s attendance" });
  }
};

// ✅ GET — Student's overall subject-wise attendance summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const records = await Attendance.find({ "attendance.studentId": studentId });

    const subjectSummary = {};

    SUBJECTS.forEach((subject) => {
      subjectSummary[subject] = { present: 0, total: 0 };
    });

    records.forEach((record) => {
      const { subject, attendance } = record;
      const entry = attendance.find((a) => a.studentId === studentId);
      if (entry && subjectSummary[subject]) {
        subjectSummary[subject].total += 1;
        if (entry.status === "Present") {
          subjectSummary[subject].present += 1;
        }
      }
    });

    const result = SUBJECTS.map((subject, idx) => {
      const { present, total } = subjectSummary[subject];
      const percentage = total ? ((present / total) * 100).toFixed(1) : "0.0";
      return {
        sno: idx + 1,
        subject,
        present,
        total,
        percentage: `${percentage}%`,
      };
    });

    // Optional: include overall total
    const totalPresent = result.reduce((sum, s) => sum + s.present, 0);
    const totalCount = result.reduce((sum, s) => sum + s.total, 0);
    const overall = {
      sno: "",
      subject: "Total",
      present: totalPresent,
      total: totalCount,
      percentage: totalCount ? `${((totalPresent / totalCount) * 100).toFixed(1)}%` : "0.0%",
    };

    result.push(overall);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subject-wise attendance" });
  }
};


