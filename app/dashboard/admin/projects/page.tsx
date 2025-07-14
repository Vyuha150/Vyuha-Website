'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

interface Project {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  thumbnail: string;
  githubUrl: string;
  demoUrl: string;
  status: 'active' | 'inactive';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  teamSize: string;
  deadline: string;
  goals: string[];
  deliverables: string[];
  evaluationCriteria: string[];
  createdAt: string;
  image?: string;
}

interface FormData {
  title: string;
  description: string;
  skills: string;
  thumbnail: string;
  githubUrl: string;
  demoUrl: string;
  status: string;
  difficulty: string;
  teamSize: string;
  deadline: string;
  goals: string;
  deliverables: string;
  evaluationCriteria: string;
}

export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    skills: '',
    thumbnail: '',
    githubUrl: '',
    demoUrl: '',
    status: 'active',
    difficulty: 'Easy',
    teamSize: '',
    deadline: new Date().toISOString().split('T')[0],
    goals: '',
    deliverables: '',
    evaluationCriteria: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure each project has the required arrays initialized
      const processedProjects = response.data.map((project: Project) => ({
        ...project,
        skills: project.skills || [],
        goals: project.goals || [],
        deliverables: project.deliverables || [],
        evaluationCriteria: project.evaluationCriteria || []
      }));

      console.log('Fetched projects:', processedProjects);
      setProjects(processedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const safeJoin = (arr: string[] | undefined | null, separator: string): string => {
    if (!Array.isArray(arr)) return '';
    return arr.join(separator);
  };

  const handleTextInput = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      console.log('Form data before processing:', formData);

      // Create data object with base64 image
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: formData.deadline,
        difficulty: formData.difficulty,
        teamSize: formData.teamSize,
        goals: formData.goals.split('\n').filter(Boolean),
        deliverables: formData.deliverables.split('\n').filter(Boolean),
        evaluationCriteria: formData.evaluationCriteria.split('\n').filter(Boolean),
        status: formData.status,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        image: imageBase64 || undefined
      };

      console.log('Sending data to backend:', { ...dataToSend, image: imageBase64 ? 'base64_string_present' : 'no_image' });
      
      if (editingProject) {
        await axios.put(`${baseUrl}/api/projects/${editingProject._id}`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${baseUrl}/api/projects`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      fetchProjects();
      setShowAddModal(false);
      setEditingProject(null);
      setImageFile(null);
      setImageBase64('');
      setFormData({
        title: '',
        description: '',
        skills: '',
        thumbnail: '',
        githubUrl: '',
        demoUrl: '',
        status: 'active',
        difficulty: 'Easy',
        teamSize: '',
        deadline: new Date().toISOString().split('T')[0],
        goals: '',
        deliverables: '',
        evaluationCriteria: ''
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      thumbnail: project.thumbnail,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      status: project.status,
      difficulty: project.difficulty,
      teamSize: project.teamSize,
      deadline: project.deadline,
      goals: project.goals.join('\n'),
      deliverables: project.deliverables.join('\n'),
      evaluationCriteria: project.evaluationCriteria.join('\n')
    });
    setShowAddModal(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${baseUrl}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading projects..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: '',
              description: '',
              skills: '',
              thumbnail: '',
              githubUrl: '',
              demoUrl: '',
              status: 'active',
              difficulty: 'Easy',
              teamSize: '',
              deadline: new Date().toISOString().split('T')[0],
              goals: '',
              deliverables: '',
              evaluationCriteria: ''
            });
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {project.status}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  project.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  project.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.difficulty}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map((tech, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Team Size: {project.teamSize}</p>
                {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:text-orange-700 block"
                >
                    GitHub Repository
                </a>
                )}
                {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-600 hover:text-orange-700 block"
                >
                  Live Demo
                </a>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-orange-600 hover:text-orange-900"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-8rem)] overflow-y-auto my-4">
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b z-20">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-black">
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTextInput('title', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleTextInput('description', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-orange-50 file:text-orange-700
                      hover:file:bg-orange-100"
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected file: {imageFile.name}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated or one per line)</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => handleTextInput('skills', e.target.value)}
                    placeholder="Enter skills (one per line or separated by commas)&#10;Example:&#10;React&#10;Node.js, Express&#10;MongoDB"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleTextInput('deadline', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => handleTextInput('thumbnail', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleTextInput('githubUrl', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => handleTextInput('demoUrl', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleTextInput('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Size</label>
                  <input
                    type="text"
                    value={formData.teamSize}
                    onChange={(e) => handleTextInput('teamSize', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Goals (one per line)</label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => handleTextInput('goals', e.target.value)}
                    placeholder="Enter goals (one per line)&#10;Example:&#10;Implement user authentication&#10;Create responsive dashboard"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Deliverables (one per line)</label>
                  <textarea
                    value={formData.deliverables}
                    onChange={(e) => handleTextInput('deliverables', e.target.value)}
                    placeholder="Enter deliverables (one per line)&#10;Example:&#10;Working authentication system&#10;Mobile-responsive UI"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Evaluation Criteria (one per line)</label>
                  <textarea
                    value={formData.evaluationCriteria}
                    onChange={(e) => handleTextInput('evaluationCriteria', e.target.value)}
                    placeholder="Enter evaluation criteria (one per line)&#10;Example:&#10;Code quality and organization&#10;User interface design"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleTextInput('status', e.target.value as 'active' | 'inactive')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 