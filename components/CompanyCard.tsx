"use client";

import React from "react";

interface CompanyCardProps {
  company: {
    _id: string;
    name: string;
    logo: string;
    industry: string;
    location: string;
    description: string;
    jobOpenings: string[];
    website?: string;
    contact?: string;
    status?: string;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-black border border-gray-700 rounded-lg overflow-hidden hover:shadow-orange-500 hover:shadow-md hover:border-none transition-shadow duration-300">
      <div className="p-6">
        <img
          src={company.logo}
          alt={company.name}
          className="w-16 h-16 object-cover rounded-full mb-4"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEM0MC44MzY2IDIwIDQ4IDI3LjE2MzQgNDggMzZTNDAuODM2NiA1MiAzMiA1MlMyMCA0NC44MzY2IDIwIDM2UzI3LjE2MzQgMjAgMzIgMjBaTTMyIDI0QzI5LjM0NzggMjQgMjcuMDQzNSAyNS4wNTY0IDI1LjQ3ODMgMjYuNzY1NkwyNS40NzgzIDI2Ljc2NTZDMJY1IDI2LjYwODcgMjcgMjguODgzMyAyNyAzNS41QzI3IDQyLjY3OTIgMjYuNSA0NS4yOTU3IDI2LjU3MDMgNDVDMjcuMDQzNSA0NC45NDM2IDI5LjM0NzggNDQgMzIgNDRTMzYuOTU2NSA0NC45NDM2IDM3LjQyOTcgNDVDMzcuNSA0NS4yOTU3IDM3IDQyLjY3OTIgMzcgMzUuNUMzNyAyOC44ODMzIDM3LjUgMjYuNjA4NyAzNy41MjE3IDI2Ljc2NTZDMzYuOTU2NSAyNS4wNTY0IDM0LjY1MjIgMjQgMzIgMjRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
          }}
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
