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
export const getTodaySubjectAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const fixedSubjects = ["Telugu", "Hindi", "English", "Math", "Science", "Social"];

    const records = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
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

// ✅ Subject-wise attendance summary
export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const studentId = String(req.user.studentId);

    console.log("📊 Getting summary for studentId:", studentId);

    const summary = await Attendance.aggregate([
      // Match records that contain this student
      {
        $match: {
          "attendance.studentId": studentId,
        },
      },
      // Flatten attendance array
      {
        $unwind: "$attendance",
      },
      // Filter again after unwind
      {
        $match: {
          "attendance.studentId": studentId,
        },
      },
      // Group by subject
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
      // Final format
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
