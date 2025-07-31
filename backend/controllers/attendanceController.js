// controllers/attendanceController.js

import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// ✅ POST attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    if (!className || !subject || !date || !attendance) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Attendance.create({ className, subject, date, attendance });

    res.status(201).json({ message: "Attendance recorded successfully" });
  } catch (error) {
    console.error("❌ Error posting attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET student full attendance records
export const getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await Attendance.find({
      "attendance.studentId": userId,
    });

    const studentAttendance = records.map((record) => {
      const studentRecord = record.attendance.find(
        (a) => a.studentId === userId
      );

      return {
        date: record.date,
        subject: record.subject,
        status: studentRecord?.status || "Absent",
      };
    });

    res.json(studentAttendance);
  } catch (error) {
    console.error("❌ Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET subject-wise summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await Attendance.find({
      "attendance.studentId": userId,
    });

    const summary = {};

    for (const subject of SUBJECTS) {
      summary[subject] = { total: 0, present: 0 };
    }

    for (const record of records) {
      const subject = record.subject;

      const studentRecord = record.attendance.find(
        (a) => a.studentId === userId
      );

      if (studentRecord && summary[subject]) {
        summary[subject].total += 1;
        if (studentRecord.status === "Present") {
          summary[subject].present += 1;
        }
      }
    }

    const response = Object.entries(summary).map(([subject, stats]) => {
      const { total, present } = stats;
      const percentage = total > 0 ? (present / total) * 100 : 0;

      return {
        subject,
        totalClasses: total,
        classesAttended: present,
        classesAbsent: total - present,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching subject-wise attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET today's subject-wise status (for Dashboard)
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

    const records = await Attendance.find({
      date: today,
      "attendance.studentId": userId,
    });

    const statusBySubject = {};

    for (const subject of SUBJECTS) {
      statusBySubject[subject] = "N/A";
    }

    for (const record of records) {
      const studentRecord = record.attendance.find(
        (a) => a.studentId === userId
      );

      if (studentRecord) {
        statusBySubject[record.subject] = studentRecord.status;
      }
    }

    const todayData = SUBJECTS.map((subject) => ({
      subject,
      status: statusBySubject[subject],
    }));

    res.json(todayData);
  } catch (error) {
    console.error("❌ Error fetching today's attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};
