// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// ✅ Post attendance with string-based studentIds
export const postAttendance = async (req, res) => {
  try {
    const { className, subject, date, attendance } = req.body;

    console.log("📩 POST /attendance body:", {
      className,
      subject,
      date,
      attendance,
    });

    if (!className || !subject || !date || !attendance) {
      return res.status(400).json({
        message: "Please provide className, subject, date, and attendance data",
      });
    }

    const fixedAttendance = attendance.map((entry) => ({
      studentId: String(entry.studentId),
      status: entry.status,
    }));

    const existing = await Attendance.findOne({ className, date, subject });
    if (existing) {
      existing.attendance = fixedAttendance;
      await existing.save();
      return res.status(200).json({ message: "Attendance updated successfully" });
    }

    console.log("✅ Saving Attendance with subject:", subject);

    const newAttendance = new Attendance({
      className,
      subject,
      date,
      attendance: fixedAttendance,
    });
    await newAttendance.save();

    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("❌ Error posting attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Student attendance fetch
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const records = await Attendance.find({ "attendance.studentId": studentId });

    if (!records.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    const filtered = records.map((record) => {
      const studentRecord = record.attendance.find((a) => a.studentId === studentId);
      return {
        className: record.className || "",
        subject: record.subject || "",
        date: new Date(record.date).toISOString().split("T")[0],
        status: studentRecord?.status || "Absent",
      };
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ attendance: filtered });
  } catch (error) {
    console.error("❌ Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Subject-wise attendance summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const summary = await Attendance.aggregate([
      {
        $match: {
          "attendance.studentId": studentId,
          subject: { $ne: null },
        },
      },
      { $unwind: "$attendance" },
      {
        $match: {
          "attendance.studentId": studentId,
          subject: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$subject",
          totalClasses: { $sum: 1 },
          classesAttended: {
            $sum: {
              $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0],
            },
          },
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

    res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ Error fetching subject-wise attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Today's subject-wise attendance (fixed S.No order)
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const today = new Date().toISOString().split("T")[0];

    const fixedSubjects = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

    const records = await Attendance.find({
      date: today,
      "attendance.studentId": studentId,
    });

    const todayMap = {};
    for (const record of records) {
      const studentRecord = record.attendance.find((a) => a.studentId === studentId);
      todayMap[record.subject] = studentRecord?.status || "N/A";
    }

    const todaySummary = fixedSubjects.map((subject) => ({
      subject,
      status: todayMap[subject] || "Not Marked",
    }));

    res.json({ summary: todaySummary });
  } catch (error) {
    console.error("Error fetching today's subject attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
