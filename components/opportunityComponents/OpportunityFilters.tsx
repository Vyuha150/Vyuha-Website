"use client";

import React from "react";

export default function Filters({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <select
        onChange={(e) => handleFilterChange("type", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg"
      >
        <option value="">Opportunity Type</option>
        <option value="Core Team">Core Team</option>
        <option value="New Team">New Team</option>
        <option value="Club Enhancement">Club Enhancement</option>
      </select>
      <select
        onChange={(e) => handleFilterChange("location", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg"
      >
        <option value="">Location</option>
        <option value="Remote">Remote</option>
        <option value="On-Site">On-Site</option>
      </select>
      <select
        onChange={(e) => handleFilterChange("department", e.target.value)}
        className="p-3 bg-black border border-gray-700 text-white rounded-lg"
      >
        <option value="">Department</option>
        <option value="Tech">Tech</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
      </select>
    </div>
  );
}
