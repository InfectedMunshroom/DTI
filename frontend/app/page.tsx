"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g., http://192.168.1.100:8080/api

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/login`,
        { email, password },
        { withCredentials: true }
      );

      const profileRes = await axios.get(`${baseUrl}/profile`, {
        withCredentials: true,
      });

      if (profileRes.data.role === "student") {
        router.push("/student/profile");
      } else if (profileRes.data.role === "poster") {
        router.push("/poster/profile");
      } else if (profileRes.data.role === "admin") {
        router.push("/admin/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      {/* Red Banner */}
      <div className="w-full bg-red-600 py-4">
        <h1 className="text-center text-white text-3xl font-bold">
          Bennett Bridge
        </h1>
      </div>

      {/* Login Section Card */}
      <div className="flex flex-col items-center justify-center flex-1 mt-16 w-full px-4">
        <div className="w-full max-w-sm bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-black text-center">Login</h2>

          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
