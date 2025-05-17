"use client";

import React from "react";
import { testimonials } from "@/data/testimonialsData"; // Import testimonials data

export default function Testimonials() {
  return (
    <section className="text-white py-12 px-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-orange-500 mb-6">Testimonials</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Hear from our community members about their experiences with Vyuha.
        These stories showcase the impact we've made together.
      </p>

      {/* Testimonials Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-4 bg-black border border-gray-700 rounded-lg shadow-md hover:border-transparent hover:shadow-orange-500 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-bold text-orange-500">
              {testimonial.name}
            </h3>
            <p className="text-gray-400 text-sm mb-2">{testimonial.role}</p>
            <p className="text-gray-300 mt-2 italic">
              "{testimonial.testimonial}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
