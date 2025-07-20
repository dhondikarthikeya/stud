import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, ArrowLeftCircle } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const StudentSharedDocuments = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentClass = user?.className;

  useEffect(() => {
    if (studentClass) fetchSharedFiles();
  }, [studentClass]);

  const fetchSharedFiles = async () => {
    try {
      const res = await api.get(
        `/admin-documents/shared/${encodeURIComponent(studentClass)}`
      );
      setSharedFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch shared documents", err);
      setSharedFiles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 font-poppins">Loading documents...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-poppins bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="material-icons text-pink-500 text-4xl">folder_shared</span>
          <h1 className="text-3xl font-bold text-gray-800">Admin Shared Documents</h1>
        </div>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          <ArrowLeftCircle className="h-6 w-6 text-black" />
        </Button>
      </header>

      {/* Document Cards */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {sharedFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedFiles.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{doc.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-semibold">Type:</span> {doc.documentType}</p>
                      <p><span className="font-semibold">Uploaded by:</span> {doc.uploadedBy}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.uploadDate).toLocaleString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <Button
  onClick={() =>
    window.open(
      `${import.meta.env.VITE_API_URL}/admin-documents/download/${doc.fileName}`,
      "_blank"
    )
  }
  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium"
>
  <Download className="mr-2 h-5 w-5" />
  Download
</Button>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 px-4 py-10">
              <p className="text-xl font-medium">No documents shared for your class 📭</p>
              <p className="text-sm mt-1 text-gray-400">Please check again later.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md max-w-screen-md mx-auto flex justify-around items-center py-2 z-50 md:max-w-full md:px-4 md:py-3 md:justify-around md:flex-wrap md:gap-4 md:hidden">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <span className="material-icons text-2xl">home</span>
          <span className="text-xs">Dashboard</span>
        </button>

        <button onClick={() => navigate("/student-dashboard")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <span className="material-icons text-2xl">fact_check</span>
          <span className="text-xs">Attendance</span>
        </button>

        <button onClick={() => navigate("/fee-payment")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <span className="material-icons text-2xl">currency_rupee</span>
          <span className="text-xs">Fees</span>
        </button>

        <button onClick={() => navigate("/documents")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <span className="material-icons text-2xl">folder_shared</span>
          <span className="text-xs">Documents</span>
        </button>

        <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
          <span className="material-icons text-2xl">person</span>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSharedDocuments;
