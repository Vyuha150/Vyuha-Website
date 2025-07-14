'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Users, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  incollege: boolean;
  registrationLimit?: number | null;
  registrationCount?: number;
  isRegistrationFull?: boolean;
  registrations: Array<{
    _id: string;
    userId: {
      _id: string;
      username: string;
      email: string;
    };
    registeredAt: string;
  }>;
}

interface Stats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  activeEvents: number;
}

export default function EventLeadOverview() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    activeEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('authToken');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch events for the event lead's college
        const response = await axios.get(`${baseUrl}/api/events/college`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const events = response.data;
        const now = new Date();

        // Calculate stats
        const totalEvents = events.length;
        const upcomingEvents = events.filter((event: Event) => 
          new Date(`${event.date} ${event.time}`) > now
        ).length;
        const totalRegistrations = events.reduce((acc: number, event: Event) => 
          acc + event.registrations.length, 0
        );
        const activeEvents = events.filter((event: Event) => 
          new Date(`${event.date} ${event.time}`) >= now
        ).length;

        setStats({
          totalEvents,
          upcomingEvents,
          totalRegistrations,
          activeEvents,
        });

        // Get recent events
        const sortedEvents = [...events].sort((a: Event, b: Event) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentEvents(sortedEvents.slice(0, 5));

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading overview..." size="large" />
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Event Lead Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Events</CardTitle>
            <MapPin className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeEvents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentEvents.map((event) => (
            <div key={event._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{event.name}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {event.registrationLimit ? 
                    `${event.registrationCount || 0}/${event.registrationLimit} registrations` : 
                    `${event.registrationCount || 0} registrations`
                  }
                  {event.isRegistrationFull && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Full
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 