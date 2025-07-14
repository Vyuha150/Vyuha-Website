'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: number;
  thumbnail: string;
  status: 'active' | 'inactive';
  instructorPhoto: string;
  coursePhoto: string;
  details: string;
  prerequisites: string[];
  learningObjectives: string[];
  assessments: string;
  format: string;
  level: string;
  rating: number;
  reviews: number;
  // enrollLink: string;
  userReviews: Array<{
    user: string;
    comment: string;
    rating: number;
  }>;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: number;
  thumbnail: string;
  status: 'active' | 'inactive';
  instructorPhoto: string | File;
  coursePhoto: string | File;
  details: string;
  prerequisites: string[];
  learningObjectives: string[];
  assessments: string;
  format: string;
  level: string;
  rating: number;
  reviews: number;
  // enrollLink: string;
  userReviews: Array<{
    user: string;
    comment: string;
    rating: number;
  }>;
}

const handleFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    price: 0,
    thumbnail: '',
    status: 'active',
    instructorPhoto: '',
    coursePhoto: '',
    details: '',
    prerequisites: [],
    learningObjectives: [],
    assessments: '',
    format: '',
    level: '',
    rating: 0,
    reviews: 0,
    // enrollLink: '',
    userReviews: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate URLs
  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      // Must be http or https, and must have a valid host that's not localhost
      return (url.protocol === 'http:' || url.protocol === 'https:') && 
             !!url.host && 
             !url.username && 
             !url.password &&
             !url.host.includes('localhost') &&
             !url.host.includes('127.0.0.1');
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = {
      title: 'Title',
      instructor: 'Instructor',
      description: 'Description',
      details: 'Details',
      assessments: 'Assessments',
      format: 'Format',
      level: 'Level',
      duration: 'Duration',
      instructorPhoto: 'Instructor Photo',
      coursePhoto: 'Course Photo'
    };

    const numericFields = {
      price: 'Price',
      rating: 'Rating',
      reviews: 'Reviews'
    };

    const missingFields = [];
    
    // Check required text fields
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof FormData] || 
          (Array.isArray(formData[field as keyof FormData]) && (formData[field as keyof FormData] as any[]).length === 0)) {
        missingFields.push(label);
      }
    }

    // Check numeric fields
    for (const [field, label] of Object.entries(numericFields)) {
      const value = formData[field as keyof FormData];
      if (typeof value !== 'number' || value < 0) {
        missingFields.push(`${label} (must be a positive number)`);
      }
    }

    // Validate prerequisites and learningObjectives
    if (!formData.prerequisites || formData.prerequisites.length === 0) {
      missingFields.push('Prerequisites (at least one required)');
    } else if (formData.prerequisites.some(p => !p.trim())) {
      missingFields.push('Prerequisites (empty items not allowed)');
    }

    if (!formData.learningObjectives || formData.learningObjectives.length === 0) {
      missingFields.push('Learning Objectives (at least one required)');
    } else if (formData.learningObjectives.some(o => !o.trim())) {
      missingFields.push('Learning Objectives (empty items not allowed)');
    }

    // Validate URL format for enrollLink
    // if (!formData.enrollLink) {
    //   missingFields.push('Enroll Link (required)');
    // } else {
      // try {
      //   const url = new URL(formData.enrollLink);
      //   if (!['http:', 'https:'].includes(url.protocol)) {
      //     missingFields.push('Enroll Link (must start with http:// or https://)');
      //   } else if (!url.host) {
      //     missingFields.push('Enroll Link (must include a valid domain)');
      //   } else if (url.username || url.password) {
      //     missingFields.push('Enroll Link (must not include username or password)');
      //   } else if (url.host.includes('localhost') || url.host.includes('127.0.0.1')) {
      //     missingFields.push('Enroll Link (must be a public URL, not localhost)');
      //   }
      // } catch (_) {
      //   missingFields.push('Enroll Link (must be a valid URL)');
      // }
    // }

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Convert files to base64
      let instructorPhotoBase64 = formData.instructorPhoto;
      let coursePhotoBase64 = formData.coursePhoto;
      
      if (formData.instructorPhoto instanceof File) {
        instructorPhotoBase64 = await handleFileToBase64(formData.instructorPhoto);
      }
      if (formData.coursePhoto instanceof File) {
        coursePhotoBase64 = await handleFileToBase64(formData.coursePhoto);
      }
      
      // Clean and validate data before sending
      const prerequisites = formData.prerequisites
        .map(p => p.trim())
        .filter(Boolean);
      
      const learningObjectives = formData.learningObjectives
        .map(o => o.trim())
        .filter(Boolean);

      if (prerequisites.length === 0) {
        setError('Prerequisites cannot be empty');
        return;
      }

      if (learningObjectives.length === 0) {
        setError('Learning Objectives cannot be empty');
        return;
      }
      
      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructor: formData.instructor.trim(),
        duration: formData.duration.trim(),
        price: Number(formData.price),
        status: formData.status,
        details: formData.details.trim(),
        prerequisites,
        learningObjectives,
        assessments: formData.assessments.trim(),
        format: formData.format.trim(),
        level: formData.level.trim(),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        // enrollLink: formData.enrollLink.trim(),
        instructorPhoto: instructorPhotoBase64,
        coursePhoto: coursePhotoBase64,
      };
      
      // Debug log
      console.log('Sending data:', JSON.stringify(dataToSend, null, 2));
      
      if (editingCourse) {
        await axios.put(`${baseUrl}/api/courses/${editingCourse._id}`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        try {
          const response = await axios.post(`${baseUrl}/api/courses`, dataToSend, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Response:', response.data);
        } catch (err) {
          const error = err as { 
            response?: { 
              data?: { 
                errors?: Array<{ msg: string; param?: string }> 
              } 
            } 
          };
          console.error('Detailed error:', JSON.stringify(error.response?.data, null, 2));
          throw err;
        }
      }
      
      fetchCourses();
      setShowAddModal(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        instructor: '',
        duration: '',
        price: 0,
        thumbnail: '',
        status: 'active',
        instructorPhoto: '',
        coursePhoto: '',
        details: '',
        prerequisites: [],
        learningObjectives: [],
        assessments: '',
        format: '',
        level: '',
        rating: 0,
        reviews: 0,
        // enrollLink: '',
        userReviews: []
      });
    } catch (err) {
      console.error('Error saving course:', err);
      const error = err as { 
        response?: { 
          data?: { 
            errors?: Array<{ msg: string; param?: string }> 
          } 
        } 
      };
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(e => e.param ? `${e.param}: ${e.msg}` : e.msg)
          .join(', ');
        setError(`Failed to save course: ${errorMessages}`);
      } else {
        setError('Failed to save course');
      }
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      price: course.price,
      thumbnail: course.thumbnail,
      status: course.status,
      instructorPhoto: course.instructorPhoto,
      coursePhoto: course.coursePhoto,
      details: course.details,
      prerequisites: course.prerequisites,
      learningObjectives: course.learningObjectives,
      assessments: course.assessments,
      format: course.format,
      level: course.level,
      rating: course.rating,
      reviews: course.reviews,
      // enrollLink: course.enrollLink,
      userReviews: course.userReviews
    });
    setShowAddModal(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${baseUrl}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
    }
  };

  const handleArrayInput = (field: keyof typeof formData, value: string) => {
    // Split by both commas and newlines
    const items = value.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: items });
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading courses..." size="large" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              title: '',
              description: '',
              instructor: '',
              duration: '',
              price: 0,
              thumbnail: '',
              status: 'active',
              instructorPhoto: '',
              coursePhoto: '',
              details: '',
              prerequisites: [],
              learningObjectives: [],
              assessments: '',
              format: '',
              level: '',
              rating: 0,
              reviews: 0,
              // enrollLink: '',
              userReviews: []
            });
            setShowAddModal(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={course.coursePhoto || course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPiA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gaW1hZ2U8L3RleHQ+IDwvc3ZnPg==';
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                <p className="text-sm text-gray-500">Duration: {course.duration}</p>
                <p className="text-sm font-semibold text-orange-600">₹{course.price}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-orange-600 hover:text-orange-900"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white text-gray-900">
              {editingCourse ? 'Edit Course' : 'Add Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, instructorPhoto: file });
                      }
                    }}
                    className="mt-1 block w-full text-gray-900"
                    required={!editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, coursePhoto: file });
                      }
                    }}
                    className="mt-1 block w-full text-gray-900"
                    required={!editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prerequisites (one per line or comma-separated)</label>
                  <textarea
                    value={formData.prerequisites.join('\n')}
                    onChange={(e) => handleArrayInput('prerequisites', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Learning Objectives (one per line or comma-separated)</label>
                  <textarea
                    value={formData.learningObjectives.join('\n')}
                    onChange={(e) => handleArrayInput('learningObjectives', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assessments</label>
                  <textarea
                    value={formData.assessments}
                    onChange={(e) => setFormData({ ...formData, assessments: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Format</option>
                    <option value="Video">Video</option>
                    <option value="Interactive">Interactive</option>
                    <option value="Text-based">Text-based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Duration</option>
                    <option value="Short">Short</option>
                    <option value="Medium">Medium</option>
                    <option value="Long">Long</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Enroll Link</label>
                  <input
                    type="url"
                    value={formData.enrollLink}
                    onChange={(e) => setFormData({ ...formData, enrollLink: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div> */}
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
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  {editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 