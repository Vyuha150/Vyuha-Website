"use client";

import React, { useState } from "react";

interface FiltersProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export default function ProjectFilters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState({
    difficulty: "",
    teamSize: "",
    search: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-black/50 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 md:space-x-6 w-full">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg w-full md:w-auto flex-1"
      />

      {/* Difficulty Filter */}
      <select
        onChange={(e) => handleFilterChange("difficulty", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Team Size Filter */}
      <select
        onChange={(e) => handleFilterChange("teamSize", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg flex-1"
      >
        <option value="">Team Size</option>
        <option value="Solo">Solo</option>
        <option value="Small Team">Small Team</option>
        <option value="Large Team">Large Team</option>
      </select>
    </div>
  );
}
