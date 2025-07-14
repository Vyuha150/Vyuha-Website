"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  Upload,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import type { LucideIcon } from "lucide-react";
import Cookies from "js-cookie";

export type Event = {
  id: string;
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
  isRecorded?: boolean;
  image: string;
  category: string;
  mode: "online" | "offline";
  targetAudience: string;
  logo: string;
  icon?: LucideIcon;
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
};

export default function EventsPage() {
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [targetAudienceFilter, setTargetAudienceFilter] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`
        );
        if (response.status === 200) {
          const formattedEvents = response.data.map((event: any) => ({
            ...event,
            id: event._id,
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Calculate timers for events
  useEffect(() => {
    const calculateTimers = () => {
      const newTimers: { [key: string]: string } = {};
      events.forEach((event) => {
        const eventDate = new Date(`${event.date} ${event.time}`);
        const now = new Date();
        const difference = eventDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          newTimers[event.id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimers[event.id] = "Event has started or ended.";
        }
      });
      setTimers(newTimers);
    };

    calculateTimers();
    const timerInterval = setInterval(calculateTimers, 60000); // Update every minute
    return () => clearInterval(timerInterval);
  }, [events]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/register`,
        {
          eventId: selectedEvent?.id,
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
        setSelectedEvent(null);
        
        // Refresh events data to update registration counts
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`
        );
        if (refreshResponse.status === 200) {
          const formattedEvents = refreshResponse.data.map((event: any) => ({
            ...event,
            id: event._id,
          }));
          setEvents(formattedEvents);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        console.error("Error registering for event:", error);
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || !categoryFilter
      ? true
      : event.category === categoryFilter;
    const matchesMode = modeFilter === "all" || !modeFilter
      ? true
      : event.mode === modeFilter;
    const matchesDate = date
      ? format(new Date(event.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
      : true;
    const matchesAudience = targetAudienceFilter === "all" || !targetAudienceFilter
      ? true
      : event.targetAudience === targetAudienceFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMode &&
      matchesDate &&
      matchesAudience
    );
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-300">
            Join us for exciting events and workshops
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-transparent border-white/20"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Competition">Competition</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
              >
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        event.mode === "online"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.mode}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.targetAudience}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold">
                      {event.fees}
                    </span>
                    <div className="text-sm text-gray-400">
                      {timers[event.id]}
                    </div>
                  </div>
                  
                  {/* Registration Status */}
                  <div className="mt-2 text-sm">
                    {event.registrationLimit ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Registrations: {event.registrationCount || 0}/{event.registrationLimit}
                        </span>
                        {event.isRegistrationFull && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                            Full
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        Registrations: {event.registrationCount || 0} (Unlimited)
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-orange-500 hover:text-orange-600 text-sm"
                    >
                      Learn more
                    </Link>
                    <Button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className={`${
                        event.isRegistrationFull 
                          ? "bg-red-600 hover:bg-red-700 cursor-not-allowed" 
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                      disabled={event.isRegistrationFull}
                    >
                      {event.isRegistrationFull ? "Registrations Closed" : "Register Now"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black text-white border border-orange-500 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Register for {selectedEvent.name}
            </h2>
            <div className="space-y-4">
              <div className="text-center py-4">
                {selectedEvent.isRegistrationFull ? (
                  <div>
                    <p className="text-red-400 mb-4">
                      Sorry, registrations are closed for this event.
                    </p>
                    <p className="text-gray-400 text-sm">
                      Registration limit: {selectedEvent.registrationCount || 0}/{selectedEvent.registrationLimit}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white mb-4">
                      Are you sure you want to register for this event?
                    </p>
                    <p className="text-gray-400 text-sm">
                      Please make sure you're logged in to register.
                    </p>
                    {selectedEvent.registrationLimit && (
                      <p className="text-gray-400 text-sm mt-2">
                        Spots remaining: {selectedEvent.registrationLimit - (selectedEvent.registrationCount || 0)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  variant="outline"
                  className="border-gray-600"
                  disabled={isRegistering}
                >
                  {selectedEvent.isRegistrationFull ? 'Close' : 'Cancel'}
                </Button>
                {!selectedEvent.isRegistrationFull && (
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
          </div>
        </div>
      )}
    </div>
  );
}
