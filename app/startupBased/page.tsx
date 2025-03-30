"use client";
import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons for navigation

interface Job {
  title: string;
  description: string;
  link: string;
}

export default function JobsPage() {
  const [jobs] = useState<Job[]>([
    {
      title: 'Software Developer Intern',
      description: 'Join an early-stage startup and build web applications.',
      link: '/jobs/software-developer',
    },
    {
      title: 'Marketing & Growth Specialist',
      description: 'Help scale startups with innovative marketing strategies.',
      link: '/jobs/marketing-growth',
    },
  ]);

  const carouselItems: Job[] = [
    {
      title: 'Marketing Strategist',
      description: 'Join a fast-growing e-commerce startup by BU students.',
      link: '/jobs/marketing-strategist',
    },
    {
      title: 'Data Analyst Intern',
      description: 'Analyze data trends and provide insights for startups.',
      link: '/jobs/data-analyst',
    },
    // Add more carousel items as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="bg-red-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Startup Openings</h1>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-900 text-white py-2">
        <ul className="flex justify-center space-x-8">
          <li className="cursor-pointer hover:underline">Student Community</li>
          <li className="cursor-pointer hover:underline">
            Research & Faculty Led Project Positions
          </li>
          <li className="cursor-pointer hover:underline">Startup Openings</li>
          <li className="cursor-pointer hover:underline">
            Hatchery Based Startup Openings
          </li>
        </ul>
      </nav>

      {/* Job Listings */}
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Startup Jobs & Internships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <Link href={job.link} key={index} className="block p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-red-600 text-lg font-bold">{job.title}</h3>
              <p>{job.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Carousel Section */}
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">
          Upcoming Jobs from Alumni & Student-led Startups
        </h2>
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          emulateTouch={true}
          showIndicators={true}
          interval={3000}
          transitionTime={500}
          renderArrowPrev={(clickHandler, hasPrev) => 
            hasPrev && (
              <button
                type="button"
                onClick={clickHandler}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
              >
                <FaChevronLeft />
              </button>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <button
                type="button"
                onClick={clickHandler}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
              >
                <FaChevronRight />
              </button>
            )
          }
        >
          {carouselItems.map((item, index) => (
            <Link href={item.link} key={index} className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </Carousel>
      </section>
    </div>
  );
}
