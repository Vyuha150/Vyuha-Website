"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import SmallLoader from "@/components/SmallLoader";
import { isAuthenticated, hasRole, verifyToken, getAuthHeaders } from "@/utils/auth";

import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  category: string;
  image: string;
  college: {
    name: string;
  };
  registrationDetails: {
    name: string;
    email: string;
    phone: string;
    message?: string;
  };
}

export default function StudentParticipationPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchEvents = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated');
          router.push('/auth/sign-in');
          return;
        }

        // Check if user is a VCC member
        if (!hasRole('vcc_member')) {
          console.log('User is not a VCC member');
          router.push('/unauthorized');
          return;
        }

        // Verify token with backend
        const isValidToken = await verifyToken();
        if (!isValidToken) {
          console.log('Token verification failed');
          router.push('/auth/sign-in');
          return;
        }

        await fetchEvents();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/sign-in');
      }
    };

    const fetchEvents = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        console.log('Making request to:', `${baseUrl}/api/events/my-registrations`);
        
        const token = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl}/api/events/my-registrations`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response received:', response.data);
        setEvents(response.data);
      } catch (err: any) {
        console.error('Error fetching registered events. Full error:', {
          message: err.message,
          name: err.name,
          code: err.code
        });
        
        if (err.response) {
          console.error('Error response details:', {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data,
            headers: err.response.headers,
            config: {
              url: err.response.config.url,
              method: err.response.config.method,
              headers: err.response.config.headers
            }
          });

          if (err.response.status === 401 || err.response.status === 403) {
            console.log('Authentication error - redirecting to login');
            Cookies.remove('authToken');
            router.push('/auth/sign-in');
            return;
          }

          const errorMessage = err.response.data.message || err.response.data.error || 'Failed to load registered events';
          console.error('Setting error message:', errorMessage);
          setError(errorMessage);
        } else if (err.request) {
          console.error('No response received from server. Request details:', {
            url: err.request.url,
            method: err.request.method,
            headers: err.request.headers
          });
          setError('Unable to connect to server. Please check your internet connection.');
        } else {
          console.error('Error setting up request:', err.message);
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchEvents();
  }, [router]);

  // Filter upcoming events (events that haven't happened yet)
  const upcomingEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    return eventDateTime > new Date();
  });

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading participation data..." size="large" />
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 md:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
        className="w-full max-w-3xl rounded-3xl shadow-lg bg-black/60 border border-orange-500 p-0 md:p-2"
      >
        <div className="space-y-8 p-6 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
              My VCC Events
            </h1>
            <p className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1 inline-block">
              VCC Members Only
            </p>
          </div>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2">Total Events Registered</h2>
                <p className="text-3xl font-bold text-white">{events.length}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-orange-400 mb-2">Upcoming Events</h2>
                <p className="text-3xl font-bold text-white">{upcomingEvents.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-4">
                {upcomingEvents.map((event) => (
                  <li key={event._id} className="border border-orange-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                      <span className="text-sm text-orange-400">{format(new Date(`${event.date} ${event.time}`), "PPp")}</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Location: {event.location}</p>
                      <p>Mode: {event.mode}</p>
                      <p>Category: {event.category}</p>
                      <p>College: {event.college?.name || 'Not specified'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No upcoming events</p>
            )}
          </Card>

          <Card className="p-6 bg-black/60 border border-orange-500 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">Past Events</h2>
            {events.filter(event => new Date(`${event.date} ${event.time}`) <= new Date()).length > 0 ? (
              <ul className="space-y-4">
                {events
                  .filter(event => new Date(`${event.date} ${event.time}`) <= new Date())
                  .map((event) => (
                    <li key={event._id} className="border border-orange-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                        <span className="text-sm text-orange-400">{format(new Date(`${event.date} ${event.time}`), "PPp")}</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Location: {event.location}</p>
                        <p>Mode: {event.mode}</p>
                        <p>Category: {event.category}</p>
                        <p>College: {event.college?.name || 'Not specified'}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-400">No past events</p>
            )}
          </Card>
        </div>
      </motion.div>
    </main>
  );
}