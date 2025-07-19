// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, studentId, password } = formData;

    if (!firstName || !lastName || !email || !studentId || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const data = await registerUser(formData);

      if (data.message !== "Registration successful") {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Server error during registration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800">
          Student Registration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-blue-900">First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl mt-1"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="text-sm text-blue-900">Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl mt-1"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-blue-900">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl mt-1"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="text-sm text-blue-900">Student ID</label>
          <input
            type="text"
            name="studentId"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl mt-1"
            placeholder="Student ID"
          />
        </div>

        <div>
          <label className="text-sm text-blue-900">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl mt-1"
            placeholder="Password"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-center text-sm mt-4 text-blue-900">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-semibold"
            type="button"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}
