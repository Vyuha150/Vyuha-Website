"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "@/components/projectCard";
import Filters from "@/components/ProjectFilters";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]); // State to store all projects
  const [filteredProjects, setFilteredProjects] = useState([]); // State for filtered projects
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Backend API URL
        const response = await axios.get(`${apiUrl}/api/projects`);
        setProjects(response.data);
        setFilteredProjects(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: { [key: string]: string }) => {
    const filtered = projects.filter((project: any) => {
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

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-300">Loading projects...</div>
      )}

      {/* Error State */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Project Listings */}
      {!isLoading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
