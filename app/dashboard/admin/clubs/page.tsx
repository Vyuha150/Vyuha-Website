'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';
import toast from 'react-hot-toast';

interface Club {
  _id: string;
  name: string;
  description: string;
  college: string;
  status: 'active' | 'inactive';
  logo: string;
  members: Array<{ user: string; role: string }>;
  createdAt: string;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    college: '',
    status: 'active' as 'active' | 'inactive',
    members: [] as { user: string; role: string }[]
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/clubs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubs(response.data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setError('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('college', formData.college);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('members', formData.members.join(','));
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      if (editingClub) {
        await axios.put(`${baseUrl}/api/clubs/${editingClub._id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${baseUrl}/api/clubs`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      fetchClubs();
      setShowAddModal(false);
      setEditingClub(null);
      setFormData({
        name: '',
        description: '',
        college: '',
        status: 'active',
        members: []
      });
      setLogoFile(null);
    } catch (err) {
      console.error('Error saving club:', err);
      setError('Failed to save club');
    }
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      description: club.description,
      college: club.college,
      status: club.status,
      members: club.members
    });
    setShowAddModal(true);
  };

  const handleDelete = async (clubId: string) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${baseUrl}/api/clubs/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClubs();
    } catch (err) {
      console.error('Error deleting club:', err);
      setError('Failed to delete club');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading clubs..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clubs</h1>
        <button
          onClick={() => {
            setEditingClub(null);
            setFormData({
              name: '',
              description: '',
              college: '',
              status: 'active',
              members: []
            });
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Club
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div key={club._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={club.logo}
                alt={club.name}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  club.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {club.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{club.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{club.college}</p>
                  <p className="text-sm text-gray-500">{club.members.length} members</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(club)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(club._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">
              {editingClub ? 'Edit Club' : 'Add Club'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mt-1 block w-full text-gray-900"
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
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClub(null);
                    setFormData({
                      name: '',
                      description: '',
                      college: '',
                      status: 'active',
                      members: []
                    });
                    setLogoFile(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                >
                  {editingClub ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 