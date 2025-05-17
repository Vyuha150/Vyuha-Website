"use client";

import React, { useState } from "react";

interface JobFiltersProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export default function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    industry: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-black/50 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 md:space-x-6 w-full">
      {/* Location Filter */}
      <input
        type="text"
        placeholder="Location"
        value={filters.location}
        onChange={(e) => handleFilterChange("location", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      />

      {/* Job Type Filter */}
      <select
        onChange={(e) => handleFilterChange("jobType", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Job Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
      </select>

      {/* Industry Filter */}
      <select
        onChange={(e) => handleFilterChange("industry", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Industry</option>
        <option value="Tech">Tech</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
      </select>
    </div>
  );
}
