"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

interface Profile {
  name: string;
  email: string;
  phone: string;
  designation: string;
  id_number: string;
  school: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  state: string;
  database?: string;
}

export default function PosterProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = (email: string) => {
    setPostsLoading(true);
    fetch(`http://localhost:8080/poster/my-posts?email=${encodeURIComponent(email)}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.warn("Unexpected posts data:", data);
          setPosts([]);
        }
        setPostsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
        setPosts([]);
        setPostsLoading(false);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/poster/profile", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data: Profile) => setProfile(data))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      });
  }, []);

  useEffect(() => {
    if (profile?.email) {
      fetchPosts(profile.email);
    }
  }, [profile]);

  const handleDeletePost = async (postId: string, database?: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/poster/delete-post`, {
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

  if (!profile)
    return <p className="text-center text-lg text-gray-600 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="bg-green-600 py-4 px-6 w-full text-center">
        <h1 className="text-white text-2xl font-bold">Poster Profile</h1>
      </header>

      <nav className="bg-gray-900 text-white py-3 px-4 w-full flex space-x-6 justify-center">
        <Link href="/poster/community">Student Community</Link>
        <Link href="/poster/ra">RA Opportunities</Link>
        <Link href="/poster/internships">Internships</Link>
        <Link href="/poster/hatchery">Bennett Hatchery</Link>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full">
        <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{profile.name}</h2>
          <div className="text-left space-y-3">
            <p className="bg-gray-200 text-gray-700 p-2 rounded">📧 Email: {profile.email}</p>
            <p className="bg-gray-200 text-gray-700 p-2 rounded">📞 Phone: {profile.phone}</p>
            <p className="bg-gray-200 text-gray-700 p-2 rounded">🏢 Designation: {profile.designation}</p>
            <p className="bg-gray-200 p-2 rounded">🆔 ID: {profile.id_number}</p>
            <p className="bg-gray-200 p-2 rounded">🏫 School: {profile.school}</p>
          </div>
        </div>

        <Link href="/poster/create-post">
          <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create a Post
          </button>
        </Link>

        <div className="mt-10 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Your Posts</h3>
          {postsLoading ? (
            <p>Loading your posts...</p>
          ) : (posts?.length ?? 0) === 0 ? (
            <p className="text-gray-500 text-center">You haven't created any posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="relative border border-gray-200 p-4 rounded shadow-sm bg-white"
                >
                  <button
                    onClick={() => handleDeletePost(post._id, post.database)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    title="Delete Post"
                    aria-label={`Delete post: ${post.title}`}
                  >
                    <FiX size={20} />
                  </button>
                  <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                  <p className="text-gray-600">{post.description}</p>
                  <p className="text-sm text-gray-400 mt-2">State: {post.state}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
