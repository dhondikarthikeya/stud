import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// ✅ POST /api/attendance — Admin submits attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, date, subject, attendance } = req.body;

    if (!className || !date || !subject || !attendance) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check for duplicate
    const existing = await Attendance.findOne({ className, date, subject });
    if (existing) {
      return res.status(400).json({ message: "Attendance already submitted for this class, subject and date" });
    }

    const newAttendance = new Attendance({
      className,
      date,
      subject,
      attendance: attendance.map((entry) => ({
        studentId: entry.studentId.toString(),
        status: entry.status,
      })),
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error posting attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student — Student's raw attendance list
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    const filtered = records.map((record) => {
      const studentRecord = record.attendance.find(
        (a) => a.studentId === studentId
      );
      return {
        date: record.date,
        subject: record.subject,
        status: studentRecord?.status || "Absent",
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/today — Student's today subject-wise status
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const records = await Attendance.find({
      date: today,
      "attendance.studentId": studentId,
    });

    const result = records.map((record) => {
      const entry = record.attendance.find(
        (a) => a.studentId === studentId
      );
      return {
        subject: record.subject,
        status: entry?.status || "Absent",
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/subject-summary — Overall subject-wise summary
// ✅ GET /api/attendance/student/summary — Overall subject-wise stats
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const subjectAttendance = await Attendance.aggregate([
      { $unwind: "$attendance" },
      {
        $match: {
          "attendance.studentId": studentId,
        },
      },
      {
        $group: {
          _id: "$subject",
          classesAttended: {
            $sum: {
              $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0],
            },
          },
          totalClasses: { $sum: 1 },
        },
      },
      {
        $project: {
          subject: "$_id",
          classesAttended: 1,
          totalClasses: 1,
          classesAbsent: {
            $subtract: ["$totalClasses", "$classesAttended"],
          },
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$classesAttended", "$totalClasses"] }, 100] }, 2],
          },
        },
      },
    ]);

    res.json({ summary: subjectAttendance });
  } catch (error) {
    console.error("Error in getSubjectWiseAttendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

