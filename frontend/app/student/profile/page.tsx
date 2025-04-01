"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  skills: string[];
  projects: string[];
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cv, setCv] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [cvExists, setCvExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Fetch profile
    fetch("http://localhost:8080/student/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });

    // Fetch CV status
    fetch("http://localhost:8080/student/cv-status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCvExists(data.cvExists);
      })
      .catch((err) => console.error("Error fetching CV status:", err));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCv(event.target.files[0]);
    }
  };

  const uploadCv = async () => {
    if (!cv || !profile) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("cv", cv);

    try {
      const response = await fetch("http://localhost:8080/student/upload-cv", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setMessage("✅ CV uploaded successfully!");
        setCvExists(true); // Update state after successful upload
      } else {
        setMessage("❌ Failed to upload CV.");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      setMessage("❌ Error uploading CV.");
    }

    setUploading(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center text-red-500">Profile not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-red-600 py-4 px-6">
        <h1 className="text-white text-2xl font-bold text-center">Student Profile</h1>
      </header>

      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center">
        <Link href="/student/community">Student Community</Link>
        <Link href="/student/ra">RA & Faculty</Link>
        <Link href="/student/internships">Internships</Link>
        <Link href="/student/hatchery">Bennett Hatchery</Link>
      </nav>

      <main className="flex-grow p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
        <p className="text-gray-600"><strong>Email:</strong> {profile.email}</p>
        <p className="text-gray-600"><strong>Phone:</strong> {profile.phone}</p>
        <p className="text-gray-600"><strong>Branch:</strong> {profile.branch}</p>
        <p className="text-gray-600"><strong>Semester:</strong> {profile.semester}</p>

        {/* CV Status Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">CV Status</h3>
          {cvExists === null ? (
            <p>Checking CV status...</p>
          ) : cvExists ? (
            <p className="text-green-500">✅ CV is already uploaded</p>
          ) : (
            <p className="text-red-500">❌ No CV uploaded</p>
          )}
        </div>

        {/* CV Upload Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Upload CV</h3>
          <input
            type="file"
            accept=".pdf"
            className="mt-2 border p-2 rounded w-full"
            onChange={handleFileChange}
            disabled={cvExists || uploading} // Disable if CV exists or is uploading
          />
          <button
            className={`mt-3 px-4 py-2 rounded text-white ${cvExists || uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            onClick={uploadCv}
            disabled={cvExists || uploading}
          >
            {uploading ? "Uploading..." : cvExists ? "CV Already Uploaded" : "Upload CV"}
          </button>
          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
        {/* Create Post Section*/}
        <Link href="/student/create-post">
          <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create a Post
          </button>
        </Link>
      </main>
    </div>
  );
}
