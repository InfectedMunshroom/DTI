"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface EventDetails {
  _id: string;
  state: string;
  publisher_email: string;
  publisher_name: string;
  title: string;
  description: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/student/ra/event/${id}`
        );
        if (res.status === 200) {
          setEvent(res.data);
        } else {
          console.error("Event not found.");
          router.push("/404");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading event details...
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Event not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-600 py-6 shadow-md">
        <h1 className="text-white text-3xl font-extrabold text-center tracking-wide">
          Event Details
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">{event.title}</h2>
          <p className="text-gray-700 mb-1">
            Published by:{" "}
            <span className="font-medium">
              {event.publisher_name} ({event.publisher_email})
            </span>
          </p>
          <p className="text-gray-800 mt-4 text-lg">{event.description}</p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
              Status: {event.state}
            </span>
            <button
              onClick={async () => {
                try {
                  await axios.post(`http://localhost:8080/increment-counter/${event._id}`);
                  alert("✅ Application submitted successfully!");
                } catch (error) {
                  console.error("Error applying:", error);
                  alert("❌ Failed to apply.");
                }
              }}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Quick Apply
          </button>

          </div>
        </div>
      </main>
    </div>
  );
}
