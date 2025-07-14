"use client";

import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PodcastCardProps {
  podcast: {
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
  };
  onEdit: (podcast: any) => void;
  onDelete: (id: string) => void;
  onComplete?: (podcast: any) => void;
}

export default function PodcastCard({ podcast, onEdit, onDelete, onComplete }: PodcastCardProps) {
  const isRequested = podcast.requested && podcast.status === 'requested';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {isRequested ? `Request from ${podcast.name}` : podcast.title}
          </h3>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${
              podcast.status === 'active' ? 'bg-green-100 text-green-800' :
              podcast.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {podcast.status === 'requested' ? 'Requested' : 
               podcast.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {isRequested && onComplete && (
            <button
              onClick={() => onComplete(podcast)}
              className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onEdit(podcast)}
            className="text-orange-600 hover:text-orange-900"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(podcast._id)}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Contact Information */}
        <div className="text-sm text-gray-600">
          <p><strong>Name:</strong> {podcast.name}</p>
          <p><strong>Email:</strong> {podcast.email}</p>
          <p><strong>Phone:</strong> {podcast.phoneNumber}</p>
        </div>

        {/* Podcast Details (if completed) */}
        {!isRequested && (
          <>
            {podcast.description && (
              <p className="text-sm text-gray-600 mt-2">{podcast.description}</p>
            )}
            
            {podcast.host && (
              <div className="flex items-center space-x-2 mt-2">
                {podcast.hostPhoto && (
                  <img
                    src={podcast.hostPhoto}
                    alt={podcast.host}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-gray-600">{podcast.host}</span>
              </div>
            )}

            {podcast.thumbnail && (
              <div className="mt-2">
                <img
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
              {podcast.duration && <p><strong>Duration:</strong> {podcast.duration}</p>}
              {podcast.category && <p><strong>Category:</strong> {podcast.category}</p>}
              {podcast.language && <p><strong>Language:</strong> {podcast.language}</p>}
              {podcast.releaseDate && (
                <p><strong>Release Date:</strong> {new Date(podcast.releaseDate).toLocaleDateString()}</p>
              )}
            </div>

            {podcast.audioUrl && (
              <div className="mt-2">
                <audio controls className="w-full">
                  <source src={podcast.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {podcast.tags && podcast.tags.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {podcast.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <span>👁 {podcast.views} views</span>
              <span>❤️ {podcast.likes} likes</span>
            </div>
          </>
        )}

        {/* Created Date */}
        <p className="text-xs text-gray-500 mt-4">
          {isRequested ? 'Requested' : 'Created'} on {new Date(podcast.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 