'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from './components/EventForm';

interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  category: string;
  incollege: boolean;
  isVccEvent?: boolean;
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

export default function EventLeadEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<Event | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'college' | 'non-college'>('all');
  const [vccFilter, setVccFilter] = useState<'all' | 'vcc' | 'non-vcc'>('all');

  const fetchEvents = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Fetch events for the event lead's college
      const response = await axios.get(`${baseUrl}/api/events/college`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data);
      setFilteredEvents(response.data); // Initialize filtered events
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on selected filters
  useEffect(() => {
    let filtered = events;

    // Apply college filter
    if (eventTypeFilter === 'college') {
      filtered = filtered.filter(event => event.incollege);
    } else if (eventTypeFilter === 'non-college') {
      filtered = filtered.filter(event => !event.incollege);
    }

    // Apply VCC filter
    if (vccFilter === 'vcc') {
      filtered = filtered.filter(event => event.isVccEvent);
    } else if (vccFilter === 'non-vcc') {
      filtered = filtered.filter(event => !event.isVccEvent);
    }

    setFilteredEvents(filtered);
  }, [events, eventTypeFilter, vccFilter]);

  const handleDelete = async (eventId: string) => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      await axios.delete(`${baseUrl}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    fetchEvents(); // Refresh the list after modal closes
  };

  const handleViewRegistrations = (event: Event) => {
    setSelectedEventForRegistrations(event);
    setShowRegistrations(true);
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading events..." size="large" />
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Events</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-black">Filter by Type:</label>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as 'all' | 'college' | 'non-college')}
            className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
          >
            <option value="all">All Events</option>
            <option value="college">College Events</option>
            <option value="non-college">Non-College Events</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-black">Filter by VCC:</label>
          <select
            value={vccFilter}
            onChange={(e) => setVccFilter(e.target.value as 'all' | 'vcc' | 'non-vcc')}
            className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
          >
            <option value="all">All Events</option>
            <option value="vcc">VCC Events</option>
            <option value="non-vcc">Non-VCC Events</option>
          </select>
        </div>
        <span className="text-sm text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </span>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Event Name</TableHead>
              <TableHead className="text-black">Date & Time</TableHead>
              <TableHead className="text-black">Location</TableHead>
              <TableHead className="text-black">Mode</TableHead>
              <TableHead className="text-black">Category</TableHead>
              <TableHead className="text-black">Type</TableHead>
              <TableHead className="text-black">VCC Event</TableHead>
              <TableHead className="text-black">Registrations</TableHead>
              <TableHead className="text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell className="font-medium text-black">{event.name}</TableCell>
                <TableCell className="text-black">
                  {new Date(event.date).toLocaleDateString()} {event.time}
                </TableCell>
                <TableCell className="text-black">{event.location}</TableCell>
                <TableCell className="capitalize text-black">{event.mode}</TableCell>
                <TableCell className="text-black">{event.category}</TableCell>
                <TableCell className="text-black">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.incollege ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.incollege ? 'College' : 'Non-College'}
                  </span>
                </TableCell>
                <TableCell className="text-black">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.isVccEvent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.isVccEvent ? 'VCC' : 'Regular'}
                  </span>
                </TableCell>
                <TableCell className="text-black">
                  {event.registrationLimit ? 
                    `${event.registrationCount || 0}/${event.registrationLimit}` : 
                    `${event.registrationCount || 0}`
                  }
                  {event.isRegistrationFull && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Full
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewRegistrations(event)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-black">Delete Event</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete this event? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(event._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={selectedEvent || undefined}
            isEditing={!!selectedEvent}
            eventId={selectedEvent?._id}
            onSuccess={handleModalClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegistrations} onOpenChange={setShowRegistrations}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">
              Registrations for {selectedEventForRegistrations?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Username</TableHead>
                  <TableHead className="text-black">Email</TableHead>
                  <TableHead className="text-black">Registered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEventForRegistrations?.registrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell className="font-medium text-black">{registration.userId.username}</TableCell>
                    <TableCell className="text-black">{registration.userId.email}</TableCell>
                    <TableCell className="text-black">
                      {new Date(registration.registeredAt).toLocaleDateString()} {new Date(registration.registeredAt).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
                {selectedEventForRegistrations?.registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No registrations yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowRegistrations(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}