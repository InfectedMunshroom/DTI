"use client";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Job {
  title: string;
  description: string;
  link: string;
}

export default function JobsPage() {
  const [jobs] = useState<Job[]>([
    {
      title: "Software Developer Intern",
      description: "Join an early-stage startup and build web applications.",
      link: "/jobs/software-developer",
    },
    {
      title: "Marketing & Growth Specialist",
      description: "Help scale startups with innovative marketing strategies.",
      link: "/jobs/marketing-growth",
    },
  ]);

  const carouselItems: Job[] = [
    {
      title: "Marketing Strategist",
      description: "Join a fast-growing e-commerce startup by BU students.",
      link: "/jobs/marketing-strategist",
    },
    {
      title: "Data Analyst Intern",
      description: "Analyze data trends and provide insights for startups.",
      link: "/jobs/data-analyst",
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-red-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Startup Openings</h1>
        <Link href="/profile">
          <button className="bg-blue-800 text-white px-4 py-2 rounded">Profile</button>
        </Link>
      </nav>

      {/* Navigation Links */}
      <div className="bg-blue-900 text-white py-2 px-4 flex space-x-6 justify-center">
        <Link href="#" className="hover:underline">Student Community</Link>
        <Link href="/researchAndFaculty" className="hover:underline">Research & Faculty Projects</Link>
        <Link href="/startupBased" className="hover:underline">Startup Openings</Link>
        <Link href="/hatcheryBased" className="hover:underline">Hatchery-based Startup Openings</Link>
      </div>

      {/* Job Listings */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Startup Jobs & Internships</h2>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <Link href={job.link} key={index} className="block p-4 bg-gray-100 rounded shadow hover:shadow-md transition-shadow">
              <h3 className="text-red-600 font-bold">{job.title}</h3>
              <p>{job.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-8 px-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Jobs from Alumni & Student-led Startups</h2>
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
            <Link href={item.link} key={index} className="block p-4 bg-white rounded shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </Carousel>
      </section>
    </div>
  );
}
