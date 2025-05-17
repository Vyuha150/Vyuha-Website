"use client";

import React from "react";

export default function ForumIntro() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-orange-500 mb-4">
        Welcome to the Community Forum
      </h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        Our forum is a space for peer learning, support, and idea sharing. Join
        discussions, ask questions, and connect with like-minded individuals.
      </p>
      <h2 className="text-2xl font-bold text-orange-500 mb-4">
        Community Guidelines
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>Be respectful and courteous to others.</li>
        <li>Stay on topic and contribute meaningfully.</li>
        <li>Avoid spamming or posting inappropriate content.</li>
      </ul>
    </section>
  );
}
