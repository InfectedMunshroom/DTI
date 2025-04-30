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

export default function ResearchAssistantOpenings() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const fetchedPages = useRef(new Set<number>());
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g., http://192.168.1.100:8080/api

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading || fetchedPages.current.has(page)) return;
    fetchedPages.current.add(page);
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseUrl}/student/ra?page=${page}&limit=10`
      );

      console.log("API Response:", res.data);

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
  }, [fetchPosts]); // Ensure fetchPosts is called when page or state changes

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-red-600 py-6 shadow-md">
        <h1 className="text-white text-3xl font-extrabold text-center tracking-wide">
          Research Assistant Openings
        </h1>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-900 text-white py-3 shadow">
        <div className="max-w-5xl mx-auto flex justify-center space-x-6 text-sm font-medium">
          <Link href="/student/community" className="hover:text-yellow-300 transition-colors">
            Student Community
          </Link>
          <Link
            href="/student/ra"
            className="hover:text-yellow-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Research Positions
          </Link>
          <Link href="/student/internships" className="hover:text-yellow-300 transition-colors">
            Entrepreneur Openings
          </Link>
          <Link href="/student/hatchery" className="hover:text-yellow-300 transition-colors">
            Hatchery Openings
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-4 py-10 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.length === 0 && !loading && (
            <p className="text-center text-gray-500 text-lg">No posts found.</p>
          )}

          {posts.map((post, index) => {
            if (!post._id) return null;
            return (
              <Link key={post._id} href={`/student/ra/event/${post._id}`}>
                <div
                  ref={index === posts.length - 1 ? lastPostRef : null}
                  className="relative border border-blue-200 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer hover:bg-blue-50"
                >
                  <h2 className="text-xl font-semibold text-blue-900">{post.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    By {post.publisher_name} ({post.publisher_email})
                  </p>
                  <p className="text-gray-700 mt-2">{post.description.slice(0, 150)}...</p>
                  <span className="inline-block mt-4 px-3 py-1 bg-gray-100 text-xs text-gray-600 rounded-full font-medium">
                    Status: {post.state}
                  </span>
                </div>
              </Link>
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
