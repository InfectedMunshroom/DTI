// Login Page for the Project
// Student login: student@example.com password 123 after login redircets to student profile


"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");

      // ✅ Send credentials for login
      const res = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        { withCredentials: true } // 👈 Ensures cookies are sent & received
      );

      console.log("Login response:", res.data);

      // ✅ Fetch profile with credentials (not token-based)
      const profileRes = await axios.get("http://localhost:8080/profile", {
        withCredentials: true, // 👈 Required for session-based authentication
      });

      console.log("Profile response:", profileRes.data);

      // ✅ Redirect based on role
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
    <div className="flex flex-col items-center">
      <input className="border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">Login</button>
    </div>
  );
}
