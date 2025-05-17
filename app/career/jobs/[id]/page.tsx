"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function JobDetailsPage() {
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null as File | null,
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const jobId = params.id;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.get(
          `${apiUrl}/api/job-application/${jobId}`
        );
        setJob(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again later.");
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [params]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name || !formData.email || !formData.resume) {
      setFormError("All fields are required, including the resume.");
      return;
    }

    // Ensure params.id is defined
    if (!params.id) {
      setFormError("Job ID is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Prepare form data for submission
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("coverLetter", formData.coverLetter);
      data.append("resume", formData.resume as File);
      data.append("jobId", params.id as string);

      // Send POST request to the backend
      const response = await axios.post(
        `${apiUrl}/api/companies/apply-job`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setFormData({
          name: "",
          email: "",
          resume: null,
          coverLetter: "",
        });
        setIsModalOpen(false); // Close the modal after successful submission
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setFormError("An error occurred while submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading job details...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">{error}</h1>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 mt-4 text-white">
      {/* Job Details */}
      <div className="p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">{job.title}</h1>
        <p className="text-gray-300 text-lg mb-4">
          <strong>Company:</strong> {job.company}
        </p>
        <p className="text-gray-300 text-lg mb-4">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-gray-300 text-lg mb-4">
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p className="text-gray-300 leading-relaxed mb-8">{job.description}</p>

        {/* Job Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Job Description
          </h2>
          <p className="text-gray-300 leading-relaxed">{job.description}</p>
        </section>

        {/* Responsibilities */}
        {job.responsibilities && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {job.responsibilities.map(
                (responsibility: string, index: number) => (
                  <li key={index}>{responsibility}</li>
                )
              )}
            </ul>
          </section>
        )}

        {/* Qualifications */}
        {job.qualifications && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Qualifications
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {job.qualifications.map(
                (qualification: string, index: number) => (
                  <li key={index}>{qualification}</li>
                )
              )}
            </ul>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
            onClick={() => setIsModalOpen(true)} // Open the modal
          >
            Apply Now
          </button>
          <button className="bg-transparent border border-white hover:border-orange-500 hover:bg-orange-500 text-white py-2 px-4 rounded-lg">
            Save Job
          </button>
        </div>
      </div>

      {/* Job Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black text-white border border-orange-500 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Apply for {job.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-black w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-black w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium mb-2"
                >
                  Upload Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="bg-black w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="coverLetter"
                  className="block text-sm font-medium mb-2"
                >
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="bg-black w-full border border-gray-300 rounded-lg p-2"
                  rows={4}
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} // Close the modal
                  className="text-gray-300 border border-gray-300 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
