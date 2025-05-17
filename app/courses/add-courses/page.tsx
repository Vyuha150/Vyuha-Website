"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    instructorPhoto: "",
    coursePhoto: null as File | null,
    description: "",
    details: "",
    prerequisites: "",
    learningObjectives: "",
    assessments: "",
    price: "",
    format: "",
    level: "",
    duration: "",
    rating: "",
    reviews: "",
    enrollLink: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("instructor", formData.instructor);
      payload.append("instructorPhoto", formData.instructorPhoto);
      if (formData.coursePhoto) {
        payload.append("coursePhoto", formData.coursePhoto);
      }
      payload.append("description", formData.description);
      payload.append("details", formData.details);
      payload.append("prerequisites", formData.prerequisites);
      payload.append("learningObjectives", formData.learningObjectives);
      payload.append("assessments", formData.assessments);
      payload.append("price", formData.price);
      payload.append("format", formData.format);
      payload.append("level", formData.level);
      payload.append("duration", formData.duration);
      payload.append("rating", formData.rating);
      payload.append("reviews", formData.reviews);
      payload.append("enrollLink", formData.enrollLink);

      // API integration
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.post(`${apiUrl}/api/courses`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        setMessage("Course added successfully!");
        setFormData({
          title: "",
          instructor: "",
          instructorPhoto: "",
          coursePhoto: null,
          description: "",
          details: "",
          prerequisites: "",
          learningObjectives: "",
          assessments: "",
          price: "",
          format: "",
          level: "",
          duration: "",
          rating: "",
          reviews: "",
          enrollLink: "",
        });
      } else {
        setError("Failed to add course.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding course.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-black/50 p-8 rounded-lg shadow-lg border border-orange-500">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          Add New Course
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Instructor</label>
            <input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Instructor Photo URL</label>
            <input
              name="instructorPhoto"
              value={formData.instructorPhoto}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Course Photo</label>
            <input
              name="coursePhoto"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Prerequisites (comma separated)
            </label>
            <input
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Learning Objectives (comma separated)
            </label>
            <input
              name="learningObjectives"
              value={formData.learningObjectives}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Assessments</label>
            <input
              name="assessments"
              value={formData.assessments}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Format</label>
            <input
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Level</label>
            <input
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Duration</label>
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Rating</label>
            <input
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Reviews</label>
            <input
              name="reviews"
              value={formData.reviews}
              onChange={handleChange}
              type="number"
              min="0"
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Enroll Link (external URL)
            </label>
            <input
              name="enrollLink"
              value={formData.enrollLink}
              onChange={handleChange}
              className="w-full p-2 bg-black rounded-lg border border-gray-700 text-white"
              required
              type="url"
            />
          </div>
          {message && <div className="text-green-500">{message}</div>}
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg mt-2"
            disabled={
              !formData.title ||
              !formData.instructor ||
              !formData.instructorPhoto ||
              !formData.coursePhoto ||
              !formData.description ||
              !formData.details ||
              !formData.prerequisites ||
              !formData.learningObjectives ||
              !formData.assessments ||
              !formData.price ||
              !formData.format ||
              !formData.level ||
              !formData.duration ||
              !formData.rating ||
              !formData.reviews ||
              !formData.enrollLink
            }
          >
            Add Course
          </button>
        </form>
      </div>
    </main>
  );
}
