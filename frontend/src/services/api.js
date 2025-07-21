import axios from "axios";

// 🌐 Base API URL from .env (without duplicate /api)
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

// ✅ Axios instance with Authorization
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Add Authorization header if token exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ✅ Student Attendance APIs
export async function fetchStudentAttendance() {
  const res = await api.get("/attendance/student");
  return res.data;
}

export const fetchTodaySubjectAttendance = async () => {
  const res = await api.get("/attendance/student/today");
  return res.data;
};

// ✅ Auth APIs
export async function registerUser(userData) {
  const res = await api.post("/auth/register", userData);
  return res.data;
}

export async function loginUser(credentials) {
  try {
    const res = await api.post("/auth/login", credentials);
    const data = res.data;

    const userData = {
      token: data.token,
      role: data.role,
      id: data.id,
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      className: data.className,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error.response?.data || { message: "Login failed" };
  }
}

// ✅ Admin Students APIs
export async function getStudentsByClass(className) {
  return api.get(`/admin/students/class/${encodeURIComponent(className)}`);
}

// ✅ Admin Shared Document APIs
export const fetchAdminDocuments = () => api.get("/admin-documents/shared");
export const uploadAdminDocument = (formData) => api.post("/admin-documents/upload", formData);
export const deleteAdminDocument = (id) => api.delete(`/admin-documents/${id}`);
export const downloadAdminDocument = (fileName) =>
  window.open(`${API_BASE_URL}/admin-documents/download/${fileName}`, "_blank");

export default api;
