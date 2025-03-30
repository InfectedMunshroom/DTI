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
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="bg-red-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Hatchery Based Startup Openings</h1>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-900 text-white py-2">
        <ul className="flex justify-center space-x-8">
          <li className="cursor-pointer hover:underline">Student Community</li>
          <li className="cursor-pointer hover:underline">Research & Faculty Led Project Positions</li>
          <li className="cursor-pointer hover:underline">Startup Openings</li>
          <li className="cursor-pointer hover:underline">Hatchery Based Startup Openings</li>
        </ul>
      </nav>

      {/* Hatchery Job Listings */}
      <section className="my-8">
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
