"use client";

import React from "react";

export default function TeamCulture() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">Team Culture</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        At Vyuha, we foster a culture of creativity, collaboration, and growth.
        Our team thrives in an environment that values work-life balance,
        innovation, and mutual respect.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">
            Work-Life Balance
          </h3>
          <p className="text-gray-300 mt-2">
            We ensure our team members have the flexibility they need to succeed
            both personally and professionally.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Creativity</h3>
          <p className="text-gray-300 mt-2">
            We encourage innovative thinking and provide the resources to bring
            ideas to life.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Autonomy</h3>
          <p className="text-gray-300 mt-2">
            Our team members are empowered to take ownership of their work and
            make meaningful contributions.
          </p>
        </div>
      </div>
    </section>
  );
}
