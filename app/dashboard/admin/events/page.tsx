'use client';

import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerBio: string;
  organizerPhoto: string;
  platformLink?: string;
  fees: string;
  materials?: string;
  isRecorded: boolean;
  isVccEvent: boolean;
  image: string;
  category: string;
  mode: 'online' | 'offline';
  targetAudience: string;
  logo: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [vccFilter, setVccFilter] = useState<'all' | 'vcc' | 'non-vcc'>('all');
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    organizerBio: string;
    organizerPhoto: string;
    platformLink: string;
    fees: string;
    materials: string;
    isRecorded: boolean;
    isVccEvent: boolean;
    image: string;
    category: string;
    mode: 'online' | 'offline';
    targetAudience: string;
    logo: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    organizerBio: '',
    organizerPhoto: '',
    platformLink: '',
    fees: '',
    materials: '',
    isRecorded: false,
    isVccEvent: false,
    image: '',
    category: '',
    mode: 'offline',
    targetAudience: '',
    logo: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on VCC filter
  useEffect(() => {
    if (vccFilter === 'all') {
      setFilteredEvents(events);
    } else if (vccFilter === 'vcc') {
      setFilteredEvents(events.filter(event => event.isVccEvent));
    } else if (vccFilter === 'non-vcc') {
      setFilteredEvents(events.filter(event => !event.isVccEvent));
    }
  }, [events, vccFilter]);

  const fetchEvents = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/events/admin/all`, {
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Get file input elements
      const imageInput = document.querySelector('input[data-field="image"]') as HTMLInputElement;
      const logoInput = document.querySelector('input[data-field="logo"]') as HTMLInputElement;
      const organizerPhotoInput = document.querySelector('input[data-field="organizerPhoto"]') as HTMLInputElement;

      // Validate required files for new events
      if (!editingEvent) {
        if (!imageInput?.files?.[0]) {
          setError('Event image is required');
          return;
        }
        if (!logoInput?.files?.[0]) {
          setError('Event logo is required');
          return;
        }
        if (!organizerPhotoInput?.files?.[0]) {
          setError('Organizer photo is required');
          return;
        }
      }

      // Convert files to base64
      let imageBase64 = editingEvent?.image || '';
      let logoBase64 = editingEvent?.logo || '';
      let organizerPhotoBase64 = editingEvent?.organizerPhoto || '';

      if (imageInput?.files?.[0]) {
        imageBase64 = await convertFileToBase64(imageInput.files[0]);
      }
      if (logoInput?.files?.[0]) {
        logoBase64 = await convertFileToBase64(logoInput.files[0]);
      }
      if (organizerPhotoInput?.files?.[0]) {
        organizerPhotoBase64 = await convertFileToBase64(organizerPhotoInput.files[0]);
      }

      const eventData = {
        ...formData,
        image: imageBase64,
        logo: logoBase64,
        organizerPhoto: organizerPhotoBase64
      };
      
      if (editingEvent) {
        await axios.put(`${baseUrl}/api/events/${editingEvent._id}`, eventData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${baseUrl}/api/events`, eventData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      fetchEvents();
      setShowAddModal(false);
      setEditingEvent(null);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        organizerBio: '',
        organizerPhoto: '',
        platformLink: '',
        fees: '',
        materials: '',
        isRecorded: false,
        isVccEvent: false,
        image: '',
        category: '',
        mode: 'offline',
        targetAudience: '',
        logo: '',
        status: 'active'
      });
      setError(null);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      organizerBio: event.organizerBio,
      organizerPhoto: event.organizerPhoto,
      platformLink: event.platformLink || '',
      fees: event.fees,
      materials: event.materials || '',
      isRecorded: event.isRecorded,
      isVccEvent: event.isVccEvent,
      image: event.image,
      category: event.category,
      mode: event.mode,
      targetAudience: event.targetAudience,
      logo: event.logo,
      status: event.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${baseUrl}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading events..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={vccFilter}
              onChange={(e) => setVccFilter(e.target.value as 'all' | 'vcc' | 'non-vcc')}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
            >
              <option value="all">All Events</option>
              <option value="vcc">VCC Events</option>
              <option value="non-vcc">Non-VCC Events</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                location: '',
                organizer: '',
                organizerBio: '',
                organizerPhoto: '',
                platformLink: '',
                fees: '',
                materials: '',
                isRecorded: false,
                isVccEvent: false,
                image: '',
                category: '',
                mode: 'offline',
                targetAudience: '',
                logo: '',
                status: 'active'
              });
              setShowAddModal(true);
            }}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Time: {event.time}</p>
                <p className="text-sm text-gray-500">Location: {event.location}</p>
                <p className="text-sm text-gray-500">Mode: {event.mode}</p>
                <p className="text-sm text-gray-500">Category: {event.category}</p>
                <p className="text-sm font-semibold text-orange-600">Fees: {event.fees}</p>
                <p className="text-sm text-gray-500">
                  VCC Event: <span className={event.isVccEvent ? "text-green-600" : "text-gray-600"}>
                    {event.isVccEvent ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-orange-600 hover:text-orange-900"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as 'online' | 'offline' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fees</label>
                  <input
                    type="text"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Organizer Name</label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Organizer Bio</label>
                  <textarea
                    value={formData.organizerBio}
                    onChange={(e) => setFormData({ ...formData, organizerBio: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Image</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="mt-1 block w-full text-gray-900"
                    accept="image/*"
                    required={!editingEvent}
                    data-field="image"
                  />
                  {editingEvent?.image && (
                    <p className="mt-1 text-sm text-gray-500">Current: {editingEvent.image.split('/').pop()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Logo</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="mt-1 block w-full text-gray-900"
                    accept="image/*"
                    required={!editingEvent}
                    data-field="logo"
                  />
                  {editingEvent?.logo && (
                    <p className="mt-1 text-sm text-gray-500">Current: {editingEvent.logo.split('/').pop()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organizer Photo</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'organizerPhoto')}
                    className="mt-1 block w-full text-gray-900"
                    accept="image/*"
                    required={!editingEvent}
                    data-field="organizerPhoto"
                  />
                  {editingEvent?.organizerPhoto && (
                    <p className="mt-1 text-sm text-gray-500">Current: {editingEvent.organizerPhoto.split('/').pop()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform Link (Optional)</label>
                  <input
                    type="url"
                    value={formData.platformLink}
                    onChange={(e) => setFormData({ ...formData, platformLink: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Materials (Optional)</label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isRecorded}
                      onChange={(e) => setFormData({ ...formData, isRecorded: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Will be recorded</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isVccEvent}
                      onChange={(e) => setFormData({ ...formData, isVccEvent: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Is a VCC Event</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 