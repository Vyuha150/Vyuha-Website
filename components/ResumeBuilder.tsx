"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";

export default function ResumeBuilder() {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    objective: "",
    skills: "",
    experience: "",
    education: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Resume", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${resume.name}`, 10, 40);
    doc.text(`Email: ${resume.email}`, 10, 50);
    doc.text(`Phone: ${resume.phone}`, 10, 60);
    doc.text("Objective:", 10, 70);
    doc.text(resume.objective, 10, 80, { maxWidth: 190 });
    doc.text("Skills:", 10, 100);
    doc.text(resume.skills, 10, 110, { maxWidth: 190 });
    doc.text("Experience:", 10, 130);
    doc.text(resume.experience, 10, 140, { maxWidth: 190 });
    doc.text("Education:", 10, 160);
    doc.text(resume.education, 10, 170, { maxWidth: 190 });

    // Save the PDF
    doc.save("resume.pdf");
  };

  return (
    <div className="max-w-2xl bg-transparent border border-orange-500 p-8 rounded-lg shadow-lg shadow-orange-500">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">
        Resume Builder
      </h2>
      <form className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={resume.name}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={resume.email}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={resume.phone}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <textarea
          name="objective"
          placeholder="Objective"
          value={resume.objective}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <textarea
          name="skills"
          placeholder="Skills"
          value={resume.skills}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <textarea
          name="experience"
          placeholder="Experience"
          value={resume.experience}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
        <textarea
          name="education"
          placeholder="Education"
          value={resume.education}
          onChange={handleChange}
          className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
        />
      </form>
      <button
        onClick={handleDownload}
        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg mt-4"
      >
        Download Resume as PDF
      </button>
    </div>
  );
}
