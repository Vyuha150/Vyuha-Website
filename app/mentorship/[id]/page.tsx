"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

export default function MentorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [mentor, setMentor] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({
    user: "",
    rating: 0,
    comment: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    params.then(async (resolvedParams) => {
      const mentorId = resolvedParams.id;

      try {
        // Fetch mentor details
        const mentorResponse = await axios.get(
          `${apiUrl}/api/mentors/${mentorId}`
        );
        setMentor(mentorResponse.data);

        // Fetch reviews
        const reviewsResponse = await axios.get(
          `${apiUrl}/api/mentors/${mentorId}/reviews`
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching mentor details or reviews:", error);
      }
    });
  }, [params]);

  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    try {
      const response = await axios.post(
        `${apiUrl}/api/mentors/${mentor._id}/book`,
        {
          email,
          phone,
          date,
          time,
          message,
        }
      );

      if (response.status === 201) {
        toast.success(`Session booked with ${mentor.name}!`);
        closeBookingModal();
      } else {
        toast.error("Failed to book session. Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error booking session:", error);
        toast.error("An error occurred while booking the session.");
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/api/mentors/${mentor._id}/reviews`,
        newReview
      );

      if (response.status === 201) {
        setReviews([...reviews, response.data]); // Add the new review to the list
        setNewReview({ user: "", rating: 0, comment: "" });
        closeReviewModal();
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  if (!mentor) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Mentor not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 mt-12 bg-black text-white rounded-lg">
      {/* Mentor Banner */}
      <div className="relative mb-12">
        <img
          src={`${apiUrl}${mentor.photo}`}
          alt={mentor.name}
          className="w-full h-80 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
        <h1 className="absolute bottom-4 left-4 text-4xl font-bold text-orange-500 drop-shadow-lg">
          {mentor.name}
        </h1>
      </div>

      {/* Mentor Details */}
      <div className="p-8 rounded-lg shadow-lg">
        {/* Industry and Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            About {mentor.name}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <strong>Industry:</strong> {mentor.industry}
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            <strong>Skills:</strong> {mentor.skills.join(", ")}
          </p>
        </section>

        {/* Reviews Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Reviews</h2>

          {/* Display Existing Reviews */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <p className="text-sm text-gray-400">
                    <strong>User:</strong> {review.user}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Rating:</strong> {review.rating} / 5
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Comment:</strong> {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No reviews yet. Be the first to leave one!
            </p>
          )}

          {/* Add Review Button */}
          <button
            onClick={openReviewModal}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Add Review
          </button>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Experience
          </h2>
          <p className="text-gray-300 leading-relaxed">{mentor.experience}</p>
        </section>

        {/* Mentorship Style */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Mentorship Style
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {mentor.mentorshipStyle}
          </p>
        </section>

        {/* Availability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Availability
          </h2>
          <p className="text-gray-300 leading-relaxed">{mentor.availability}</p>
        </section>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={openBookingModal}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Book Mentor
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
            Express Interest
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-md border border-orange-500">
            <h2 className="text-xl font-bold mb-4">
              Book a Session with {mentor.name}
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                  placeholder="Add a message for the mentor..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-md border border-orange-500">
            <h2 className="text-xl font-bold mb-4">Add a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  value={newReview.user}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, user: e.target.value }))
                  }
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={newReview.rating || ""} // Ensure the value is a string or empty
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      rating: e.target.value ? parseInt(e.target.value) : 0,
                    }))
                  }
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                />
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  required
                  className="w-full bg-transparent border border-white rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-[6px]"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
