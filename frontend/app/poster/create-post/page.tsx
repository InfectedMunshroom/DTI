"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("researchPage")
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/poster/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, category}),
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create a Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
          <label className="block mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
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
            className={`w-full px-4 py-2 text-white rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Submit Post"}
          </button>
        </form>

        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
