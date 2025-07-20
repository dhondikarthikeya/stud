import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UploadCloud, Download, Trash2, FileText, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const DocumentScreen = () => {
  const navigate = useNavigate();
  const [studentFiles, setStudentFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const studentRes = await api.get("/documents/my-documents");
      setStudentFiles(studentRes.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const handleUpload = async () => {
    if (!file || !category) return alert("Please select file and category");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    setUploading(true);
    try {
      await api.post("/documents/upload", formData);
      alert("✅ Document uploaded successfully!");
      fetchFiles();
      setFile(null);
      setCategory("");
    } catch (err) {
      console.error("Upload failed", err);
      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(`/documents/${id}`);
        fetchFiles();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-bold flex items-center justify-between gap-2 text-gray-800">
            <span className="flex items-center gap-2">
              <UploadCloud size={24} />
              Upload Document
            </span>
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer hover:text-indigo-600 transition"
              size={24}
            />
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Category</option>
              <option value="Assignment">Assignment</option>
              <option value="Project">Project</option>
              <option value="Lab Work">Lab Work</option>
              <option value="Other">Other</option>
            </select>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full md:w-auto"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <p className="text-gray-500 text-sm">Supported: PDF, Images, Docs. Max 10MB.</p>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Your Uploaded Documents</h2>

          {studentFiles.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentFiles.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:shadow transition-all bg-white"
                >
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                    <FileText className="text-blue-600" size={20} />
                    {doc.originalName.length > 35
                      ? doc.originalName.slice(0, 35) + "..."
                      : doc.originalName}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {doc.category || "Uncategorized"}
                    </span>
                    <span>• {(doc.fileSize / 1024).toFixed(1)} KB</span>
                    <span>• Uploaded: {formatDate(doc.uploadDate)}</span>
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-auto">
                    <Button
  variant="outline"
  className="flex items-center gap-1"
  onClick={() =>
    window.open(
      `${import.meta.env.VITE_API_URL}/documents/download/${doc.fileName}`,
      "_blank"
    )
  }
>
  <Download className="h-4 w-4" /> View
</Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(doc._id)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No documents uploaded yet.</p>
          )}
        </CardContent>
      </Card>
       {/* ✅ Mobile Navigation Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md max-w-screen-md mx-auto flex justify-around items-center py-2 z-50 md:max-w-full md:px-4 md:py-3 md:justify-around md:flex-wrap md:gap-4 md:hidden">

  <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-700"}`}>home</span>
    <span className={`${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-700"} text-xs`}>Dashboard</span>
  </button>

  <button onClick={() => navigate("/student-dashboard")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/student-dashboard" ? "text-blue-600" : "text-gray-700"}`}>fact_check</span>
    <span className={`${location.pathname === "/student-dashboard" ? "text-blue-600" : "text-gray-700"} text-xs`}>Attendance</span>
  </button>

  <button onClick={() => navigate("/fee-payment")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/fee-payment" ? "text-blue-600" : "text-gray-700"}`}>currency_rupee</span>
    <span className={`${location.pathname === "/fee-payment" ? "text-blue-600" : "text-gray-700"} text-xs`}>Fees</span>
  </button>

  <button onClick={() => navigate("/documents")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/documents" ? "text-blue-600" : "text-gray-700"}`}>folder_shared</span>
    <span className={`${location.pathname === "/documents" ? "text-blue-600" : "text-gray-700"} text-xs`}>Documents</span>
  </button>

  <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-sm">
    <span className={`material-icons text-2xl ${location.pathname === "/profile" ? "text-blue-600" : "text-gray-700"}`}>person</span>
    <span className={`${location.pathname === "/profile" ? "text-blue-600" : "text-gray-700"} text-xs`}>Profile</span>
  </button>

</div>
    </div>
  );
};

export default DocumentScreen;
