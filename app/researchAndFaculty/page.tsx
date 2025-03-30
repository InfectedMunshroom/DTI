import Link from 'next/link';

export default function ResearchFacultyPositionsPage() {
  const positions = [
    {
      title: 'AI Research Assistant',
      description: 'Assist faculty with AI and ML research projects.',
      link: '/positions/ai-research-assistant',
    },
    {
      title: 'Blockchain Development Intern',
      description: 'Work on research initiatives around decentralized systems.',
      link: '/positions/blockchain-development',
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-red-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Research & Faculty Led Project Positions</h1>
        <Link href="/profile">
          <button className="bg-blue-800 text-white px-4 py-2 rounded">Profile</button>
        </Link>
      </nav>

      {/* Navigation Links */}
      <div className="bg-blue-900 text-white py-2 px-4 flex space-x-6 justify-center">
        <Link href="/" className="hover:underline">Student Community</Link>
        <Link href="/researchAndFaculty" className="hover:underline">Research & Faculty Projects</Link>
        <Link href="/startupBased" className="hover:underline">Startup Openings</Link>
        <Link href="/hatcheryBased" className="hover:underline">Hatchery-based Startup Openings</Link>
      </div>

      {/* Position Listings */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Current Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positions.map((position, index) => (
            <Link href={position.link} key={index} className="block p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-red-600 text-lg font-bold">{position.title}</h3>
              <p>{position.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}