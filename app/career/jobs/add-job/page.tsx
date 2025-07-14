"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    image: null as File | null, // Store the uploaded image as a File object
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Backend API URL

      // Prepare form data for submission
      const data = new FormData();
      data.append("title", formData.title);
      data.append("company", formData.company);
      data.append("location", formData.location);
      data.append("jobType", formData.jobType);
      data.append("description", formData.description);
      data.append(
        "responsibilities",
        formData.responsibilities.split("\n").join(",")
      );
      data.append(
        "qualifications",
        formData.qualifications.split("\n").join(",")
      );
      if (formData.image) data.append("image", formData.image);

      // Send POST request to the backend  
      const response = await axios.post(`${apiUrl}/api/jobs`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Job added successfully!");
        router.push("/career"); // Redirect to the jobs page
      } else {
        alert("Failed to add job. Please try again.");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      alert("An error occurred while adding the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      <section className="max-w-2xl mx-auto bg-black/70 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
          Add a New Job
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-md font-medium">
              Job Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className="rounded-lg"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-md font-medium">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="rounded-lg"
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
              placeholder="Enter job location"
              className="rounded-lg"
            />
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="jobType" className="block text-md font-medium">
              Job Type
            </label>
            <Input
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              placeholder="e.g., Full-time, Part-time"
              className="rounded-lg"
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
              placeholder="Enter job description"
              rows={4}
              className="rounded-lg"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label
              htmlFor="responsibilities"
              className="block text-md font-medium"
            >
              Responsibilities (one per line)
            </label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              placeholder="Enter responsibilities, one per line"
              rows={4}
              className="rounded-lg"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label
              htmlFor="qualifications"
              className="block text-md font-medium"
            >
              Qualifications (one per line)
            </label>
            <Textarea
              id="qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="Enter qualifications, one per line"
              rows={4}
              className="rounded-lg"
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-md font-medium">
              Upload Image
            </label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-orange-500 text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Job"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
