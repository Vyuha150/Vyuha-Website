'use client';

import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SmallLoader from '@/components/SmallLoader';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: {
    _id: string;
    name: string;
  } | string;
  location: string;
  jobType: string;
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface JobApplication {
  _id: string;
  name: string;
  email: string;
  jobId: {
    _id: string;
    title: string;
  } | string;
  coverLetter?: string;
  resume: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Array<{_id: string; name: string}>>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    description: '',
    responsibilities: [] as string[],
    qualifications: [] as string[],
    image: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [qualificationInput, setQualificationInput] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
    fetchApplications();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/job-applicants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Convert arrays to strings
      const formDataToSend = {
        ...formData,
        responsibilities: formData.responsibilities.join(','),
        qualifications: formData.qualifications.join(',')
      };
      
      if (editingJob) {
        await axios.put(`${baseUrl}/api/jobs/${editingJob._id}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${baseUrl}/api/jobs`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchJobs();
      setShowAddModal(false);
      setEditingJob(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        jobType: '',
        description: '',
        image: '',
        responsibilities: [],
        qualifications: [],
        status: 'active'
      });
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Failed to save job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: typeof job.company === 'string' ? job.company : job.company._id,
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      responsibilities: job.responsibilities || [],
      qualifications: job.qualifications || [],
      image: job.image || '',
      status: job.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/jobs/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to delete job');
      await fetchJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, responsibilityInput.trim()]
      });
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (itemToRemove: string) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter(item => item !== itemToRemove)
    });
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qualificationInput.trim()]
      });
      setQualificationInput('');
    }
  };

  const removeQualification = (itemToRemove: string) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter(item => item !== itemToRemove)
    });
  };

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    // Split by both commas and newlines
    const items = value.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/job-applicants/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status } : app
          )
        );
      } else {
        setError('Failed to update application status');
      }
    } catch (err) {
      setError('Error updating application status');
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${BACKEND_URL}/api/job-applicants/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setApplications(prev => prev.filter(app => app._id !== applicationId));
      } else {
        setError('Failed to delete application');
      }
    } catch (err) {
      setError('Error deleting application');
    }
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading jobs and applications..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jobs Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Job
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications ({applications.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {job.image && (
              <div className="h-40 bg-gray-100">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {typeof job.company === 'string' ? job.company : job.company.name}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">{job.location}</span>
                <span className="mx-2">•</span>
                <span className="text-sm text-gray-500">{job.jobType}</span>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
              
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Key Responsibilities:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {job.responsibilities.slice(0, 3).map((item, index) => (
                      <li key={index} className="line-clamp-1">{item}</li>
                    ))}
                    {job.responsibilities.length > 3 && (
                      <li className="text-orange-600">+{job.responsibilities.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Posted on {formatDate(job.createdAt)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
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
      )}

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No job applications found.
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{application.name}</h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on {formatDate(application.appliedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium text-black ${
                      application.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {application.resume && (
                      <a
                        href={`${BACKEND_URL}/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                      >
                        View Resume
                      </a>
                    )}
                    <span className="text-sm text-gray-500">
                      Job: {typeof application.jobId === 'string' ? application.jobId : application.jobId.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application._id, e.target.value as 'pending' | 'accepted' | 'rejected')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button
                      onClick={() => deleteApplication(application._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Responsibilities (one per line or comma-separated)</label>
                  <textarea
                    value={formData.responsibilities.join('\n')}
                    onChange={(e) => handleArrayInput('responsibilities', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Qualifications (one per line or comma-separated)</label>
                  <textarea
                    value={formData.qualifications.join('\n')}
                    onChange={(e) => handleArrayInput('qualifications', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingJob(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {editingJob ? 'Update' : 'Add'} Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 