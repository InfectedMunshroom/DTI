import Image from "next/image";
import Link from "next/link";

export default function StudentProfile() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-red-600 py-4 px-6">
        <h1 className="text-white text-2xl font-bold text-center">Student Profile</h1>
      </header>

      {/* Navigation Links */}
      <nav className="bg-blue-900 text-white py-3 px-4 flex space-x-6 justify-center">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/ra-positions" className="hover:underline">RA Positions</Link>
        <Link href="/entrepreneur-openings" className="hover:underline">Entrepreneur Openings</Link>
        <Link href="/hatchery-openings" className="hover:underline">Hatchery Openings</Link>
      </nav>

      {/* Profile Card */}
      <div className="flex-grow flex justify-center items-start py-8">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-900 text-white p-6 text-center">
            <div className="inline-block bg-gray-200 text-gray-500 rounded-full px-4 py-1 mb-3">
              Profile Picture
            </div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm mt-1">Computer Science | Class of 2026</p>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b">
            <h3 className="text-red-600 font-semibold border-b pb-2 mb-3">Contact Details</h3>
            <p className="my-2">Email: johndoe@example.com</p>
            <p className="my-2">Phone: +91 98765 43210</p>
          </div>

          {/* Skills */}
          <div className="p-6 border-b">
            <h3 className="text-red-600 font-semibold border-b pb-2 mb-3">Skills</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 rounded">Machine Learning</div>
              <div className="bg-gray-100 p-2 rounded">Full-Stack Development</div>
              <div className="bg-gray-100 p-2 rounded">Cybersecurity</div>
            </div>
          </div>

          {/* Projects */}
          <div className="p-6">
            <h3 className="text-red-600 font-semibold border-b pb-2 mb-3">Projects</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 rounded">AI-based Intrusion Detection System</div>
              <div className="bg-gray-100 p-2 rounded">Decentralized File Storage</div>
              <div className="bg-gray-100 p-2 rounded">Secure Web Authentication</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}