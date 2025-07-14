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
  Users,
  Tag,
  Globe,
  FileText,
  Video,
  User,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Cookies from "js-cookie";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerBio: string;
  organizerPhoto: string;
  platformLink?: string;
  fees: string;
  materials?: string;
  isRecorded: boolean;
  image: string;
  category: string;
  mode: 'online' | 'offline';
  targetAudience: string;
  logo: string;
  isVccEvent?: boolean;
  registrationLimit?: number | null;
  registrationCount?: number;
  isRegistrationFull?: boolean;
  registrations?: Array<{
    _id: string;
    userId: {
      _id: string;
      username: string;
      email: string;
    };
    registeredAt: string;
  }>;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<{ id: string; role: string; email: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Fetch user details from token
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserDetails({
          id: payload.userId,
          role: payload.role,
          email: payload.email
        });
        // User details set for registration checks
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

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



  const handleRegister = async () => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/register`,
        {
          eventId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        alert("Registration successful!");
        setIsModalOpen(false);
        // Refresh event data to show updated registration count
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`
        );
        if (refreshResponse.status === 200) {
          setEvent(refreshResponse.data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setRegistrationError(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        setRegistrationError("You don't have permission to register for this event.");
      } else {
        console.error("Error registering for event:", error);
        setRegistrationError("An error occurred. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  if (!event) {
    return <p className="text-center text-gray-500">Loading event details...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {event.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-4 text-gray-300"
            >
              <span className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {event.time}
              </span>
              <span className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {event.location}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-white">{event.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-400">Target Audience</p>
                    <p className="text-white">{event.targetAudience}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-400">Mode</p>
                    <p className="text-white">{event.mode}</p>
                  </div>
                </div>
                {event.materials && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-400">Materials</p>
                      <p className="text-white">{event.materials}</p>
                    </div>
                  </div>
                )}
                {event.isRecorded && (
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-400">Recording</p>
                      <p className="text-white">Event will be recorded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Organizer</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={event.organizerPhoto}
                  alt={event.organizer}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{event.organizer}</h3>
                  <p className="text-gray-300 mt-2">{event.organizerBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Time Remaining</p>
                <p className="text-2xl font-bold text-orange-500">{timeLeft}</p>
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Registration Fee</p>
                <p className="text-2xl font-bold">{event.fees}</p>
              </div>
              {event.registrationLimit && (
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-400">Registrations</p>
                  <p className="text-xl font-bold">
                    {event.registrationCount || 0}/{event.registrationLimit}
                  </p>
                  {event.isRegistrationFull && (
                    <p className="text-red-500 text-sm mt-1">Registration Full</p>
                  )}
                </div>
              )}
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={event.isRegistrationFull}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {event.isRegistrationFull ? 'Registration Full' : 'Register Now'}
              </Button>
            </div>

            {event.platformLink && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Platform Link</h3>
                <a
                  href={event.platformLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 break-all"
                >
                  {event.platformLink}
                </a>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Share Event</h3>
              <div className="flex justify-center space-x-4">
                <a
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                  )}&text=${encodeURIComponent(event.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    window.location.href
                  )}&title=${encodeURIComponent(event.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black text-white border border-orange-500 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Register for {event.name}
            </h2>

            {!userDetails ? (
              <div className="text-center py-4">
                <p className="text-red-500 mb-4">Please log in to register for events.</p>
                <Link href="/auth/sign-in" className="text-orange-500 hover:text-orange-600">
                  Go to Login
                </Link>
              </div>
            ) : event?.isVccEvent && userDetails.role !== 'vcc_member' ? (
              <div className="text-center py-4">
                <p className="text-red-500 mb-4">This event is only open to VCC members.</p>
                <Link href="/membership" className="text-orange-500 hover:text-orange-600">
                  Become a VCC Member
                </Link>
              </div>
            ) : !['user', 'vcc_member'].includes(userDetails.role) ? (
              <div className="text-center py-4">
                <p className="text-red-500">Only users and VCC members can register for events.</p>
              </div>
            ) : event.isRegistrationFull ? (
              <div className="text-center py-4">
                <p className="text-red-500 mb-4">
                  Sorry, registrations are closed for this event.
                </p>
                <p className="text-gray-400 text-sm">
                  Registration limit: {event.registrationCount || 0}/{event.registrationLimit}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrationError && (
                  <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
                    {registrationError}
                  </div>
                )}
                <div className="text-center py-4">
                  <p className="text-white mb-4">
                    Are you sure you want to register for this event?
                  </p>
                  <p className="text-gray-400 text-sm">
                    You will be registered as: {userDetails.email}
                  </p>
                  {event.registrationLimit && (
                    <p className="text-gray-400 text-sm mt-2">
                      Spots remaining: {event.registrationLimit - (event.registrationCount || 0)}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-gray-600"
                    disabled={isRegistering}
                  >
                    Cancel
                  </Button>
                  {!event.isRegistrationFull && (
                    <Button 
                      onClick={handleRegister} 
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isRegistering}
                    >
                      {isRegistering ? 'Registering...' : 'Confirm Registration'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
