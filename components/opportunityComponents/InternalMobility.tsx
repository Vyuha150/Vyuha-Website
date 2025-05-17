"use client";

import React from "react";

export default function InternalMobility() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Internal Mobility
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        At Vyuha, we believe in fostering career growth and providing
        opportunities for internal mobility. Explore the pathways to success
        within our organization.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform">
          <h3 className="text-xl font-bold text-orange-500">Career Growth</h3>
          <p className="text-gray-300 mt-2">
            Discover the various career pathways available at Vyuha.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform">
          <h3 className="text-xl font-bold text-orange-500">
            Promotion Pathways
          </h3>
          <p className="text-gray-300 mt-2">
            Explore growth options through visual flowcharts and interactive
            tools.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform">
          <h3 className="text-xl font-bold text-orange-500">
            Personal Development
          </h3>
          <p className="text-gray-300 mt-2">
            Learn about mentorship and training programs designed to help you
            succeed.
          </p>
        </div>
      </div>
    </section>
  );
}
