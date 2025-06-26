"use client";

import { on } from "events";
import React from "react";
import { Mentor } from "@/app/mentorship/type";

interface MentorCardProps {
  mentor: Mentor;
  onBook?: () => void;
}

export default function MentorCard({ mentor, onBook }: MentorCardProps) {
  return (
    <div className="bg-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:shadow-orange-500 hover:scale-105 transform transition-all duration-300">
      {/* Mentor Photo */}
      <img
        src={mentor.photo}
        alt={mentor.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-orange-500">
          {mentor.name}
        </h2>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Industry:</strong> {mentor.industry}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Skills:</strong> {mentor.skills.join(", ")}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Experience:</strong> {mentor.experience}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Mentorship Style:</strong> {mentor.mentorshipStyle}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Availability:</strong> {mentor.availability}
        </p>
        <div className="flex gap-4 mt-4 justify-between">
          <a
            href={`/mentorship/${mentor._id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg inline-block"
          >
            View Profile
          </a>
          {onBook && (
            <button
              onClick={onBook}
              className="bg-white hover:bg-orange-500 text-orange-500 hover:text-white border border-orange-500 py-2 px-4 rounded-lg inline-block"
            >
              Book Mentor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
