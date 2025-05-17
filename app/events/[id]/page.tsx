"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch event details from the backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`
        );
        if (response.status === 200) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (event) {
      const calculateTimeLeft = () => {
        const eventDate = new Date(`${event.date} ${event.time}`);
        const now = new Date();
        const difference = eventDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft("Event has started or ended.");
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [event]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/register`,
        {
          eventId: id,
          ...formData,
        }
      );

      if (response.status === 200) {
        alert("Registration successful!");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error registering for event:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  if (!event) {
    return <p className="text-center text-gray-500">Event not found.</p>;
  }

  return (
    <main className="min-h-screen py-20 px-4 md:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Event Image */}
        <div className="relative w-full h-64 md:h-96 mb-8">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
            alt={event.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Event Title */}
        <motion.h1
          className="text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {event.name}
        </motion.h1>

        {/* Countdown Timer */}
        <div className="text-lg font-medium text-orange-500 mb-8 text-center">
          {timeLeft && <p>Time Left: {timeLeft}</p>}
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {event.description}
            </p>

            {/* Date, Time, Location */}
            <div className="flex flex-col gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-orange-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Fees and Materials */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Fees</h3>
              <p className="text-gray-300">${event.fees || "Free"}</p>
              <h3 className="text-lg font-bold mt-4 mb-2">Materials</h3>
              <p className="text-gray-300">
                {event.materials || "No materials required"}
              </p>
            </div>

            {/* Registration Button */}
            <div className="mt-6">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 hover:scale-105 duration-300 w-full"
                onClick={() => setIsModalOpen(true)}
              >
                Register Now
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Organizer Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.organizerPhoto}`}
                alt={event.organizer}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{event.organizer}</h3>
                <p className="text-gray-400">{event.organizerBio}</p>
              </div>
            </div>

            {/* Webinar Link */}
            {event.platformLink && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Webinar Link</h3>
                <a
                  href={event.platformLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  Join Webinar
                </a>
              </div>
            )}

            {/* Recording Availability */}
            {event.isRecorded && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Recording</h3>
                <p className="text-gray-400">
                  This event will be recorded. The recording will be available
                  after the event.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Social Sharing */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold mb-4">Share This Event</h3>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-orange-500 border-blue-500"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-orange-500 border-blue-400"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-orange-500 border-blue-600"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md border border-orange-500">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Register for {event.name}
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  className="rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message (Optional)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any additional message"
                  rows={3}
                  className="rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-300 border-gray-300"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 text-white">
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
