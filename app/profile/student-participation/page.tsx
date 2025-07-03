"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Dummy data for demonstration
const studentData = {
  totalEventsRegistered: 8,
  upcomingEvents: [
    { name: "Innovation Hackathon", date: "2024-07-10" },
    { name: "AI Bootcamp", date: "2024-07-20" },
  ],
  newOpenEvents: [
    { name: "Design Thinking Workshop", registrationEnds: "2024-07-15" },
    { name: "Startup Pitch Fest", registrationEnds: "2024-07-18" },
  ],
  membershipStatus: "Active Member",
  clubRegistrations: [
    { club: "Robotics Club", status: "Approved" },
    { club: "Entrepreneurship Cell", status: "Pending" },
  ],
  points: 120,
  participationDetails: [
    { activity: "Event Participation", count: 8 },
    { activity: "Club Activities", count: 5 },
    { activity: "Workshops Attended", count: 3 },
    { activity: "Quizzes Completed", count: 2 },
  ],
};

export default function StudentParticipationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 md:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
        className="w-full max-w-3xl rounded-3xl shadow-lg bg-black/60 border border-orange-500 p-0 md:p-2"
      >
        <div className="space-y-8 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6 text-center">
            My Participation Overview
          </h1>
          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2">Total Events Registered</h2>
                <p className="text-3xl font-bold text-white">{studentData.totalEventsRegistered}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2">Points Gained</h2>
                <p className="text-3xl font-bold text-white">{studentData.points}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Upcoming Registered Events</h2>
            <ul className="space-y-2">
              {studentData.upcomingEvents.map((event, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-white">{event.name}</span>
                  <span className="text-gray-300">{event.date}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Newly Added Events (Open Registration)</h2>
            <ul className="space-y-2">
              {studentData.newOpenEvents.map((event, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-white">{event.name}</span>
                  <span className="text-gray-300">Reg. ends: {event.registrationEnds}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Membership Status</h2>
            <p className="text-lg font-bold text-white mb-2">{studentData.membershipStatus}</p>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Club Registrations</h2>
            <ul className="space-y-2">
              {studentData.clubRegistrations.map((club, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-white">{club.club}</span>
                  <span className={`px-3 py-1 rounded-lg text-sm ${club.status === "Approved" ? "bg-green-600" : "bg-yellow-600"}`}>{club.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Participation Details (mygov.in style)</h2>
            <ul className="space-y-2">
              {studentData.participationDetails.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-white">{item.activity}</span>
                  <span className="text-gray-300">{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </motion.div>
    </main>
  );
} 