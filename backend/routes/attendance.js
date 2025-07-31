import express from "express";
import {
  postAttendance,
  getStudentAttendance,
  getSubjectWiseAttendance,
  getTodaySubjectAttendance,
} from "../controllers/attendanceController.js";
import { verifyAdmin, verifyStudent } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Admin marks attendance
router.post("/", verifyAdmin, postAttendance);

// ✅ Student views full attendance list
router.get("/student", verifyStudent, getStudentAttendance);

// ✅ Student views subject-wise attendance summary
router.get("/student/summary", verifyStudent, getSubjectWiseAttendance);

// ✅ Student views today's subject-wise attendance
router.get("/student/today", verifyStudent, getTodaySubjectAttendance);

export default router;
