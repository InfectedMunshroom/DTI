"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  name: string;
  email: string;
  phone: string;
  designation: string;
  id_number: string;
  school: string;
}

export default function PosterProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/poster/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data: Profile) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profile)
    return <p className="text-center text-lg text-gray-600 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="bg-green-600 py-4 px-6 w-full text-center">
        <h1 className="text-white text-2xl font-bold">Poster Profile</h1>
      </header>

      <nav className="bg-gray-900 text-white py-3 px-4 w-full flex space-x-6 justify-center">
        <Link href="/poster/community">Student Community</Link>
        <Link href="/poster/ra">RA Opportunities</Link>
        <Link href="/poster/internships">Internships</Link>
        <Link href="/poster/hatchery">Bennett Hatchery</Link>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full">
        <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{profile.name}</h2>
          <div className="text-left space-y-3">
            <p className="bg-gray-200 text-gray-700 p-2 rounded">📧 Email: {profile.email}</p>
            <p className="bg-gray-200 text-gray-700 p-2 rounded">📞 Phone: {profile.phone}</p>
            <p className="bg-gray-200 text-gray-700 p-2 rounded">🏢 Designation: {profile.designation}</p>
            <p className="bg-gray-200 p-2 rounded">🆔 ID: {profile.id_number}</p>
            <p className="bg-gray-200 p-2 rounded">🏫 School: {profile.school}</p>
          </div>
        </div>
        <Link href="/poster/create-post">
          <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create a Post
          </button>
        </Link>

      </main>
    </div>
    

    
  );
}