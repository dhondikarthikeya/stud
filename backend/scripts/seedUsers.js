// seedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const classes = ["A", "B", "C", "D", "E"];
    const students = [];

    for (let className of classes) {
      for (let i = 1; i <= 10; i++) {
        const studentId = `student${String(i).padStart(2, "0")}${className}`; // e.g., student01A
        const password = await bcrypt.hash("student123", 10);

        students.push({
          studentId,
          password,
          role: "student",
          firstName: `Student${i}`,
          lastName: `${className}`,
          email: `${studentId}@school.com`,
          className,
        });
      }
    }

    // Insert all students
    await User.insertMany(students);
    console.log("✅ 50 Students created (10 per class)");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding students:", error);
    process.exit(1);
  }
};

createStudents();
