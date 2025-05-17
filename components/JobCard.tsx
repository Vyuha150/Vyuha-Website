"use client";

import React from "react";

interface JobCardProps {
  job: {
    _id: any;
    title: string;
    company: string;
    location: string;
    jobType: string;
    description: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-black border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition-all duration-300 hover:shadow-orange-500">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Company:</strong> {job.company}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Type:</strong> {job.jobType}
        </p>
        <p className="text-sm text-gray-400 mb-4">{job.description}</p>
        <a
          href={`/career/jobs/${job._id}`}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg inline-block"
        >
          View Details
        </a>
      </div>
    </div>
  );
}
