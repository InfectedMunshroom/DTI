"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  projects: string[];
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/profile/123")
      .then((res) => res.json())
      .then((data: Profile) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profile) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-red-600 py-4 px-6">
        <h1 className="text-white text-2xl font-bold text-center">Student Profile</h1>
      </header>

      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/ra-positions" className="hover:underline">RA Positions</Link>
        <Link href="/entrepreneur-openings" className="hover:underline">Entrepreneur Openings</Link>
        <Link href="/hatchery-openings" className="hover:underline">Hatchery Openings</Link>
      </nav>

      <div className="flex-grow flex justify-center items-start py-8">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
          <div className="bg-blue-900 text-white p-6 text-center">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm mt-1">{profile.email}</p>
            <p className="text-sm mt-1">{profile.phone}</p>
          </div>

          <div className="p-6 border-b">
            <h3 className="text-red-600 font-semibold border-b pb-2 mb-3">Skills</h3>
            <div className="space-y-2">
              {profile.skills.map((skill, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">{skill}</div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-red-600 font-semibold border-b pb-2 mb-3">Projects</h3>
            <div className="space-y-2">
              {profile.projects.map((project, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">{project}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
