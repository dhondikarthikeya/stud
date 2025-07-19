import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admins = [
     
      {
        studentId: "admin3",
        password: "admin789",
        firstName: "Admin",
        lastName: "Three",
        className: "C",
        subject: "English",
      },
      {
        studentId: "admin4",
        password: "admin321",
        firstName: "Admin",
        lastName: "Four",
        className: "D",
        subject: "Math",
      },
      {
        studentId: "admin5",
        password: "admin654",
        firstName: "Admin",
        lastName: "Five",
        className: "E",
        subject: "Science",
      },
      {
        studentId: "admin6",
        password: "admin987",
        firstName: "Admin",
        lastName: "Six",
        className: "A",
        subject: "Social",
      },
    ];

    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      const newAdmin = new User({
        studentId: admin.studentId,
        password: hashedPassword,
        role: "admin",
        firstName: admin.firstName,
        lastName: admin.lastName,
        className: admin.className,
        subject: admin.subject,
      });
      await newAdmin.save();
    }

    console.log("✅ All admins created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admins:", error);
    process.exit(1);
  }
};

createAdmins();
