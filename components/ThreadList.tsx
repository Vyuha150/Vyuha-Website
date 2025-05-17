"use client";

import React, { useState } from "react";
import Link from "next/link";
import { threads } from "@/data/threadsData"; // Import threads from the data file

export default function ThreadList() {
  const [sortOption, setSortOption] = useState("Newest");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <section className="text-white py-8 px-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-orange-500">
          Discussion Threads
        </h2>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-3 bg-black border border-gray-700\ text-white rounded-lg"
        >
          <option value="Newest">Newest</option>
          <option value="Most Active">Most Active</option>
          <option value="Most Liked">Most Liked</option>
        </select>
      </div>
      <div className="space-y-6">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="bg-black/100 border border-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow  hover:shadow-orange-500 duration-300"
          >
            <h3 className="text-xl font-bold text-orange-500">
              <Link
                href={`/forum/threads/${thread.id}`}
                className="hover:underline"
              >
                {thread.title}
              </Link>
            </h3>
            <p className="text-gray-300 mb-2">{thread.description}</p>
            <p className="text-gray-400 text-sm">{thread.replies} replies</p>
          </div>
        ))}
      </div>
    </section>
  );
}
