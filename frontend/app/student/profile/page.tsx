"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

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
  database?: string;
  application_counter?: number;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const [cvExists, setCvExists] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/student/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        fetchPosts(data.email);
      })
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));

    fetch("http://localhost:8080/student/cv-status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCvExists(data.cvExists))
      .catch((err) => console.error("Error fetching CV status:", err));
  }, []);

  const fetchPosts = (email: string) => {
    setPostsLoading(true);
    fetch(`http://localhost:8080/student/my-posts?email=${encodeURIComponent(email)}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      })
      .finally(() => setPostsLoading(false));
  };

  const handleDeletePost = async (postId: string, database?: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:8080/poster/delete-post", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: postId, database }),
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setCv(e.target.files[0]);
  };

  const uploadCv = async () => {
    if (!cv) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("cv", cv);

    try {
      const res = await fetch("http://localhost:8080/student/upload-cv", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        setCvExists(true);
        setMessage("✅ CV uploaded successfully!");
      } else {
        setMessage("❌ Failed to upload CV.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Error uploading CV.");
    }

    setUploading(false);
  };

  if (loading) {
    return <p className="text-center mt-10 text-blue-700">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-10 text-red-600">Failed to load profile.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-red-600 py-4 px-6 shadow-md text-white text-2xl font-bold text-center">
        Student Profile
      </header>
      <button
      onClick={async () => {
        const res = await fetch("http://localhost:8080/logout", {
          method: "POST",
          credentials: "include",
        });
    
        if (res.ok) {
          window.location.href = "/";
        } else {
          alert("Logout failed");
        }
      }}
      className="absolute top-4 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold z-50"
    >
      Log Out
    </button>
      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center font-medium">
        <Link href="/student/community" className="hover:underline">Student Community</Link>
        <Link href="/student/ra" className="hover:underline">RA & Faculty</Link>
        <Link href="/student/internships" className="hover:underline">Internships</Link>
        <Link href="/student/hatchery" className="hover:underline">Bennett Hatchery</Link>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto py-8 px-4 text-blue-900">
        <section className="mb-8 border border-blue-300 shadow p-4 rounded bg-white">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">👤 {profile.name}</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Branch:</strong> {profile.branch}</p>
          <p><strong>Semester:</strong> {profile.semester}</p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-semibold">CV Status</h3>
          {cvExists === null ? (
            <p>Checking CV status...</p>
          ) : cvExists ? (
            <p className="text-green-600 mt-1">✅ CV already uploaded</p>
          ) : (
            <p className="text-red-600 mt-1">❌ No CV uploaded</p>
          )}
        </section>

        {!cvExists && (
          <section className="mb-10">
            <h3 className="text-lg font-semibold">Upload CV</h3>
            <input
              type="file"
              accept=".pdf"
              className="mt-2 border border-blue-900 p-2 rounded w-full"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <button
              className={`mt-3 px-4 py-2 rounded text-white ${
                uploading ? "bg-gray-400" : "bg-blue-900 hover:bg-blue-950"
              }`}
              onClick={uploadCv}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload CV"}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </section>
        )}

        <Link href="/student/create-post">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mb-10">
            Create a Post
          </button>
        </Link>

        <section>
          <h3 className="text-xl font-semibold text-center mb-4">Your Posts</h3>
          {postsLoading ? (
  <p className="text-center text-blue-600">Loading posts...</p>
) : !Array.isArray(posts) || posts.length === 0 ? (
  <p className="text-center text-gray-500">You haven't created any posts yet.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {(posts || []).map((post) => {
      const clickable = (post.application_counter ?? 0) > 0;
      const content = (
        <div className="relative border border-blue-200 p-4 rounded shadow bg-white hover:shadow-md transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost(post._id, post.database);
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            title="Delete Post"
            aria-label={`Delete post: ${post.title}`}
          >
            <FiX size={20} />
          </button>
          <h4 className="text-lg font-bold text-blue-900">{post.title}</h4>
          <p className="text-gray-700 mt-1">{post.description}</p>
          <p className="text-sm text-gray-500 mt-2">State: {post.state}</p>
          <p className="text-sm text-red-600 mt-1">Applications: {post.application_counter ?? 0}</p>
        </div>
      );

      return (
        <div key={post._id}>
          {clickable ? (
            <Link href={`/poster/view-applications/`}>
              {content}
            </Link>
          ) : (
            content
          )}
        </div>
      );
    })}
  </div>
)}

        </section>
      </main>
    </div>
  );
}
