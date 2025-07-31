import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const SUBJECTS = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

// ✅ POST — Admin submits attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    console.log("📩 POST /attendance body:", {
      className,
      subject,
      date,
      attendance,
    });

    if (!className || !subject || !date || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRecord = new Attendance({
      className,
      subject,
      date,
      attendance: attendance.map((entry) => ({
        studentId: entry.studentId.toString(), // ensure it's string
        status: entry.status,
      })),
    });

    await newRecord.save();
    console.log("✅ Attendance saved for", className, subject, date);
    res.status(201).json({ message: "Attendance recorded" });
  } catch (error) {
    console.error("❌ Error in postAttendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET — Student sees all attendance records
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    console.log("📥 Fetching attendance for studentId:", studentId);

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    console.log("📊 Matching records found:", records.length);

    const studentAttendance = records.map((record) => {
      const studentRecord = record.attendance.find(
        (a) => a.studentId === studentId
      );

      return {
        date: record.date,
        subject: record.subject,
        status: studentRecord?.status || "Absent",
      };
    });

    console.log("✅ Student attendance processed:", studentAttendance.length);
    res.json(studentAttendance);
  } catch (error) {
    console.error("❌ Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET — Student sees subject-wise attendance % summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    console.log("📊 Getting subject-wise summary for:", studentId);

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    const subjectSummary = {};

    for (const subject of SUBJECTS) {
      const subjectRecords = records.filter((r) => r.subject === subject);
      const total = subjectRecords.length;

      const present = subjectRecords.filter((r) =>
        r.attendance.find((a) => a.studentId === studentId && a.status === "Present")
      ).length;

      subjectSummary[subject] = {
        total,
        present,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    }

    console.log("✅ Summary generated");
    res.json(subjectSummary);
  } catch (error) {
    console.error("❌ Error in getSubjectWiseAttendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// backend/controllers/attendanceController.js



// ✅ ADD this function to support today's subject-wise fetch for a student
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const today = new Date().toISOString().split("T")[0];

    const attendanceRecords = await Attendance.find({
      date: today,
      "attendance.studentId": studentId,
    });

    const result = attendanceRecords.map((record) => {
      const studentStatus = record.attendance.find(
        (entry) => entry.studentId === studentId
      );
      return {
        subject: record.subject,
        status: studentStatus?.status || "Absent",
        date: record.date,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getTodaySubjectAttendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

