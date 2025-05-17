"use client";

import React, { useState } from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center bg-black border border-gray-700 rounded-lg overflow-hidden mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 bg-black text-white outline-none"
      />
      <button
        onClick={handleSearch}
        className="px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg mr-4"
      >
        Search
      </button>
    </div>
  );
}
