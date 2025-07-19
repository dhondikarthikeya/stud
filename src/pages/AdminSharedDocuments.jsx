// src/pages/AdminSharedDocuments.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";
import api from "../services/api";

const AdminSharedDocuments = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      const res = await api.get("/documents/shared");
      setSharedFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch shared documents", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">📌 Admin Shared Documents</h2>
          {sharedFiles.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sharedFiles.map((doc) => (
                <div
                  key={doc._id}
                  className="border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-600">{doc.category}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded by: <span className="font-medium">{doc.uploadedBy}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Date: {new Date(doc.uploadDate).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="mt-4"
                  >
                    <Download className="mr-2" /> Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-xl">No documents shared by admin yet. 📭</p>
              <p className="text-sm">Check back soon for updates!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSharedDocuments;
