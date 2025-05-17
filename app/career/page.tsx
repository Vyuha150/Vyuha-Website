"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import SearchBar from "@/components/SearchBar";
import ResumeBuilder from "@/components/ResumeBuilder";
import CompanyCard from "@/components/CompanyCard";

export default function CareerServicesPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch jobs from the backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await axios.get(`${apiUrl}/api/job-application`);
        setJobs(response.data);
        console.log("Jobs fetched:", response.data);
        setFilteredJobs(response.data);
        setIsLoadingJobs(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setIsLoadingJobs(false);
      }
    }

    fetchJobs();
  }, [apiUrl]);

  // Fetch companies from the backend
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await axios.get(`${apiUrl}/api/companies`);
        setCompanies(response.data);
        setIsLoadingCompanies(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
        setIsLoadingCompanies(false);
      }
    }

    fetchCompanies();
  }, [apiUrl]);

  const handleFilterChange = (filters: { [key: string]: string }) => {
    const filtered = jobs.filter((job: any) => {
      const matchesLocation =
        !filters.location || job.location.includes(filters.location);
      const matchesJobType =
        !filters.jobType || job.jobType === filters.jobType;
      const matchesIndustry =
        !filters.industry || job.industry === filters.industry;

      return matchesLocation && matchesJobType && matchesIndustry;
    });

    setFilteredJobs(filtered);
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8 mt-6">
      {/* Career Services Introduction */}
      <section className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Career Services
        </h1>
        <p className="text-gray-300 leading-relaxed">
          Explore job opportunities, build your resume, and connect with top
          companies to advance your career.
        </p>
        <div className="mt-6 flex space-x-4">
          <a
            href="#jobs"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Explore Jobs
          </a>
          <a
            href="#resume"
            className="bg-transparent border border-white hover:bg-orange-500 hover:border-none text-white py-2 px-4 rounded-lg"
          >
            Build Resume
          </a>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="jobs" className="max-w-7xl mx-auto mb-12">
        <h2 className="text-4xl font-bold text-white mb-6">Job Listings</h2>
        <SearchBar placeholder="Search jobs..." />
        <JobFilters onFilterChange={handleFilterChange} />
        {isLoadingJobs ? (
          <p className="text-gray-300">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredJobs.map((job: any) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Resume Builder Section */}
      <section
        id="resume"
        className="flex justify-center items-center mx-auto mb-12"
      >
        <ResumeBuilder />
      </section>

      {/* Company Profiles Section */}
      <section id="companies" className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6">
          Featured Companies
        </h2>
        {isLoadingCompanies ? (
          <p className="text-gray-300">Loading companies...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company: any) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
