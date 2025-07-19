// scripts/seedFees.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Fee from "../models/Fee.js"; // create this model
dotenv.config();

const seedFeesForAllStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const students = await User.find({ role: "student" });

    if (students.length === 0) {
      console.log("❌ No students found to seed fees");
      process.exit();
    }

    await Fee.deleteMany({}); // optional: clear previous fees

    const feePromises = students.map((student) => {
      const totalFees = 45000;
      const paid = 20000;
      const balance = totalFees - paid;

      return Fee.create({
        studentId: student.studentId,
        semester: student.semester || "1",
        course: student.program || "B.Sc Computer Science",
        totalFees,
        paid,
        balance,
        dueDate: "2025-08-31",
        penalty: 0,
        breakdown: [
          { label: "Tuition Fee", amount: 25000 },
          { label: "Library Fee", amount: 5000 },
          { label: "Lab Fee", amount: 10000 },
          { label: "Exam Fee", amount: 5000 },
        ],
      });
    });

    await Promise.all(feePromises);

    console.log(`✅ Seeded fees for ${students.length} students`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding fees:", err);
    process.exit(1);
  }
};

seedFeesForAllStudents();
