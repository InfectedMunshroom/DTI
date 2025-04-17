"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

interface Post {
  _id: string;
  state: string;
  publisher_email: string;
  publisher_name: string;
  title: string;
  description: string;
}

 export default function StudentCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchedPages = useRef(new Set<number>());

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading || fetchedPages.current.has(page)) return;
    fetchedPages.current.add(page);
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:8080/student/community?page=${page}&limit=10`);
      if (!Array.isArray(res.data) || res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchPosts();
          }
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts]
  );

  // 🗑️ Handle Delete
  const handleDeletePost = async (postId: string, database?: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/delete-post`, {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 py-6 shadow-md">
        <h1 className="text-white text-3xl font-extrabold text-center tracking-wide">
          Student Community
        </h1>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-blue-900 text-white py-4 shadow-md">
        <div className="flex justify-center space-x-8 text-sm font-medium">
          <Link href="/admin/community" className="hover:text-yellow-300 transition-colors">
            Student Community
          </Link>
          <Link href="/admin/ra" className="hover:text-yellow-300 transition-colors">
            Research Positions
          </Link>
          <Link href="/admin/internships" className="hover:text-yellow-300 transition-colors">
            Entrepreneur Openings
          </Link>
          <Link href="/admin/hatchery" className="hover:text-yellow-300 transition-colors">
            Hatchery Openings
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8 text-lg">No posts found.</p>
          )}

          {posts.map((post, index) => {
            if (!post._id) return null;
            return (
              <div
                key={post._id}
                ref={index === posts.length - 1 ? lastPostRef : null}
                className="relative bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition cursor-pointer"
              >
                {/* 🗑️ Delete Button */}
                <button
                  onClick={() => handleDeletePost(post._id, "studentCommunity")}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full shadow-sm transition"
                >
                  Delete
                </button>

                {/* 📄 Post Content */}
                <Link href={`/admin/community/event/${post._id}`}>
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-900">{post.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      By {post.publisher_name} ({post.publisher_email})
                    </p>
                    <p className="text-gray-700 mt-2">{post.description.slice(0, 150)}...</p>
                    <span className="inline-block mt-4 px-3 py-1 bg-gray-100 text-xs text-gray-600 rounded-full font-medium">
                      Status: {post.state}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Loading more posts...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
