"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("researchPage");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${baseUrl}/poster/create-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, category, application_counter:0 }),
      });

      if (response.ok) {
        setMessage("✅ Post created successfully!");
        setTimeout(() => router.push("/poster/community"), 1500);
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
      <nav className="bg-blue-900 text-white py-3 px-4 w-full flex space-x-6 justify-center">
        <a href="/poster/community" className="hover:underline">Student Community</a>
        <a href="/poster/ra" className="hover:underline">RA Opportunities</a>
        <a href="/poster/internships" className="hover:underline">Internships</a>
        <a href="/poster/hatchery" className="hover:underline">Bennett Hatchery</a>
      </nav>

      {/* Form */}
      <main className="flex-grow flex items-center justify-center p-6 w-full">
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-md border border-red-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                className="w-full mt-1 border border-blue-300 text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                className="w-full mt-1 border border-blue-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <select
                className="w-full mt-1 border border-blue-300 p-2 rounded focus:outline-none text-black focus:ring-2 focus:ring-red-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="researchPage">RA</option>
                <option value="internPage">Internship</option>
                <option value="hatcheryPage">Hatchery</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-2 text-white rounded transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={loading}
            >
              {loading ? "Posting..." : "Submit Post"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-blue-800 font-medium">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}

