"use client";

import React from "react";
import { users } from "@/data/usersData"; // Import users from the data file

export default function UserProfile() {
  // Assuming the first user is the logged-in user
  const user = users[0];

  return (
    <section className="bg-gray-800 text-white py-8 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">User Profile</h2>
      <p className="text-lg font-bold text-gray-300 mb-4">{user.name}</p>
      <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
        <li>Threads Started: {user.threadsStarted}</li>
        <li>Posts Made: {user.postsMade}</li>
        <li>Topics Followed: {user.topicsFollowed}</li>
      </ul>
      <h3 className="text-xl font-bold text-orange-500 mb-4">Badges</h3>
      <div className="flex space-x-4">
        {user.badges.map((badge, index) => (
          <span
            key={index}
            className="bg-orange-500 text-white py-1 px-3 rounded-lg text-sm"
          >
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}
