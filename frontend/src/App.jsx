// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAttendanceForm from "./pages/AdminAttendanceForm";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import FeePaymentScreen from "./pages/FeePaymentScreen";
import DocumentScreen from "./pages/DocumentScreen";
import AdminSharedDocuments from "./pages/AdminSharedDocuments";
import StudentSharedDocuments from "./pages/StudentSharedDocuments";
import AdminUploadScreen from "./pages/AdminUploadScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/attendance" element={<AdminAttendanceForm />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/fee-payment" element={<FeePaymentScreen />} />
        <Route path="/documents" element={<DocumentScreen />} />
        <Route path="/admin/shared-documents" element={<AdminSharedDocuments />} />
        <Route path="/student/shared-documents" element={<StudentSharedDocuments />} />
        <Route path="/admin/upload-documents" element={<AdminUploadScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
