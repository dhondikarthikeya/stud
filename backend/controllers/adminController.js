import User from "../models/User.js";

export const getStudentsByClass = async (req, res) => {
  const { className } = req.params;

  try {
    const students = await User.find({ role: "student", className }).select("-password");

    if (!students.length) {
      return res.status(404).json({ message: `No students found in Class ${className}` });
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
};
