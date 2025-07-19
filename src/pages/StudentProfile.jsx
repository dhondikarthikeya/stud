import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const navigate = useNavigate();
  const location = useLocation(); // needed for path highlighting in nav

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profileRoutes/");
      setProfile(res.data.user);
      setFormData(res.data.user);
      setInitialData(res.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Unable to load profile data.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isChanged = () => {
    for (const key in formData) {
      if (key === "photo") continue;
      if (formData[key] !== initialData[key]) return true;
    }
    return !!preview;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged()) return alert("No changes made.");
    try {
      const formPayload = new FormData();
      for (const key in formData) {
        if (formData[key]) formPayload.append(key, formData[key]);
      }
      const res = await api.put("/profileRoutes/", formPayload);
      const updated = res.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...updated,
        })
      );

      setProfile(updated);
      setFormData(updated);
      setInitialData(updated);
      setPreview(null);
      setEditing(false);
      setCacheBuster(Date.now());

      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (!profile) return <p className="p-6 text-center">Loading...</p>;

  const photoUrl = preview
    ? preview
    : profile.photo
    ? `${BASE_URL}/uploads/${profile.photo}?t=${cacheBuster}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-[var(--background-color)] py-8 px-4 font-[Poppins] pb-20">
      <div className="max-w-5xl mx-auto bg-[var(--card-background)] rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {editing && (
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="mt-2 text-sm"
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Profile</h1>
            <p className="text-[var(--text-secondary)] text-base">{profile.studentId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <Field label="Full Name" value={`${profile.firstName} ${profile.lastName}`} editing={false} />
          <Field label="Email" name="email" value={formData.email || ""} onChange={handleChange} editing={editing} />
          <Field label="Contact Number" name="phone" value={formData.phone || ""} onChange={handleChange} editing={editing} />
          <Field label="Date of Birth" name="dob" value={formData.dob || ""} onChange={handleChange} editing={editing} />
          <Field label="Gender" name="gender" value={formData.gender || ""} onChange={handleChange} editing={editing} />
          <Field label="Program" name="program" value={formData.program || ""} onChange={handleChange} editing={editing} />
          <Field label="Department" name="department" value={formData.department || ""} onChange={handleChange} editing={editing} />
          <Field label="Year/Semester" name="semester" value={formData.semester || ""} onChange={handleChange} editing={editing} />
          <Field label="Admission Date" name="admissionDate" value={formData.admissionDate || ""} onChange={handleChange} editing={editing} />
          <Field label="Status" value={formData.status || "Active"} editing={false} />

          <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end gap-4 mt-6">
            {editing ? (
              <>
                <button
                  type="submit"
                  className={`bg-[var(--secondary-color)] text-white px-5 py-2 rounded-lg font-medium ${!isChanged() && "opacity-50 cursor-not-allowed"}`}
                  disabled={!isChanged()}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(profile);
                    setInitialData(profile);
                    setEditing(false);
                    setPreview(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-[var(--primary-color)] hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Mobile Bottom Nav Bar (Visible on <=768px width) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md max-w-screen-md mx-auto flex justify-around items-center py-2 z-50 md:hidden">
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

const Field = ({ label, name, value, onChange, editing }) => (
  <div>
    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">{label}</label>
    {editing && onChange ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    ) : (
      <p className="text-[var(--text-primary)]">{value || "-"}</p>
    )}
  </div>
);

export default StudentProfile;
