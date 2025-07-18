"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

export default function CreateMentorPage() {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    industry: "",
    experience: "",
    mentorshipStyle: "",
    availability: "",
  });

  const [photo, setPhoto] = useState<File | null>(null); // State for the photo file
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append(
        "skills",
        JSON.stringify(formData.skills.split(/[,\n]/).map((skill) => skill.trim()).filter(Boolean))
      );
      formDataToSend.append("industry", formData.industry);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("mentorshipStyle", formData.mentorshipStyle);
      formDataToSend.append("availability", formData.availability);

      if (photo) {
        formDataToSend.append("photo", photo); // Append the photo file
      }

      const token = Cookies.get("authToken");

      const response = await axios.post(
        `${apiUrl}/api/mentors/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Mentor created successfully!");
        setFormData({
          name: "",
          skills: "",
          industry: "",
          experience: "",
          mentorshipStyle: "",
          availability: "",
        });
        setPhoto(null); // Reset the photo file
      } else {
        toast.error("Failed to create mentor. Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        console.error("Validation Errors:", error.response.data.errors);
        toast.error(
          "Validation Errors: " + JSON.stringify(error.response.data.errors)
        );
      } else {
        console.error("Error creating mentor:", error);
        toast.error("An error occurred while creating the mentor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      <section className="max-w-3xl mx-auto bg-black/50 p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">
          Create Mentor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Photo File */}
          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Skills (one per line or comma-separated)
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter your skills (one per line or comma-separated)"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Mentorship Style */}
          <div>
            <label
              htmlFor="mentorshipStyle"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Mentorship Style
            </label>
            <input
              type="text"
              id="mentorshipStyle"
              name="mentorshipStyle"
              value={formData.mentorshipStyle}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Availability
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Create Mentor"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
