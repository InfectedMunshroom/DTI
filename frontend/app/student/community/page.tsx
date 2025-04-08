"use client"; // Ensure this runs only on the client

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
  const fetchedPages = useRef(new Set<number>()); // Prevent duplicate fetching

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading || fetchedPages.current.has(page)) return;
    fetchedPages.current.add(page); // Mark this page as fetched
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/student/community?page=${page}&limit=10`
      );

      console.log("API Response:", res.data);

      if (!Array.isArray(res.data) || res.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...res.data]); // Append new posts
        setPage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-red-600 py-4 px-6">
        <h1 className="text-white text-2xl font-bold text-center">Student Community</h1>
      </header>

      {/* Navigation Links */}
      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/ra-positions" className="hover:underline">RA Positions</Link>
        <Link href="/entrepreneur-openings" className="hover:underline">Entrepreneur Openings</Link>
        <Link href="/hatchery-openings" className="hover:underline">Hatchery Openings</Link>
      </nav>

      {/* Main Content */}
      <div className="flex-grow container mx-auto p-6 max-w-4xl">
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-8">No posts found.</p>
        )}

        <div className="space-y-4">
          {posts.map((post, index) => {
            if (!post._id) {
              console.warn("Invalid Post Data:", post);
              return null; // Skip rendering invalid posts
            }
            return (
              <Link key={post._id} href={`/student/community/event/${post._id}`}>
                <div
                  ref={index === posts.length - 1 ? lastPostRef : null}
                  className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer p-6"
                >
                  <h2 className="text-xl font-semibold text-blue-900">{post.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    By {post.publisher_name} ({post.publisher_email})
                  </p>
                  <p className="text-gray-800 mt-2">{post.description.slice(0, 100)}...</p>
                  <span className="inline-block mt-3 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    Status: {post.state}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {loading && (
          <div className="text-center mt-6 py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading more posts...</p>
          </div>
        )}
      </div>
    </div>
  );
}