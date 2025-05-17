"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import MentorCard from "@/components/MentorCard";
import MentorFilters from "@/components/MentorFilters";
import Cookies from "js-cookie";
import { Mentor } from "./type";

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const token = Cookies.get("authToken");

  // Fetch all mentors from the backend
  useEffect(() => {
    async function fetchMentors() {
      try {
        const response = await axios.get(`${apiUrl}/api/mentors`);
        setMentors(response.data);
        setFilteredMentors(response.data); // Initialize filtered mentors
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    }
    fetchMentors();
  }, [apiUrl]);

  // Handle filter changes
  const handleFilterChange = async (filters: { [key: string]: string }) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`${apiUrl}/api/mentors/filter?${query}`);
      setFilteredMentors(response.data);
    } catch (error) {
      console.error("Error filtering mentors:", error);
    }
  };

  // Open booking modal
  const openBookingModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  // Close booking modal
  const closeBookingModal = () => {
    setSelectedMentor(null);
    setIsBookingModalOpen(false);
  };

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      const response = await axios.post(
        `${apiUrl}/api/mentors/${selectedMentor?._id}/book`,
        {
          email,
          phone,
          date,
          time,
          message,
        }
      );

      if (response.status === 201) {
        alert(`Session booked with ${selectedMentor?.name}!`);
        closeBookingModal();
      } else {
        alert("Failed to book session. Please try again.");
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        console.error("Error booking session:", error);
        alert("An error occurred while booking the session.");
      }
    }
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      {/* Mentorship Introduction */}
      <section className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          Welcome to the Mentorship Program
        </h1>
        <p className="text-gray-300 leading-relaxed">
          Our mentorship program connects learners with experienced mentors to
          help them achieve their goals. Whether you're looking to improve your
          skills, gain industry insights, or receive career guidance, our
          mentors are here to help.
        </p>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <MentorFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Mentor Listings */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <MentorCard
            key={mentor._id}
            mentor={mentor}
            onBook={() => openBookingModal(mentor)}
          />
        ))}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-md border border-orange-500">
            <h2 className="text-xl font-bold mb-4">
              Book a Session with {selectedMentor.name}
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Date Field */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>

              {/* Time Field */}
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Add a message for the mentor..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
