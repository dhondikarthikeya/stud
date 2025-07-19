import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  firstName: String,
  lastName: String,
  email: String,
  className: String,
  subject: String, // for admin
  phone: String,
  dob: String,
  gender: String,
  program: String,
  department: String,
  semester: String,
  admissionDate: String,
  status: { type: String, default: "Active" },
  photo: String, // 📸 Store image URL or path
});

export default mongoose.model("User", UserSchema);
