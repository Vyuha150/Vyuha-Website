"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import Vision from "@/components/Vision";
import Achievements from "../components/Achievements";
import Services from "@/components/Services";
import AnimatedTestimonials from "@/components/ui/AnimatedTestimonals";
import testimonialData from "@/data";
import CTA from "@/components/CTA";
import SocialMedia from "@/components/SocialMedia";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star } from "lucide-react";

const Page = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  return (
    <>
      <Hero />
      <section className="text-center py-12 bg-black text-white ">
        <h1 className="text-4xl font-bold mb-4">
          WE CONQUER THE KNOWN AND FORGE THE UNKNOWN
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          VYUHA guides you to break free from conditioning, cultivate
          self-awareness, and achieve lasting transformation.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-all"
          onClick={() => (window.location.href = "/quiz")}
        >
          Begin Your Journey
        </button>
      </section>
      <Vision />
      <Achievements />
      <Card className="bg-transparent text-white border-none max-w-5xl mx-auto py-12 px-4 border-none">
        <div className="inline-block mb-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm text-xs font-medium text-orange-200 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Star size={12} className="text-orange-400" />
                <span>Founder</span>
              </div>
            </div>
        <CardContent className="p-8">
          <div className="text-center text-5xl font-bold mb-6">About Our Founder</div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src="/anna.png" // <-- update this path to your image
                alt="J.V. Kalyan"
                width={380}
                height={380}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                J.V. Kalyan
              </h1>
              <h2 className="text-lg text-muted-foreground mb-2">
                (Venkat Kalyan Javvaji)
              </h2>
              <Badge variant="secondary" className="mb-4">
                Founder & Chairman, Vyuha Innovation Foundation
              </Badge>
              <p className="mb-4 text-base leading-relaxed">
                J.V. Kalyan is a forward-thinking youth leader and innovation
                strategist committed to redefining education, leadership, and
                civic responsibility in India. He is the Founder and Chairman of
                Vyuha Innovation Foundation, a youth-centric organization based
                in Andhra Pradesh, focused on empowering students and young
                professionals through conscious leadership, digital
                transformation, and grassroots innovation.
              </p>
              <p className="mb-4 text-base leading-relaxed">
                With a strong belief in creating systemic change through
                collective intelligence and practical action, Kalyan has
                dedicated his life to nurturing a new generation of self-aware,
                socially responsible, and purpose-driven individuals. His work
                bridges the worlds of policy, education, and technology to
                create sustainable, scalable impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Services />
      <AnimatedTestimonials testimonials={testimonialData} autoplay={true} />
      <CTA />
      <SocialMedia />
    </>
  );
};

export default Page;
