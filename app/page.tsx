//import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-red-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Student Community</h1>
        <Link href="/profile">
       <button className="bg-blue-800 text-white px-4 py-2 rounded">Profile</button>
       </Link>
      </nav>

      {/* Navigation Links */}
      <div className="bg-blue-900 text-white py-2 px-4 flex space-x-6 justify-center">
        <a href="#" className="hover:underline">Student Community</a>
        <a href="#" className="hover:underline">Research & Faculty Projects</a>
        <a href="#" className="hover:underline">Startup Openings</a>
        <a href="#" className="hover:underline">Hatchery-based Startup Openings</a>
      </div>

      {/* Latest Student Community Posts */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Latest Student Community Posts</h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 shadow rounded">
            <h3 className="text-red-600 font-bold">Join the Coding Club</h3>
            <p>Enhance your coding skills with peers and mentors.</p>
          </div>
          <div className="bg-gray-100 p-4 shadow rounded">
            <h3 className="text-red-600 font-bold">Hackathon 2025</h3>
            <p>Participate in upcoming hackathons and showcase your talent.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <img src="/hackathon.png" alt="Hackathon" className="w-full h-32 object-cover mb-2"/>
            <h3 className="font-bold text-lg">University Hackathon</h3>
            <p>Compete with the best minds in a 24-hour coding challenge.</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <img src="/techtalk.png" alt="Tech Talk" className="w-full h-32 object-cover mb-2"/>
            <h3 className="font-bold text-lg">Tech Talk: AI & Future</h3>
            <p>Join industry experts as they discuss the future of AI.</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <img src="/startup.png" alt="Startup Showcase" className="w-full h-32 object-cover mb-2"/>
            <h3 className="font-bold text-lg">Startup Showcase</h3>
            <p>Watch emerging startups pitch their ideas to investors.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

