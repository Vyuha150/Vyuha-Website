"use client";

import React, { useState } from "react";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Send form data to the backend
      const response = await axios.post(`${apiUrl}/api/contact`, formData);

      if (response.status === 200) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setErrorMessage("Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl shadow-lg mt-10 md:mt-20 rounded-lg bg-black/50 hover:shadow-orange-500 mx-auto px-6 py-12 text-white">
      <h1 className="text-4xl font-bold text-orange-500 mb-6">Contact Us</h1>
      <p className="text-gray-300 mb-8">
        Have questions or need assistance? Fill out the form below, and we'll
        get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-black w-full border border-gray-300 rounded-lg p-2"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-black w-full border border-gray-300 rounded-lg p-2"
            placeholder="Your email"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="bg-black w-full border border-gray-300 rounded-lg p-2"
            placeholder="Subject"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="bg-black w-full border border-gray-300 rounded-lg p-2"
            placeholder="Your message"
            rows={5}
            required
          />
        </div>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </main>
  );
};

export default ContactPage;
