"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleToggle = (key: "email" | "sms" | "push") => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call)
    toast.success("Notification preferences updated successfully!");
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-black p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="text-sm font-medium">
              Email Notifications
            </label>
            <input
              type="checkbox"
              id="email"
              checked={preferences.email}
              onChange={() => handleToggle("email")}
              className="w-5 h-5 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <label htmlFor="sms" className="text-sm font-medium">
              SMS Notifications
            </label>
            <input
              type="checkbox"
              id="sms"
              checked={preferences.sms}
              onChange={() => handleToggle("sms")}
              className="w-5 h-5 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <label htmlFor="push" className="text-sm font-medium">
              Push Notifications
            </label>
            <input
              type="checkbox"
              id="push"
              checked={preferences.push}
              onChange={() => handleToggle("push")}
              className="w-5 h-5 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-transform"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </main>
  );
}
