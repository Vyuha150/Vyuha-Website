"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateProjectPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null, // Store the uploaded image as a File object
    skills: "",
    deadline: "",
    description: "",
    difficulty: "",
    teamSize: "",
    goals: "",
    deliverables: "",
    evaluationCriteria: "",
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Prepare form data for submission
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.image) data.append("image", formData.image); // Append the image file
      data.append("skills", formData.skills);
      data.append("deadline", formData.deadline);
      data.append("description", formData.description);
      data.append("difficulty", formData.difficulty);
      data.append("teamSize", formData.teamSize);
      data.append("goals", formData.goals);
      data.append("deliverables", formData.deliverables);
      data.append("evaluationCriteria", formData.evaluationCriteria);

      // Send POST request to the backend
      const response = await axios.post(`${apiUrl}/api/projects`, data);

      if (response.status === 201) {
        alert("Project created successfully!");
        router.push("/projects");
      } else {
        alert("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-black/70 p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
            Create a New Project
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-md font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Project title"
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

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-md font-medium">
                Skills (comma-separated)
              </label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., HTML, CSS, JavaScript"
                className="rounded-lg"
              />
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-md font-medium">
                Deadline
              </label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                className="rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-md font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project description"
                rows={4}
                className="rounded-lg"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-md font-medium">
                Difficulty
              </label>
              <Input
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                placeholder="e.g., Easy, Medium, Hard"
                className="rounded-lg"
              />
            </div>

            {/* Team Size */}
            <div>
              <label htmlFor="teamSize" className="block text-md font-medium">
                Team Size
              </label>
              <Input
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                placeholder="e.g., Solo, Small Team, Large Team"
                className="rounded-lg"
              />
            </div>

            {/* Goals */}
            <div>
              <label htmlFor="goals" className="block text-md font-medium">
                Goals (one per line)
              </label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="Enter each goal on a new line"
                rows={4}
                className="rounded-lg"
              />
            </div>

            {/* Deliverables */}
            <div>
              <label
                htmlFor="deliverables"
                className="block text-md font-medium"
              >
                Deliverables (one per line)
              </label>
              <Textarea
                id="deliverables"
                name="deliverables"
                value={formData.deliverables}
                onChange={handleInputChange}
                placeholder="Enter each deliverable on a new line"
                rows={4}
                className="rounded-lg"
              />
            </div>

            {/* Evaluation Criteria */}
            <div>
              <label
                htmlFor="evaluationCriteria"
                className="block text-md font-medium"
              >
                Evaluation Criteria (one per line)
              </label>
              <Textarea
                id="evaluationCriteria"
                name="evaluationCriteria"
                value={formData.evaluationCriteria}
                onChange={handleInputChange}
                placeholder="Enter each criterion on a new line"
                rows={4}
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
                {isSubmitting ? "Submitting..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
