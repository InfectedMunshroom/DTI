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
        `http://localhost:8080/student/internships?page=${page}&limit=10`
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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Research Based Events and Openings</h1>

      {posts.length === 0 && <p className="text-center text-gray-500">No posts found.</p>}
      <div className="space-y-4">
        {posts.map((post, index) => {
          if (!post._id) {
            console.warn("Invalid Post Data:", post);
            return null; // Skip rendering invalid posts
          }
          return (
            <Link key={post._id} href={`/student/internships/event/${post._id}`}>
              <div
                ref={index === posts.length - 1 ? lastPostRef : null}
                className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer"
              >
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">
                  By {post.publisher_name} ({post.publisher_email})
                </p>
                <p className="text-gray-800">{post.description.slice(0, 100)}...</p>
                <span className="text-xs text-gray-500">State: {post.state}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
}
