"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

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
  isVccEvent: boolean;
  registrationLimit?: number | null;
  registrationCount?: number;
  isRegistrationFull?: boolean;
  image: string;
  category: string;
  mode: "online" | "offline";
  targetAudience: string;
  logo: string;
  college: string;
}

export default function VccEventsPage() {
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [targetAudienceFilter, setTargetAudienceFilter] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch VCC events from the backend
  useEffect(() => {
    const fetchVccEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/vcc`
        );
        if (response.status === 200) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching VCC events:", error);
        setError("Failed to load VCC events");
      } finally {
        setLoading(false);
      }
    };

    fetchVccEvents();
  }, []);

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
      // Backend already filters for VCC events, so no need to filter here
      matchesSearch &&
      matchesCategory &&
      matchesMode &&
      matchesDate &&
      matchesAudience
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">VCC Events</h1>
          <p className="text-gray-400">
            Discover and participate in events organized by VCC members across different colleges.
          </p>
        </div>

        {/* Filters */}
        <section className="py-8">
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
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.mode === "online"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {event.mode}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {event.name}
                  </h3>
                  <div className="space-y-2 text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-orange-500" />
                      <span>
                        {format(new Date(event.date), "MMMM d, yyyy")} at {event.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                                      <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-orange-500" />
                    <span>{event.targetAudience}</span>
                  </div>
                </div>
                
                {/* Registration Status */}
                <div className="mt-2 text-sm">
                  {event.registrationLimit ? (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">
                        {event.registrationCount || 0}/{event.registrationLimit} registered
                      </span>
                      {event.isRegistrationFull && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                          Full
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">
                      {event.registrationCount || 0} registered (unlimited)
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link href={`/events/${event._id}`}>
                    <Button 
                      className={`w-full ${
                        event.isRegistrationFull 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-orange-500 hover:bg-orange-600"
                      } text-white`}
                    >
                      {event.isRegistrationFull ? "Registration Full" : "View Details"}
                    </Button>
                  </Link>
                </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No VCC events found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
} 