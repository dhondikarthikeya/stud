import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  attendance: [
    {
      studentId: { type: String, required: true },
      status: { type: String, required: true }, // "Present" or "Absent"
    },
  ],
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;

