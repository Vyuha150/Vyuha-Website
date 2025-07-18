"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddCompanyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
    jobOpenings: "",
    logo: null as File | null, // Store the uploaded logo as a File object
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !formData.name ||
      !formData.industry ||
      !formData.location ||
      !formData.description
    ) {
      setError("All fields are required, including the company logo.");
      return;
    }

    // Check if the logo is uploaded
    if (!formData.logo) {
      setError("Company logo is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Backend API URL

      // Prepare form data for submission
      const data = new FormData();
      data.append("name", formData.name);
      data.append("industry", formData.industry);
      data.append("location", formData.location);
      data.append("description", formData.description);

      // Convert jobOpenings to an array and append each item individually
      const jobOpeningsArray = formData.jobOpenings
        .split(",")
        .map((job) => job.trim());
      jobOpeningsArray.forEach((job) => data.append("jobOpenings[]", job));

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const token = Cookies.get("authToken");

      // Send POST request to the backend
      const response = await axios.post(`${apiUrl}/api/companies`, data, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Company added successfully!");
        router.push("/career"); // Redirect to the companies page
      } else {
        toast.error("Failed to add company. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding company:", error);

      // Display backend validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors
          .map((err: { msg: string }) => err.msg)
          .join(", ");
        setError(`Error: ${backendErrors}`);
      } else {
        setError("An error occurred while adding the company.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      <section className="max-w-2xl mx-auto bg-black/70 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
          Add a New Company
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-md font-medium">
              Company Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="rounded-lg"
              required
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-md font-medium">
              Industry
            </label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              placeholder="Enter industry"
              className="rounded-lg"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-md font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter company location"
              className="rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-md font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter company description"
              rows={4}
              className="rounded-lg"
              required
            />
          </div>

          {/* Job Openings */}
          <div>
            <label htmlFor="jobOpenings" className="block text-md font-medium">
              Job Openings (comma-separated)
            </label>
            <Input
              id="jobOpenings"
              name="jobOpenings"
              value={formData.jobOpenings}
              onChange={handleInputChange}
              placeholder="Enter job openings, separated by commas"
              className="rounded-lg"
            />
          </div>

          {/* Logo */}
          <div>
            <label htmlFor="logo" className="block text-md font-medium">
              Upload Company Logo
            </label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-orange-500 text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Company"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
