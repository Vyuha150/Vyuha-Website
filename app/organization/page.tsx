"use client";

import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  CalendarDays,
  Presentation,
  Search,
  Plus,
  Filter,
} from "lucide-react";

// Define the types for each resource
interface Student {
  name: string;
  skills: string[];
  availability: string;
  location: string;
}

interface Hall {
  name: string;
  capacity: string;
  facilities: string[];
  location: string;
}

interface Event {
  title: string;
  date: string;
  type: string;
  attendees: string;
}

interface Project {
  title: string;
  status: string;
  team: string;
  domain: string;
}

// Union type for all resource items
type ResourceItem = Student | Hall | Event | Project;

// Define the structure for each resource category
interface ResourceCategory {
  type: "students" | "halls" | "events" | "projects";
  items: ResourceItem[];
}

// Add type guards to narrow down the type of ResourceItem
function isStudent(item: ResourceItem): item is Student {
  return (item as Student).skills !== undefined;
}

function isHall(item: ResourceItem): item is Hall {
  return (item as Hall).capacity !== undefined;
}

function isEvent(item: ResourceItem): item is Event {
  return (item as Event).date !== undefined;
}

function isProject(item: ResourceItem): item is Project {
  return (item as Project).status !== undefined;
}

export default function OrganizationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "students" | "halls" | "events" | "projects"
  >("students");
  const [showModal, setShowModal] = useState(false);

  // State for each resource type
  const [students, setStudents] = useState<Student[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form state
  const [formData, setFormData] = useState<any>({});

  const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtered resources based on search
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredHalls = halls.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add Resource button
  const handleAddResource = () => {
    setFormData({});
    setShowModal(true);
  };

  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "students") {
      setStudents([
        ...students,
        {
          ...formData,
          skills: (formData.skills || "")
            .split(/[,\n]/)
            .map((s: string) => s.trim())
            .filter(Boolean),
        },
      ]);
    } else if (activeTab === "halls") {
      setHalls([
        ...halls,
        {
          ...formData,
          facilities: (formData.facilities || "")
            .split(/[,\n]/)
            .map((f: string) => f.trim())
            .filter(Boolean),
        },
      ]);
    } else if (activeTab === "events") {
      setEvents([...events, formData]);
    } else if (activeTab === "projects") {
      setProjects([...projects, formData]);
    }
    setShowModal(false);
    setFormData({});
  };

  return (
    <main className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Organization Resources</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access and manage resources, view available talent, facilities, and
            upcoming events.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative md:flex-1 w-[90%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10 py-5 blackdrop-blur-sm border-2 bg-black/50 border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 rounded-xl"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>
          <div className="flex gap-4">
            <Button className="gap-2 bg-white/5 backdrop-blur-sm border-2 border-orange-500/50 text-white px-8 py-5 rounded-xl font-medium font-outfit transition-all duration-300 hover:border-orange-500/80 hover:-translate-y-1 active:translate-y-0">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-5 rounded-xl font-medium font-outfit transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0"
              onClick={handleAddResource}
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </Button>
          </div>
        </div>

        {/* Modal for adding resource */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-orange-500"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-white">
                Add{" "}
                {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1).replace(/s$/, "")}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeTab === "students" && (
                  <>
                    <Input
                      name="name"
                      placeholder="Name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="skills"
                      placeholder="Skills (one per line or comma-separated)"
                      value={formData.skills || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="availability"
                      placeholder="Availability"
                      value={formData.availability || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="location"
                      placeholder="Location"
                      value={formData.location || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </>
                )}
                {activeTab === "halls" && (
                  <>
                    <Input
                      name="name"
                      placeholder="Hall Name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="capacity"
                      placeholder="Capacity"
                      value={formData.capacity || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="facilities"
                      placeholder="Facilities (one per line or comma-separated)"
                      value={formData.facilities || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="location"
                      placeholder="Location"
                      value={formData.location || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </>
                )}
                {activeTab === "events" && (
                  <>
                    <Input
                      name="title"
                      placeholder="Event Title"
                      value={formData.title || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="date"
                      type="date"
                      placeholder="Date"
                      value={formData.date || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="type"
                      placeholder="Type"
                      value={formData.type || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="attendees"
                      placeholder="Attendees"
                      value={formData.attendees || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </>
                )}
                {activeTab === "projects" && (
                  <>
                    <Input
                      name="title"
                      placeholder="Project Title"
                      value={formData.title || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="status"
                      placeholder="Status"
                      value={formData.status || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="team"
                      placeholder="Team"
                      value={formData.team || ""}
                      onChange={handleFormChange}
                      required
                    />
                    <Input
                      name="domain"
                      placeholder="Domain"
                      value={formData.domain || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white"
                >
                  Add
                </Button>
              </form>
            </div>
          </div>
        )}

        <Tabs
          defaultValue="students"
          className="space-y-6"
          onValueChange={(val) => setActiveTab(val as any)}
        >
          <TabsList className="bg-black/50 border border-white/10 w-full p-6 h-auto">
            <div className="flex flex-col sm:flex-row sm:justify-start gap-4 w-full">
              <TabsTrigger
                value="students"
                className="gap-2 w-full sm:w-[25%] p-2 text-center bg-orange-950/50"
              >
                <Users className="w-4 h-4" />
                Students
              </TabsTrigger>
              <TabsTrigger
                value="halls"
                className="gap-2 w-full sm:w-[25%] p-2 text-center bg-orange-950/50"
              >
                <Building2 className="w-4 h-4" />
                Halls
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="gap-2 w-full sm:w-[25%] p-2 text-center bg-orange-950/50"
              >
                <CalendarDays className="w-4 h-4" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="gap-2 w-full sm:w-[25%] p-2 text-center bg-orange-950/50"
              >
                <Presentation className="w-4 h-4" />
                Projects
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="students">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                      <span className="font-semibold">Availability:</span>{" "}
                      {item.availability}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-semibold">Location:</span>{" "}
                      {item.location}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      View Profile
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="halls">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHalls.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {item.name}
                    </h3>
                    <p className="text-orange-400 mb-4">{item.capacity}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.facilities.map((facility, i) => (
                        <span
                          key={i}
                          className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                      <span className="font-semibold">Location:</span>{" "}
                      {item.location}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      Book Venue
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-orange-400 mb-4">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="font-semibold">Type:</span> {item.type}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-semibold">Expected Attendees:</span>{" "}
                      {item.attendees}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {item.title}
                    </h3>
                    <span className="inline-block bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full text-sm mb-4">
                      {item.status}
                    </span>
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="font-semibold">Team Size:</span>{" "}
                      {item.team}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-semibold">Domain:</span>{" "}
                      {item.domain}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      View Project
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
