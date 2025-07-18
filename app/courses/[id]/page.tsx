"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import axios from "axios";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await axios.get(`${apiUrl}/api/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // No enroll API, just close modal and show alert
  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enrollment is handled externally. Please use the enroll link below.");
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-black/50 p-8 rounded-lg shadow-lg">
        {/* Course Title */}
        <h1 className="text-4xl font-bold text-orange-500 mb-6">
          {course.title}
        </h1>

        {/* Instructor Info */}
        <div className="flex items-center mb-8">
          <img
            src={course.instructorPhoto}
            alt={course.instructor}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{course.instructor}</h2>
            <p className="text-gray-400 text-sm">Instructor</p>
          </div>
        </div>

        {/* Course Image */}
        {course.coursePhoto && (
          <div className="mb-8">
            <img
              src={course.coursePhoto}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Course Description */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            Course Description
          </h3>
          <p className="text-gray-300">{course.details}</p>
        </section>

        {/* Prerequisites */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            Prerequisites
          </h3>
          <ul className="list-disc list-inside text-gray-300">
            {course.prerequisites?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Learning Objectives */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            Learning Objectives
          </h3>
          <ul className="list-disc list-inside text-gray-300">
            {course.learningObjectives?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Assessments */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            Assessments
          </h3>
          <p className="text-gray-300">{course.assessments}</p>
        </section>

        {/* User Reviews */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            User Reviews
          </h3>
          <div className="space-y-4">
            {course.userReviews?.map((review: any, index: number) => (
              <div
                key={index}
                className="bg-black border border-gray-600 p-4 rounded-lg hover:shadow-orange-500 hover:border-none shadow-md"
              >
                <p className="text-gray-300">
                  <span className="font-semibold">{review.user}:</span>{" "}
                  {review.comment}
                </p>
                <p className="text-orange-500">⭐ {review.rating}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Price and Action Buttons */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-black shadow-lg p-6 rounded-lg">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-semibold text-orange-500">
              Price: ₹{course.price}
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href={course.enrollLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-center"
            >
              Enroll Externally
            </a>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
              Add to Wishlist
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
