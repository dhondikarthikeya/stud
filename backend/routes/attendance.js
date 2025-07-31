// routes/attendance.js
import express from "express";
import {
  postAttendance,
  getStudentAttendance,
  getTodaySubjectAttendance,
  getSubjectWiseAttendance,
} from "../controllers/attendanceController.js";

import { verifyToken, verifyAdmin, verifyStudent } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyAdmin, postAttendance); // Admin/Teacher only
router.get("/student", verifyStudent, getStudentAttendance); // Student only
router.get("/student/today", verifyStudent, getTodaySubjectAttendance); // Student only
router.get("/subject-wise", verifyStudent, getSubjectWiseAttendance); // Student only

export default router;
