import express from "express";
import { verifyAdmin, verifyStudent } from "../middlewares/authMiddleware.js";
import {
  postAttendance,
  getStudentAttendance,
  getSubjectWiseAttendance,
  getTodaySubjectAttendance
} from "../controllers/attendanceController.js";


const router = express.Router();

// ✅ Admin marks attendance
router.post("/", verifyAdmin, postAttendance);

// ✅ Student views full attendance records
router.get("/student", verifyStudent, getStudentAttendance);

// ✅ Student views subject-wise attendance summary
router.get("/student/summary", verifyStudent, getSubjectWiseAttendance);
 // ✅ Final route
 router.get("/student/today", verifyStudent, getTodaySubjectAttendance);

export default router;
