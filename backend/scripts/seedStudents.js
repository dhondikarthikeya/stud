// scripts/seedStudents.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const studentsData = [];

for (let i = 1; i <= 10; i++) {
  studentsData.push({
    studentId: `classa_student${i}`,
    role: "student",
    firstName: `First${i}`,
    lastName: `Last${i}`,
    email: `classa_student${i}@mail.com`,
    className: "Class A",
  });
}

// Repeat for Class B–E
["B", "C", "D", "E"].forEach((letter) => {
  for (let i = 1; i <= 10; i++) {
    studentsData.push({
      studentId: `class${letter.toLowerCase()}_student${i}`,
      role: "student",
      firstName: `First${i}`,
      lastName: `Last${i}`,
      email: `class${letter.toLowerCase()}_student${i}@mail.com`,
      className: `Class ${letter}`,
    });
  }
});

const seedStudents = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const defaultPassword = "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const studentsWithPassword = studentsData.map((student) => ({
      ...student,
      password: hashedPassword,
    }));

    await User.insertMany(studentsWithPassword);

    console.log(`✅ ${studentsWithPassword.length} students inserted`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding students:", error);
    process.exit(1);
  }
};

seedStudents();

