import express from "express";
import User from "../models/User.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/students
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

export default router;
