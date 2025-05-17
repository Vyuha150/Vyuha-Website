"use client";

import React from "react";

export default function MissionValues() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Our Mission & Values
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        At Vyuha, our mission is to empower individuals and teams to achieve
        their full potential through collaboration, innovation, and
        community-driven initiatives.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Innovation</h3>
          <p className="text-gray-300 mt-2">
            We foster creativity and out-of-the-box thinking.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Collaboration</h3>
          <p className="text-gray-300 mt-2">
            We believe in the power of teamwork and shared goals.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Integrity</h3>
          <p className="text-gray-300 mt-2">
            We uphold honesty and transparency in all our actions.
          </p>
        </div>
        <div className="p-4 bg-black/70 border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 transform ">
          <h3 className="text-xl font-bold text-orange-500">Impact</h3>
          <p className="text-gray-300 mt-2">
            We strive to make a meaningful difference in the community.
          </p>
        </div>
      </div>
    </section>
  );
}
