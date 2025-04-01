"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  name: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  skills: string[];
  projects: string[];
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/student/profile", { credentials: "include" })
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center text-red-500">Profile not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-red-600 py-4 px-6">
        <h1 className="text-white text-2xl font-bold text-center">Student Profile</h1>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center">
        <Link href="/student/community">Student Community</Link>
        <Link href="/student/ra">RA & Faculty</Link>
        <Link href="/student/internships">Internships</Link>
        <Link href="/student/hatchery">Bennett Hatchery</Link>
      </nav>

      {/* Profile Section */}
      <main className="flex-grow p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
        <p className="text-gray-600"><strong>Email:</strong> {profile.email}</p>
        <p className="text-gray-600"><strong>Phone:</strong> {profile.phone}</p>
        <p className="text-gray-600"><strong>Branch:</strong> {profile.branch}</p>
        <p className="text-gray-600"><strong>Semester:</strong> {profile.semester}</p>

        {/* Skills */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
          {profile.skills.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {profile.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No skills listed.</p>
          )}
        </div>

        {/* Projects */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
          {profile.projects.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {profile.projects.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No projects listed.</p>
          )}
        </div>
      </main>
    </div>
  );
}
