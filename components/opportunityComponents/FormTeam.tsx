"use client";

import React from "react";
import Link from "next/link";

export default function FormTeam() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Form Your Team
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Ready to create your own team? Follow our step-by-step guide to form a
        team and unlock resources, brand recognition, and networking
        opportunities.
      </p>

      {/* Dynamic Guide Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-orange-500 hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Step 1: Define Your Vision
          </h3>
          <p className="text-gray-300 mt-2">
            Outline your team's goals, mission, and the impact you aim to
            achieve.
          </p>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-orange-500 hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Step 2: Recruit Members
          </h3>
          <p className="text-gray-300 mt-2">
            Find like-minded individuals who share your vision and bring diverse
            skills to the team.
          </p>
        </div>
        <div className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-orange-500 hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-orange-500">
            Step 3: Register Your Team
          </h3>
          <p className="text-gray-300 mt-2">
            Complete the registration process to officially form your team and
            gain access to resources.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <Link
          href="/opportunities/form-team"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg inline-block"
        >
          Start Forming Your Team
        </Link>
      </div>
    </section>
  );
}
