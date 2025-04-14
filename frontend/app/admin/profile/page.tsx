"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  name: string;
  email: string;
  phone: string;
  designation: string;
  id_number: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/admin/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-blue-700 animate-pulse">Loading...</p>
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Profile not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 py-6 shadow-md">
        <h1 className="text-white text-3xl font-extrabold text-center tracking-wide">Admin</h1>
      </header>
      {/* Button Right for Logout*/}
      <button
      onClick={async () => {
        const res = await fetch("http://localhost:8080/logout", {
          method: "POST",
          credentials: "include",
        });
    
        if (res.ok) {
          window.location.href = "/";
        } else {
          alert("Logout failed");
        }
      }}
      className="absolute top-4 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold z-50"
    >
      Log Out
    </button>

      {/* Navbar */}
      <nav className="bg-blue-900 text-white py-4 shadow-md">
        <div className="flex justify-center space-x-8 text-sm font-medium">
          <Link
            href="/admin/community"
            className="hover:text-yellow-300 transition-colors duration-200"
          >
            Student Community
          </Link>
          <Link
            href="/admin/ra"
            className="hover:text-yellow-300 transition-colors duration-200"
          >
            Research Positions
          </Link>
          <Link
            href="/admin/internships"
            className="hover:text-yellow-300 transition-colors duration-200"
          >
            Internships
          </Link>
          <Link
            href="/admin/hatchery"
            className="hover:text-yellow-300 transition-colors duration-200"
          >
            Hatchery
          </Link>
        </div>
      </nav>


      {/* Profile Section */}
      <main className="flex-grow px-4 py-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {profile.name}
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Designation:</span>{" "}
              {profile.designation}
            </p>
            <p>
              <span className="font-semibold text-gray-900">ID:</span>{" "}
              {profile.id_number}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {profile.email}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Phone:</span>{" "}
              {profile.phone}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
