"use client";

import React, { useState } from "react";

export default function EnhanceClubPage() {
  const [formData, setFormData] = useState({
    clubId: "",
    clubName: "",
    university: "",
    president: "",
    email: "",
    phone: "",
    establishedYear: "",
    membersCount: "",
    goals: "",
    achievements: "",
    supportNeeded: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can integrate your API here
    alert(`Your request has been submitted! Club ID: ${formData.clubId}`);
    setFormData({
      clubId: "",
      clubName: "",
      university: "",
      president: "",
      email: "",
      phone: "",
      establishedYear: "",
      membersCount: "",
      goals: "",
      achievements: "",
      supportNeeded: "",
    });
  };

  return (
    <main className="text-white min-h-screen py-12 px-6">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">
          Enhance Your Existing Club
        </h1>
        <p className="text-gray-300 leading-relaxed mb-6">
          Take your club to the next level with Vyuha's support. Fill out the
          form below to let us know about your club and how we can help you
          achieve your goals.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-black/60 border border-orange-500 p-6 rounded-lg shadow-lg hover:shadow-orange-500 transition-shadow duration-300"
        >
          <div className="mb-4">
            <label htmlFor="clubId" className="block text-gray-400 mb-2">
              Club ID
            </label>
            <input
              type="text"
              id="clubId"
              name="clubId"
              value={formData.clubId}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter a unique Club ID"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="clubName" className="block text-gray-400 mb-2">
              Club Name
            </label>
            <input
              type="text"
              id="clubName"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter your club's name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="university" className="block text-gray-400 mb-2">
              University / College
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter your university or college name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="president" className="block text-gray-400 mb-2">
              Club President / Main Contact
            </label>
            <input
              type="text"
              id="president"
              name="president"
              value={formData.president}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter the president or main contact's name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter contact email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-400 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Enter contact phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="establishedYear"
              className="block text-gray-400 mb-2"
            >
              Year Established
            </label>
            <input
              type="number"
              id="establishedYear"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="e.g. 2018"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="membersCount" className="block text-gray-400 mb-2">
              Number of Members
            </label>
            <input
              type="number"
              id="membersCount"
              name="membersCount"
              value={formData.membersCount}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="e.g. 50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goals" className="block text-gray-400 mb-2">
              Club Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Describe your club's goals"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="achievements" className="block text-gray-400 mb-2">
              Achievements
            </label>
            <textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="List your club's achievements"
              rows={3}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="supportNeeded" className="block text-gray-400 mb-2">
              Support Needed
            </label>
            <textarea
              id="supportNeeded"
              name="supportNeeded"
              value={formData.supportNeeded}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
              placeholder="Describe the type of support you need"
              rows={3}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Submit Request
          </button>
        </form>
      </section>
    </main>
  );
}
