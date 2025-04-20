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

interface Post {
  _id: string;
  title: string;
  description: string;
  state: string;
  timestamp?: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cv, setCv] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [cvExists, setCvExists] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/student/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setLoading(false);
        fetchPosts(data.email);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });

    fetch("http://localhost:8080/student/cv-status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCvExists(data.cvExists);
      })
      .catch((err) => console.error("Error fetching CV status:", err));
  }, []);

  const fetchPosts = (email: string) => {
    setPostsLoading(true);
    fetch(`http://localhost:8080/student/my-posts?email=${encodeURIComponent(email)}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setPostsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPostsLoading(false);
      });
  };

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
        setCvExists(true);
      } else {
        setMessage("❌ Failed to upload CV.");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      setMessage("❌ Error uploading CV.");
    }

    setUploading(false);
  };

  if (loading) return <p className="text-center text-blue-900">Loading...</p>;
  if (!profile) return <p className="text-center text-red-600">Profile not found.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-red-600 py-4 px-6 shadow-md">
        <h1 className="text-white text-2xl font-bold text-center">Student Profile</h1>
      </header>

      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center font-medium">
        <Link href="/student/community" className="hover:underline">Student Community</Link>
        <Link href="/student/ra" className="hover:underline">RA & Faculty</Link>
        <Link href="/student/internships" className="hover:underline">Internships</Link>
        <Link href="/student/hatchery" className="hover:underline">Bennett Hatchery</Link>
      </nav>

      <main className="flex-grow p-6 max-w-3xl mx-auto bg-white text-blue-900">
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Branch:</strong> {profile.branch}</p>
        <p><strong>Semester:</strong> {profile.semester}</p>

        {/* CV Status */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">CV Status</h3>
          {cvExists === null ? (
            <p>Checking CV status...</p>
          ) : cvExists ? (
            <p className="text-green-600">✅ CV is already uploaded</p>
          ) : (
            <p className="text-red-600">❌ No CV uploaded</p>
          )}
        </div>

        {/* Upload CV */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Upload CV</h3>
          <input
            type="file"
            accept=".pdf"
            className="mt-2 border border-blue-900 p-2 rounded w-full"
            onChange={handleFileChange}
            disabled={cvExists || uploading}
          />
          <button
            className={`mt-3 px-4 py-2 rounded text-white ${
              cvExists || uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-950"
            }`}
            onClick={uploadCv}
            disabled={cvExists || uploading}
          >
            {uploading ? "Uploading..." : cvExists ? "CV Already Uploaded" : "Upload CV"}
          </button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>

        {/* Create Post */}
        <Link href="/student/create-post">
          <button className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Create a Post
          </button>
        </Link>

        {/* Posts */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
          {postsLoading ? (
            <p>Loading your posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">You haven't created any posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post._id} className="border border-gray-200 p-4 rounded shadow-sm bg-gray-50">
                  <h4 className="text-lg font-bold">{post.title}</h4>
                  <p className="text-blue-900">{post.description}</p>
                  <p className="text-sm text-gray-500 mt-2">State: {post.state}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
