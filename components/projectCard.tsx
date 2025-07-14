"use client";

import React from "react";

interface ProjectCardProps {
  project: {
    _id: any;
    title: string;
    image: string;
    skills: string[];
    deadline: string;
    description: string;
    difficulty: string;
    teamSize: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Project Image */}
      <div className="w-full h-48 relative">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-orange-500">
          {project.title}
        </h2>
        <p className="text-sm text-gray-400 mb-2">{project.description}</p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Skills:</strong> {project.skills.join(", ")}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Deadline:</strong>{" "}
          {new Date(project.deadline).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Difficulty:</strong> {project.difficulty}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Team Size:</strong> {project.teamSize}
        </p>
        <a
          href={`/projects/${project._id}`}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg inline-block mt-4"
        >
          View Details
        </a>
      </div>
    </div>
  );
}
