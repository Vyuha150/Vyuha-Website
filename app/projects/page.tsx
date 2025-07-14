"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "@/components/projectCard";
import Filters from "@/components/ProjectFilters";
import Link from "next/link";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: string;
  teamSize: string;
  deadline: string;
  goals: string[];
  deliverables: string[];
  evaluationCriteria: string[];
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/api/projects`);
        const activeProjects = response.data.filter((project: Project) => project.status === 'active');
        setProjects(activeProjects);
        setFilteredProjects(activeProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: { [key: string]: string }) => {
    const filtered = projects.filter((project) => {
      const matchesDifficulty =
        !filters.difficulty ||
        project.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
      const matchesTeamSize =
        !filters.teamSize ||
        project.teamSize.toLowerCase() === filters.teamSize.toLowerCase();

      return matchesDifficulty && matchesTeamSize;
    });

    setFilteredProjects(filtered);
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
            Projects
          </h1>
          <Link
            href="/projects/create-project"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
          >
            + Create Project
          </Link>
        </div>
        <p className="text-gray-300 mt-2">
          Browse through the list of projects or create a new one to get
          started.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {/* Project Listings */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-gray-400">Loading projects...</div>
        ) : error ? (
          <div className="col-span-3 text-center text-red-500">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">No projects found.</div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={{
              ...project,
              image: project.image || '/placeholder-project.jpg'
            }} />
          ))
        )}
      </div>
    </main>
  );
}