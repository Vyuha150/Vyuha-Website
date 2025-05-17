"use client";

import React, { useState } from "react";
import axios from "axios";

export default function AddCoreTeamRolePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: formData.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.post(`${apiUrl}/api/core-team-role`, payload);

      if (res.status === 201) {
        setMessage("Role added successfully!");
        setFormData({
          title: "",
          description: "",
          responsibilities: "",
          requirements: "",
        });
      } else {
        setError("Failed to add role.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error adding role.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-black/50 p-8 rounded-lg shadow-lg border border-orange-500">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          Add Core Team Role
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-black border border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-black border border-gray-700 text-white"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-black border border-gray-700 text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Requirements (one per line)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-black border border-gray-700 text-white"
              rows={3}
              required
            />
          </div>
          {message && <div className="text-green-500">{message}</div>}
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg mt-2"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.responsibilities ||
              !formData.requirements
            }
          >
            Add Role
          </button>
        </form>
      </div>
    </main>
  );
}
