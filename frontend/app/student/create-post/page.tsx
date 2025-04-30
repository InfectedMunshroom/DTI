"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("studentCommunity");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${baseUrl}/student/create-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          category,
          application_counter: 0,
        }),
      });

      if (response.ok) {
        setMessage("✅ Post created successfully!");
        setTimeout(() => router.push("/student/community"), 1500);
      } else {
        setMessage("❌ Failed to create post.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error creating post.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <header className="bg-red-700 py-4 px-6 w-full text-center shadow-md">
        <h1 className="text-white text-2xl font-bold">Create a Post</h1>
      </header>

      {/* Nav */}
      <nav className="bg-blue-900 text-white py-3 px-4 w-full flex space-x-6 justify-center text-sm font-medium">
        <a href="/student/community" className="hover:underline">Student Community</a>
        <a href="/student/ra" className="hover:underline">RA Opportunities</a>
        <a href="/student/internships" className="hover:underline">Internships</a>
        <a href="/student/hatchery" className="hover:underline">Bennett Hatchery</a>
      </nav>

      {/* Form */}
      <main className="flex-grow flex items-center justify-center p-6 w-full">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border-2 border-blue-900">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-900">Title</label>
              <input
                type="text"
                className="w-full mt-1 border border-blue-500 text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-900">Description</label>
              <textarea
                className="w-full mt-1 border border-blue-500 p-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={`w-full py-2 text-white font-semibold rounded-md transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
                }`}
              disabled={loading}
            >
              {loading ? "Posting..." : "Submit Post"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center font-medium text-blue-900">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
