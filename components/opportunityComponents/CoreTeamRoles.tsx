"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function CoreTeamRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await axios.get(`${apiUrl}/api/core-team-role`);
        setRoles(res.data);
      } catch (err) {
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        Join the Core Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-gray-400">Loading...</div>
        ) : roles.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            No roles found.
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role._id}
              className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-orange-500 hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-orange-500">
                {role.title}
              </h3>
              <p className="text-gray-300 mt-2">{role.description}</p>
              <Link
                href={`/opportunities/core-team/${role._id}`}
                className="text-orange-500 hover:underline mt-4 inline-block"
              >
                Learn More
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
