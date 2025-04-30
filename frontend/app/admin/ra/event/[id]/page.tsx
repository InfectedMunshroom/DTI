"use client"; // Client-side fetching

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
export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${baseUrl}/student/ra/event/${id}`);
        if (res.status === 200) {
          setEvent(res.data);
        } else {
          console.error("Event not found.");
          router.push("/404"); // Redirect to 404 page if event is missing
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center text-red-500">Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600">
        By {event.publisher_name} ({event.publisher_email})
      </p>
      <p className="text-lg mt-4">{event.description}</p>
      <span className="text-xs text-gray-500">State: {event.state}</span>
    </div>
  );
}
