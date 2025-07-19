// src/pages/AdminUploadScreen.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { UploadCloud, Trash2, Home, CalendarDays, FileUp, User } from "lucide-react";
import { Link } from "react-router-dom";

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png"
];

const AdminUploadScreen = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [docType, setDocType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [className, setClassName] = useState("");
  const [publishNow, setPublishNow] = useState(true);
  const [notify, setNotify] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await api.get("/admin-documents/shared");
      setUploadHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch upload history", err);
      alert("❌ Failed to fetch uploaded documents");
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !docType || !className) {
      alert("Please fill all required fields");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("documentType", docType);
    formData.append("expiryDate", expiryDate);
    formData.append("className", className);
    formData.append("isPublished", publishNow);
    formData.append("notifyStudents", notify);

    setUploading(true);
    try {
      await api.post("/admin-documents/upload", formData);
      alert("✅ Document uploaded successfully");
      setFile(null);
      setTitle("");
      setDescription("");
      setDocType("");
      setExpiryDate("");
      setClassName("");
      setPublishNow(true);
      setNotify(false);
      fetchUploads();
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/admin-documents/${id}`);
      fetchUploads();
    } catch (err) {
      console.error("Delete failed", err);
      alert("❌ Failed to delete document.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-10 font-inter pb-24">
      {/* Upload Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <UploadCloud className="text-indigo-600 w-8 h-8" />
          Upload Shared Document
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center group hover:border-indigo-500 transition">
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
            <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <p className="text-lg font-medium text-gray-800">Drag & drop your file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
            <span className="text-sm text-indigo-600 font-semibold">{file?.name || "No file chosen"}</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept={allowedTypes.join(",")}
            onChange={(e) => setFile(e.target.files[0])}
            className="sr-only"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 5 Notes"
              className="form-input w-full border-gray-300 rounded-lg"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Type <span className="text-red-500">*</span></label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="form-input w-full border-gray-300 rounded-lg"
            >
              <option value="">-- Select Type --</option>
              <option>Assignment</option>
              <option>Notes</option>
              <option>Result</option>
              <option>Notice</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="form-input w-full border-gray-300 rounded-lg"
              placeholder="Add a brief description of the document"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class <span className="text-red-500">*</span></label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="form-input w-full border-gray-300 rounded-lg"
            >
              <option value="">-- Select Class --</option>
              <option>Class A</option>
              <option>Class B</option>
              <option>Class C</option>
              <option>Class D</option>
              <option>Class E</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="form-input w-full border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            Publish Immediately
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            Notify Students
          </label>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
             bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-semibold text-base
             shadow-lg hover:from-blue-700 hover:via-blue-800 hover:to-blue-900
             focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
             transition duration-300 ease-in-out active:scale-95 disabled:opacity-60"
          >
            {uploading ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" /> Upload Document
              </>
            )}
          </button>
          <p className="text-xs text-gray-500">
            Supported types: PDF, DOCX, PPTX, JPG, PNG.
          </p>
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="material-icons text-green-500 text-3xl">history</span>
          Upload History
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Title</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Type</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Class</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Expiry</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Uploaded</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {uploadHistory.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{doc.title}</td>
                  <td className="px-4 py-2">{doc.documentType}</td>
                  <td className="px-4 py-2">{doc.className}</td>
                  <td className="px-4 py-2">{doc.expiryDate || "-"}</td>
                  <td className="px-4 py-2">{new Date(doc.uploadDate).toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {uploadHistory.length === 0 && (
            <p className="text-gray-500 mt-4">No documents uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center h-16 z-50 rounded-t-xl md:hidden">
        <Link to="/admin-dashboard" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <Home className="w-6 h-6 mb-1" />Dashboard
        </Link>
        <Link to="/admin/attendance" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <CalendarDays className="w-6 h-6 mb-1" />Attendance
        </Link>
        <Link to="/admin/upload-documents" className="flex flex-col items-center text-indigo-600 font-semibold text-sm">
          <FileUp className="w-6 h-6 mb-1 text-indigo-600" />Documents
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 text-sm">
          <User className="w-6 h-6 mb-1" />Profile
        </Link>
      </nav>
    </div>
  );
};

export default AdminUploadScreen;
