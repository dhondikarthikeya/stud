
import express from "express";
import { getStudentsByClass } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Get students of a specific class (e.g., Class A)
router.get("/students/class/:className", verifyAdmin, getStudentsByClass);

export default router;