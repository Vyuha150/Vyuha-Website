"use client";

import React, { useState } from "react";

interface MentorFiltersProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export default function MentorFilters({ onFilterChange }: MentorFiltersProps) {
  const [filters, setFilters] = useState({
    skills: "",
    industry: "",
    availability: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-black/50 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 md:space-x-6 w-full">
      {/* Skills Filter */}
      <select
        onChange={(e) => handleFilterChange("skills", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Skills</option>
        <option value="Programming">Programming</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
      </select>

      {/* Industry Filter */}
      <select
        onChange={(e) => handleFilterChange("industry", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Industry</option>
        <option value="Tech">Tech</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
      </select>

      {/* Availability Filter */}
      <select
        onChange={(e) => handleFilterChange("availability", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Availability</option>
        <option value="Available this week">Available this week</option>
        <option value="Anytime">Anytime</option>
        <option value="Weekends">Weekends</option>
      </select>
    </div>
  );
}
