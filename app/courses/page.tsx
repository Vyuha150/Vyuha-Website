"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "@/components/CourseCard";
import Filters from "@/components/CourseFilters";

// Define the type for the filters object
interface Filters {
  level?: string;
  duration?: string;
  price?: string;
  format?: string;
  search?: string;
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from API on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await axios.get(`${apiUrl}/api/courses`);
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFilterChange = (filters: Filters) => {
    const filtered = courses.filter((course) => {
      const matchesLevel =
        !filters.level ||
        course.level?.toLowerCase() === filters.level.toLowerCase();
      const matchesDuration =
        !filters.duration ||
        course.duration?.toLowerCase() === filters.duration.toLowerCase();
      const matchesPrice =
        !filters.price ||
        course.price?.toLowerCase() === filters.price.toLowerCase();
      const matchesFormat =
        !filters.format ||
        course.format?.toLowerCase() === filters.format.toLowerCase();
      const matchesSearch =
        !filters.search ||
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchesLevel &&
        matchesDuration &&
        matchesPrice &&
        matchesFormat &&
        matchesSearch
      );
    });

    setFilteredCourses(filtered);
  };

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {/* Course Listings */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-gray-400">Loading...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            No courses found.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))
        )}
      </div>
    </main>
  );
}
