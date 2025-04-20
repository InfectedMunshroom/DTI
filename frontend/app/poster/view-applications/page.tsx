"use client";

import { useParams, useRouter } from "next/navigation";

const applicants = [
  {
    name: "John Doe",
    email: "student@example.com",
    phone: "1234567890",
    branch: "Computer Science",
    semester: "6",
    skills: "Go, MongoDB, React",
    hasCV: true,
  },
];

export default function ViewApplications() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="mb-6">
        <button
          onClick={() => router.push("/poster/profile")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-darkBlue transition duration-200"
        >
          Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center text-red-700">
        Applicants for Post ID: <span className="text-darkBlue">{id}</span>
      </h1>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {applicants.map((applicant, index) => (
          <div
            key={index}
            className="bg-white border-2 border-darkBlue rounded-xl p-6 space-y-3 shadow-md"
          >
            <h2 className="text-xl font-semibold text-black">{applicant.name}</h2>
            <p className="text-gray-800">📧 Email: {applicant.email}</p>
            <p className="text-gray-800">📞 Phone: {applicant.phone}</p>
            <p className="text-gray-800">🏫 Branch: {applicant.branch}</p>
            <p className="text-gray-800">📚 Semester: {applicant.semester}</p>
            <p className="text-gray-800">💼 Skills: {applicant.skills}</p>
            {applicant.hasCV ? (
              <a
                href={`http://localhost:8080/student/get-cv?id=67ea94e523f756cb3001337b`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                View CV
              </a>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No CV uploaded</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
