import Link from 'next/link';

export default function HatcheryBasedOpeningsPage() {
  const hatcheryOpenings = [
    {
      title: 'Product Designer Intern',
      description: 'Join a hatchery-backed startup to design innovative products.',
      link: '/hatchery-openings/product-designer',
    },
    {
      title: 'Full-Stack Developer',
      description: 'Work on core web applications for an emerging hatchery-backed company.',
      link: '/hatchery-openings/full-stack-developer',
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-red-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Hatchery Based Startup Openings</h1>
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

      {/* Hatchery Job Listings */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Current Hatchery Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hatcheryOpenings.map((opening, index) => (
            <Link href={opening.link} key={index} className="block p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-red-600 text-lg font-bold">{opening.title}</h3>
              <p>{opening.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}