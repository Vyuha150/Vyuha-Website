"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // For navigation after submission
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie"; // For handling cookies

interface FormData {
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  mode: string;
  targetAudience: string;
  description: string;
  fees: string;
  materials: string;
  platformLink: string;
  organizer: string;
  organizerBio: string;
  organizerPhoto: File | null;
  image: File | null;
  logo: File | null;
}

export default function CreateEventPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    date: "",
    time: "",
    location: "",
    category: "",
    mode: "",
    targetAudience: "",
    description: "",
    fees: "",
    materials: "",
    platformLink: "",
    organizer: "",
    organizerBio: "",
    logo: null,
    image: null,
    organizerPhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authToken = Cookies.get("authToken"); // Retrieve token from Cookies
      // Prepare form data for submission
      const eventData = new FormData();
      eventData.append("name", formData.name);
      eventData.append("date", formData.date);
      eventData.append("time", formData.time);
      eventData.append("location", formData.location);
      eventData.append("category", formData.category);
      eventData.append("mode", formData.mode);
      eventData.append("targetAudience", formData.targetAudience);
      eventData.append("description", formData.description);
      eventData.append("fees", formData.fees);
      eventData.append("materials", formData.materials);
      eventData.append("platformLink", formData.platformLink);
      eventData.append("organizer", formData.organizer);
      eventData.append("organizerBio", formData.organizerBio);
      if (formData.organizerPhoto) {
        eventData.append("organizerPhoto", formData.organizerPhoto);
      }
      if (formData.image) {
        eventData.append("image", formData.image);
      }
      if (formData.logo) {
        eventData.append("logo", formData.logo);
      }

      // Send the data to the backend
      const response = await axios.post(`${apiUrl}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        // Navigate to the events page after successful creation
        router.push("/events");
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black p-8 rounded-lg shadow-xl hover:shadow-orange-500/50 transition-all duration-300"
          >
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
              Post an Event
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div>
                <label htmlFor="name" className="block text-md font-medium">
                  Event Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Event Date */}
              <div>
                <label htmlFor="date" className="block text-md font-medium">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Event Time */}
              <div>
                <label htmlFor="time" className="block text-md font-medium">
                  Event Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Event Location */}
              <div>
                <label htmlFor="location" className="block text-md font-medium">
                  Event Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Event Category */}
              <div>
                <label htmlFor="category" className="block text-md font-medium">
                  Event Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Competition">Competition</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>

              {/* Event Mode */}
              <div>
                <label htmlFor="mode" className="block text-md font-medium">
                  Event Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="" disabled>
                    Select a mode
                  </option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label
                  htmlFor="targetAudience"
                  className="block text-md font-medium"
                >
                  Target Audience
                </label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="" disabled>
                    Select target audience
                  </option>
                  <option value="Students">Students</option>
                  <option value="Professionals">Professionals</option>
                  <option value="Everyone">Everyone</option>
                </select>
              </div>

              {/* Event Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-md font-medium"
                >
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows={4}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                ></textarea>
              </div>

              {/* Event Fees */}
              <div>
                <label htmlFor="fees" className="block text-md font-medium">
                  Event Fees
                </label>
                <input
                  type="text"
                  id="fees"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  placeholder="Enter event fees (e.g., Free, $50)"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Required Materials */}
              <div>
                <label
                  htmlFor="materials"
                  className="block text-md font-medium"
                >
                  Required Materials
                </label>
                <input
                  type="text"
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="Enter required materials (e.g., Laptop)"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Platform Link */}
              <div>
                <label
                  htmlFor="platformLink"
                  className="block text-md font-medium"
                >
                  Platform Link
                </label>
                <input
                  type="text"
                  id="platformLink"
                  name="platformLink"
                  value={formData.platformLink}
                  onChange={handleInputChange}
                  placeholder="Enter platform link (e.g., Zoom, Google Meet)"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Organizer Name */}
              <div>
                <label
                  htmlFor="organizer"
                  className="block text-md font-medium"
                >
                  Organizer Name
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Organizer Photo */}
              <div>
                <label
                  htmlFor="organizerPhoto"
                  className="block text-md font-medium"
                >
                  Organizer Photo
                </label>
                <input
                  type="file"
                  id="organizerPhoto"
                  name="organizerPhoto"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFormData({
                        ...formData,
                        organizerPhoto: e.target.files[0],
                      });
                    }
                  }}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Event Image */}
              <div>
                <label htmlFor="image" className="block text-md font-medium">
                  Event Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFormData({ ...formData, image: e.target.files[0] });
                    }
                  }}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Organizer Bio */}
              <div>
                <label
                  htmlFor="organizerBio"
                  className="block text-md font-medium"
                >
                  Organizer Bio
                </label>
                <textarea
                  id="organizerBio"
                  name="organizerBio"
                  value={formData.organizerBio}
                  onChange={handleInputChange}
                  placeholder="Enter organizer bio"
                  rows={3}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                ></textarea>
              </div>

              {/* Event Logo */}
              <div>
                <label htmlFor="logo" className="block text-md font-medium">
                  Event Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleFileChange}
                  className="w-full mt-2 p-[6px] bg-black border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${
                  loading ? "bg-gray-500" : "bg-orange-500 hover:bg-orange-600"
                } text-white font-semibold rounded-lg shadow-md transition-transform`}
              >
                {loading ? "Posting..." : "Post Event"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
