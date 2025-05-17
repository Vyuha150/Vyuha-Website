"use client";

import React from "react";
import { forumCategories } from "@/data/forumCategoriesData"; // Import categories from the data file

export default function ForumCategories() {
  return (
    <section className="text-white py-8 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Forum Categories
      </h2>
      <input
        type="text"
        placeholder="Search categories..."
        className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {forumCategories.map((category) => (
          <div
            key={category.id}
            className="p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700 hover:shadow-orange-500 hover:border-orange-500 transform hover:-translate-y-3"
          >
            <h3 className="text-xl font-bold text-orange-500">
              {category.name}
            </h3>
            <p className="text-gray-300 mt-2">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
