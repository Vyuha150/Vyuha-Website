"use client";

import React from "react";

export default function EnhanceClub() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Enhance Your Existing Club
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        At Vyuha, we provide tools and resources to help existing clubs grow and
        thrive. Explore how we can support your club's journey to success.
      </p>

      {/* Club Enhancement Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Growth Strategies
          </h3>
          <p className="text-gray-300 mt-2">
            Access tailored strategies to expand your club's reach and impact.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Learn More
          </button>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">Funding Support</h3>
          <p className="text-gray-300 mt-2">
            Discover funding opportunities to support your club's initiatives.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Apply for Funding
          </button>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Skill Development
          </h3>
          <p className="text-gray-300 mt-2">
            Enroll in workshops and training programs to enhance your team's
            skills.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Join Workshops
          </button>
        </div>
      </div>

      {/* Partnerships Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-orange-500 mb-4">
          Partnerships
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          Collaborate with Vyuha to take your club to the next level. Submit
          partnership inquiries and explore how we can work together.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
          Submit Partnership Inquiry
        </button>
      </div>
    </section>
  );
}
