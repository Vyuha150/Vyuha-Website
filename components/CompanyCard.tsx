"use client";

import React from "react";

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    logo: string;
    industry: string;
    location: string;
    description: string;
    jobOpenings: string[];
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-black border border-gray-700 rounded-lg overflow-hidden hover:shadow-orange-500 hover:shadow-md hover:border-none transition-shadow duration-300">
      <div className="p-6">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${company.logo}`}
          alt={company.name}
          className="w-16 h-16 object-cover rounded-full mb-4"
        />
        <h3 className="text-xl font-bold mb-2">{company.name}</h3>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Industry:</strong> {company.industry}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Location:</strong> {company.location}
        </p>
        <p className="text-sm text-gray-400 mb-4">{company.description}</p>
        <h4 className="text-lg font-bold text-orange-500 mb-2">Job Openings</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {company.jobOpenings.map((job, index) => (
            <li key={index}>{job}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
