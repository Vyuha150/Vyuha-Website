"use client";

import React, { useState } from "react";
import axios from "axios";

export default function FormTeamPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    mission: "",
    members: "",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const membersArray = formData.members
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member !== "");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.post(`${apiUrl}/api/team-applications`, {
        ...formData,
        members: membersArray,
      });
      if (res.status === 201) {
        alert("Your team has been successfully created!");
        setFormData({
          teamName: "",
          mission: "",
          members: "",
          phoneNumber: "",
        });
      }
    } catch (err) {
      alert("Failed to create team.");
    }
  };

  return (
    <main className="mt-4 text-white min-h-screen py-12 px-6">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">
          Form Your Team
        </h1>
        <p className="text-gray-300 leading-relaxed mb-6">
          Ready to create your own team? Fill out the form below to get started
          and unlock resources, brand recognition, and networking opportunities.
        </p>

        {/* Team Creation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-black/60 border border-orange-500 hover:shadow-orange-500 p-6 rounded-lg shadow-lg"
        >
          {/* Team Name Field */}
          <div className="mb-4">
            <label htmlFor="teamName" className="block text-gray-400 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter your team's name"
              required
            />
          </div>

          {/* Team Mission Field */}
          <div className="mb-4">
            <label htmlFor="mission" className="block text-gray-400 mb-2">
              Team Mission
            </label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Describe your team's mission"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Team Members Field */}
          <div className="mb-4">
            <label htmlFor="members" className="block text-gray-400 mb-2">
              Team Members
            </label>
            <textarea
              id="members"
              name="members"
              value={formData.members}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter team members' names, separated by commas"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-400 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Create Team
          </button>
        </form>
      </section>
    </main>
  );
}
