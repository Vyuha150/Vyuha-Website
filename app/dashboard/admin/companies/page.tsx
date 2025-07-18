'use client';

import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

interface Company {
  _id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  logo: string;
  website?: string;
  status: 'active' | 'inactive';
  jobOpenings: string[];
  contact?: string;
  createdAt: string;
}

interface FormData {
  name: string;
  description: string;
  industry: string;
  location: string;
  logo: string | File;
  logoType?: string;
  website: string;
  status: 'active' | 'inactive';
  jobOpenings: string[];
  contact: string;
}

const handleFileToBase64 = (file: File): Promise<{ base64: string; type: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Extract the base64 data and type from the data URL
      const [header, base64] = dataUrl.split(',');
      const type = header.match(/^data:(.*?);base64$/)?.[1] || file.type;
      resolve({ base64, type });
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
  });
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    industry: '',
    location: '',
    logo: '',
    logoType: '',
    website: '',
    status: 'active' as const,
    jobOpenings: [],
    contact: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!baseUrl) {
        throw new Error('API URL is not configured');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      // Validate logo presence
      if (!formData.logo) {
        throw new Error('Logo is required');
      }

      // Convert logo to base64 if it's a File
      let logoBase64: string;
      let logoType: string;

      if (formData.logo instanceof File) {
        try {
          const result = await handleFileToBase64(formData.logo);
          logoBase64 = result.base64;
          logoType = result.type;
        } catch (error) {
          console.error('Error converting logo to base64:', error);
          throw new Error('Failed to process logo image');
        }
      } else if (typeof formData.logo === 'string') {
        // If it's already a data URL, extract the base64 and type
        const [header, base64] = formData.logo.split(',');
        logoBase64 = base64;
        logoType = header.match(/^data:(.*?);base64$/)?.[1] || formData.logoType || 'image/png';
      } else {
        throw new Error('Invalid logo format');
      }

      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        industry: formData.industry.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        status: formData.status,
        jobOpenings: [], // Send empty array since we don't have ObjectIds on frontend
        contact: formData.contact.trim(),
        logo: formData.logo, // Send the complete data URL
      };

      console.log('Sending data to API:', {
        url: `${baseUrl}/api/companies`,
        dataPreview: {
          ...dataToSend,
          logo: typeof dataToSend.logo === 'string' ? `Data URL length: ${dataToSend.logo.length}` : 'File object'
        }
      });
      
      if (editingCompany) {
        await axios.put(`${baseUrl}/api/companies/${editingCompany._id}`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        const response = await axios.post(`${baseUrl}/api/companies`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('API Response:', response.data);
      }
      
      fetchCompanies();
      setShowAddModal(false);
      setEditingCompany(null);
      setFormData({
        name: '',
        description: '',
        industry: '',
        location: '',
        logo: '',
        logoType: '',
        website: '',
        status: 'active' as const,
        jobOpenings: [],
        contact: ''
      });
    } catch (err) {
      console.error('Error saving company:', err);
      
      // If it's a validation error we threw
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      
      const error = err as { 
        response?: { 
          data?: { 
            errors?: Array<{ msg: string; param?: string }>;
            message?: string;
          } 
        } 
      };
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(e => e.param ? `${e.param}: ${e.msg}` : e.msg)
          .join(', ');
        setError(`Failed to save company: ${errorMessages}`);
      } else if (error.response?.data?.message) {
        setError(`Failed to save company: ${error.response.data.message}`);
      } else {
        setError('Failed to save company: Unknown error occurred');
      }
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description,
      industry: company.industry,
      location: company.location,
      logo: company.logo,
      logoType: '',
      website: company.website || '',
      status: company.status,
      jobOpenings: company.jobOpenings,
      contact: company.contact || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (companyId: string) => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${baseUrl}/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company');
    }
  };

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    // Split by both commas and newlines
    const items = value.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading companies..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <button
          onClick={() => {
            setEditingCompany(null);
            setFormData({
              name: '',
              description: '',
              industry: '',
              location: '',
              logo: '',
              logoType: '',
              website: '',
              status: 'active' as const,
              jobOpenings: [],
              contact: ''
            });
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-black rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Company
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{company.industry}</p>
              <p className="text-gray-600 mb-2">{company.location}</p>
              <p className="text-gray-600 line-clamp-3">{company.description}</p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCompany ? 'Edit Company' : 'Add Company'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
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
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('Selected file:', {
                        name: file.name,
                        type: file.type,
                        size: file.size
                      });
                      // Immediately convert to base64 when file is selected
                      handleFileToBase64(file)
                        .then(({ base64, type }) => {
                          console.log('File converted successfully:', {
                            type,
                            base64Length: base64.length
                          });
                          // Store as data URL for preview
                          setFormData({
                            ...formData,
                            logo: `data:${type};base64,${base64}`,
                            logoType: type
                          });
                        })
                        .catch(error => {
                          console.error('Error converting file to base64:', error);
                          setError('Failed to process logo image');
                        });
                    }
                  }}
                  className="mt-1 block w-full text-black"
                />
                {formData.logo && typeof formData.logo === 'string' && (
                  <div className="mt-2">
                    <img 
                      src={formData.logo} 
                      alt="Selected logo preview" 
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Openings</label>
                <textarea
                  value={formData.jobOpenings.join('\n')}
                  onChange={(e) => handleArrayInput('jobOpenings', e.target.value)}
                  placeholder="Enter job openings (one per line)"
                  rows={4}
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

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCompany(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-black rounded-lg hover:bg-orange-700"
                >
                  {editingCompany ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 