import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Student login states
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Admin login states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const loginData = {
      studentId: isAdminLogin ? adminUsername : studentId,
      password: isAdminLogin ? adminPassword : studentPassword,
    };

    // Debug logging
    console.log('Login attempt:', {
      isAdminLogin,
      studentId: isAdminLogin ? adminUsername : studentId,
      apiUrl: import.meta.env.VITE_REACT_APP_API_URL
    });

    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/${isAdminLogin ? 'admin-auth/login' : 'auth/login'}`;

    console.log('Full API URL:', apiUrl);

    const res = await axios.post(apiUrl, loginData);

    console.log('Login successful:', res.data);

    localStorage.setItem("user", JSON.stringify({
      token: res.data.token,
      role: res.data.role,
      studentId: res.data.studentId,
      id: res.data.id,
      subject: res.data.subject,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      email: res.data.email,
      phone: res.data.phone,
      dob: res.data.dob,
      gender: res.data.gender,
      program: res.data.program,
      department: res.data.department,
      semester: res.data.semester,
      admissionDate: res.data.admissionDate,
      status: res.data.status,
      className: res.data.className,
    }));

    if (!isAdminLogin && rememberMe) {
      localStorage.setItem("rememberedStudentId", studentId);
    }

    navigate("/dashboard");
  } catch (err) {
    console.error("Login failed - Full Error:", err);
    console.error("Response Data:", err.response?.data);
    console.error("Response Status:", err.response?.status);
    console.error("Response Headers:", err.response?.headers);
    
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        "Login failed. Check credentials.";
    
    alert(errorMessage);
  }
};

  // On load, prefill studentId if remembered
  useEffect(() => {
    if (!isAdminLogin) {
      const remembered = localStorage.getItem("rememberedStudentId");
      if (remembered) setStudentId(remembered);
    }
  }, [isAdminLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-indigo-600 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-2xl font-semibold transition ${
              !isAdminLogin
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setIsAdminLogin(false)}
          >
            Student Login
          </button>
          <button
            className={`px-6 py-2 rounded-r-2xl font-semibold transition ${
              isAdminLogin
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setIsAdminLogin(true)}
          >
            Admin Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isAdminLogin ? (
            <>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="studentId">
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  placeholder="Enter your Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="studentPassword">
                  Password
                </label>
                <input
                  id="studentPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 select-none">Remember Me</span>
                </label>

                <button
                  type="button"
                  className="text-indigo-600 hover:underline font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Student Login
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="adminUsername">
                  Admin Username
                </label>
                <input
                  id="adminUsername"
                  type="text"
                  placeholder="Enter your Admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="adminPassword">
                  Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Admin Login
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
