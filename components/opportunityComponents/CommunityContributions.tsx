"use client";

import React from "react";
import Link from "next/link";

export default function CommunityContributions() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Community Contributions
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        At Vyuha, we believe in the power of community-driven initiatives.
        Whether you're looking to mentor, volunteer, or contribute content,
        there are plenty of ways to get involved.
      </p>

      {/* Contribution Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">Mentorship</h3>
          <p className="text-gray-300 mt-2 mb-8">
            Share your expertise and guide others by becoming a mentor.
          </p>
          <Link
            href={"/mentorship/create"}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Become a Mentor
          </Link>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">Volunteering</h3>
          <p className="text-gray-300 mt-2">
            Join our community projects and make a difference through
            volunteering.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Volunteer Now
          </button>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Content Creation
          </h3>
          <p className="text-gray-300 mt-2">
            Contribute articles, videos, or other content to inspire and educate
            the community.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Contribute Content
          </button>
        </div>
      </div>

      {/* Collaborative Initiatives */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-orange-500 mb-4">
          Collaborative Initiatives
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          Explore live or ongoing community-driven projects and find
          opportunities to participate or submit your ideas.
        </p>
        <Link href="/opportunities/club-partner">
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg">
            Enhance Your Club
          </button>
        </Link>
      </div>
    </section>
  );
}
