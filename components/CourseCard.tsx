"use client";

import React from "react";
import Link from "next/link";

interface Course {
  _id: any;
  title: string;
  instructor: string;
  instructorPhoto: string;
  coursePhoto?: string;
  rating: number;
  reviews: number;
  price: string;
  format: string;
  description: string;
  duration: string;
  level: string;
  status?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-black border border-gray-700 rounded-lg shadow-lg hover:shadow-orange-500 transition-all overflow-hidden hover:scale-105 transform duration-300">
      {/* Course Image */}
      <div className="relative h-40 bg-gray-700">
        <img
          src={course.coursePhoto || `/course${1 || course._id}.jpg`}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPiA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q291cnNlIEltYWdlPC90ZXh0PiA8L3N2Zz4=';
          }}
        />
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {course.format}
        </span>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-white mb-2">
          <Link href={`/courses/${course._id}`}>{course.title}</Link>
        </h2>

        {/* Instructor Info */}
        <div className="flex items-center mb-4">
          <img
            src={course.instructorPhoto}
            alt={course.instructor}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-400">{course.instructor}</span>
        </div>

        {/* Ratings */}
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span className="mr-2">⭐ {course.rating}</span>
          <span>({course.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="text-sm text-orange-500 font-semibold mb-4">
          {course.price}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4">{course.description}</p>

        {/* Action Button */}
        <Link href={`/courses/${course._id}`}>
          <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
