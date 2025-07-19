// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Axios instance with Authorization
const api = axios.create({
  baseURL: API_BASE_URL,
});

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
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (res.ok) {
    const userData = {
      token: data.token,
      role: data.role,
      id: data.id,
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      className: data.className, // ✅ Save className
    };
    localStorage.setItem("user", JSON.stringify(userData));
  }

  return data;
}


// ✅ Admin Students APIs
export async function getStudentsByClass(className) {
  return api.get(`/admin/students/class/${encodeURIComponent(className)}`);
}

// ✅ Admin Shared Document APIs (Corrected to match backend)
export const fetchAdminDocuments = () => api.get("/admin-documents/shared");
export const uploadAdminDocument = (formData) => api.post("/admin-documents/upload", formData);
export const deleteAdminDocument = (id) => api.delete(`/admin-documents/${id}`);
export const downloadAdminDocument = (fileName) =>
  window.open(`${API_BASE_URL}/admin-documents/download/${fileName}`, "_blank");

export default api;
