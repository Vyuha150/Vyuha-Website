"use client";

import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';
import PodcastCard from '@/components/PodcastCard';
import { toast } from 'react-hot-toast';

interface Podcast {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  requested: boolean;
  title?: string;
  description?: string;
  host?: string;
  hostPhoto?: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
  language?: string;
  releaseDate?: string;
  audioUrl?: string;
  status: 'active' | 'inactive' | 'requested';
  tags?: string[];
  likes: number;
  views: number;
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  title: string;
  description: string;
  host: string;
  hostPhoto: string | File;
  thumbnail: string | File;
  duration: string;
  category: string;
  language: string;
  releaseDate: string;
  audioUrl: string;
  status: 'active' | 'inactive';
  tags: string[];
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PodcastsPage() {
  const [requestedPodcasts, setRequestedPodcasts] = useState<Podcast[]>([]);
  const [completedPodcasts, setCompletedPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requested' | 'completed'>('requested');
  const [showModal, setShowModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    title: '',
    description: '',
    host: '',
    hostPhoto: '',
    thumbnail: '',
    duration: '',
    category: '',
    language: '',
    releaseDate: '',
    audioUrl: '',
    status: 'active',
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const token = Cookies.get('authToken');
      const [requestedResponse, completedResponse] = await Promise.all([
        axios.get(`${baseUrl}/api/podcasts/requested`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseUrl}/api/podcasts/completed`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setRequestedPodcasts(requestedResponse.data);
      setCompletedPodcasts(completedResponse.data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast.error('Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        hostPhoto: typeof formData.hostPhoto === 'string' ? formData.hostPhoto : 
                  await handleFileToBase64(formData.hostPhoto),
        thumbnail: typeof formData.thumbnail === 'string' ? formData.thumbnail : 
                  await handleFileToBase64(formData.thumbnail),
      };

      const token = Cookies.get('authToken');
      
      if (isCompleting && editingPodcast) {
        await axios.put(`${baseUrl}/api/podcasts/${editingPodcast._id}/complete`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Podcast completed successfully');
      } else if (editingPodcast) {
        await axios.put(`${baseUrl}/api/podcasts/${editingPodcast._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Podcast updated successfully');
      } else {
        await axios.post(`${baseUrl}/api/podcasts`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Podcast created successfully');
      }

      resetForm();
      fetchPodcasts();
    } catch (error) {
      console.error('Error submitting podcast:', error);
      toast.error('Failed to save podcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsCompleting(false);
    setFormData({
      name: podcast.name,
      email: podcast.email,
      phoneNumber: podcast.phoneNumber,
      title: podcast.title || '',
      description: podcast.description || '',
      host: podcast.host || '',
      hostPhoto: podcast.hostPhoto || '',
      thumbnail: podcast.thumbnail || '',
      duration: podcast.duration || '',
      category: podcast.category || '',
      language: podcast.language || '',
      releaseDate: podcast.releaseDate || '',
      audioUrl: podcast.audioUrl || '',
      status: podcast.status === 'requested' ? 'active' : podcast.status,
      tags: podcast.tags || []
    });
    setShowModal(true);
  };

  const handleComplete = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsCompleting(true);
    setFormData({
      name: podcast.name,
      email: podcast.email,
      phoneNumber: podcast.phoneNumber,
      title: '',
      description: '',
      host: '',
      hostPhoto: '',
      thumbnail: '',
      duration: '',
      category: '',
      language: '',
      releaseDate: '',
      audioUrl: '',
      status: 'active',
      tags: []
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      try {
        const token = Cookies.get('authToken');
        await axios.delete(`${baseUrl}/api/podcasts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Podcast deleted successfully');
        fetchPodcasts();
      } catch (error) {
        console.error('Error deleting podcast:', error);
        toast.error('Failed to delete podcast');
      }
    }
  };

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    const items = value.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setIsCompleting(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      title: '',
      description: '',
      host: '',
      hostPhoto: '',
      thumbnail: '',
      duration: '',
      category: '',
      language: '',
      releaseDate: '',
      audioUrl: '',
      status: 'active',
      tags: []
    });
    setShowModal(false);
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading podcasts..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Podcast Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Podcast
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('requested')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requested'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Requested Podcasts ({requestedPodcasts.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed Podcasts ({completedPodcasts.length})
        </button>
      </div>

      {/* Podcast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'requested' ? (
          requestedPodcasts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No podcast requests found</p>
            </div>
          ) : (
            requestedPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                podcast={podcast}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            ))
          )
        ) : (
          completedPodcasts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No completed podcasts found</p>
            </div>
          ) : (
            completedPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                podcast={podcast}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-black mb-4">
              {isCompleting ? 'Complete Podcast Request' : 
               editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    disabled={isCompleting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    disabled={isCompleting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    disabled={isCompleting}
                  />
                </div>
              </div>

              {/* Podcast Details */}
              <div>
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Host</label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Host Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, hostPhoto: e.target.files?.[0] || '' })}
                  className="mt-1 block w-full text-black"
                  required={!editingPodcast}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || '' })}
                  className="mt-1 block w-full text-black"
                  required={!editingPodcast}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 30 minutes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Release Date</label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Audio URL</label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Tags (comma-separated)</label>
                <textarea
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayInput('tags', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 
                   isCompleting ? 'Complete Podcast' : 
                   editingPodcast ? 'Update Podcast' : 'Create Podcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}