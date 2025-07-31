import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// ✅ POST /api/attendance — Admin submits attendance
export const postAttendance = async (req, res) => {
  try {
    const { className, date, subject, attendance } = req.body;

    if (!className || !date || !subject || !attendance) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Attendance.findOne({ className, date, subject });
    if (existing) {
      return res.status(400).json({ message: "Attendance already submitted" });
    }

    const formattedAttendance = attendance.map((entry) => ({
      studentId: entry.studentId.toString(),
      status: entry.status,
    }));

    const newAttendance = new Attendance({
      className,
      date,
      subject,
      attendance: formattedAttendance,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error posting attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student — Student's full attendance records
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    });

    const formatted = records.map((record) => {
      const studentRecord = record.attendance.find((a) => a.studentId === studentId);
      return {
        date: record.date,
        subject: record.subject,
        status: studentRecord?.status || "Absent",
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student/today — Student's attendance today (subject-wise)
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const records = await Attendance.find({
      date: today,
      "attendance.studentId": studentId,
    });

    const summary = records.map((record) => {
      const entry = record.attendance.find((a) => a.studentId === studentId);
      return {
        subject: record.subject,
        status: entry?.status || "Absent",
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/attendance/student/summary — Subject-wise summary for a student
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const subjectAttendance = await Attendance.aggregate([
      { $unwind: "$attendance" },
      { $match: { "attendance.studentId": studentId } },
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
          _id: 0,
          totalClasses: 1,
          classesAttended: 1,
          classesAbsent: { $subtract: ["$totalClasses", "$classesAttended"] },
          percentage: {
            $cond: [
              { $eq: ["$totalClasses", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$classesAttended", "$totalClasses"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
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

