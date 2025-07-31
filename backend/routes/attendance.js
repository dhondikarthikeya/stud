// routes/attendance.js
import express from "express";
import {
  postAttendance,
  getStudentAttendance,
  getTodaySubjectAttendance, // 👈 this one for student view
  getSubjectWiseAttendance,
} from "../controllers/attendanceController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, postAttendance); // Admin
router.get("/student", verifyToken, getStudentAttendance); // Student full record
router.get("/student/today", verifyToken, getTodaySubjectAttendance); // ✅ NEW: Today's summary
router.get("/subject-wise", verifyToken, getSubjectWiseAttendance); // Subject wise summary

export default router;
