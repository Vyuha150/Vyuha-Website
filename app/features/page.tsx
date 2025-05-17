"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  Calendar,
  Rocket,
  Award,
  Handshake,
  Share2,
  Globe,
  Briefcase,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Organization Connect",
      description:
        "Break the boundaries of your campus. Connect with student bodies across colleges, states, and countries.",
      highlight: "Expand your network. Share ideas. Co-create impact.",
      link: "/organizations",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Portal",
      description:
        "Plan and promote like a pro. Vyuha offers a centralized dashboard to post, manage, and boost student-led events.",
      highlight:
        "Seminars, tech fests, social drives, cultural meetups, and more.",
      link: "/events",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Skill Development",
      description:
        "Boost your team's capabilities with certified workshops, digital tools, and leadership bootcamps tailored for student organizations.",
      highlight:
        "Exclusive access to digital marketing, communication, and event management programs.",
      link: "/courses",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Spotlight & Recognition",
      description:
        "Your work deserves applause. Get recognized for your innovation, impact, and student-led movements.",
      highlight:
        "Digital badges, features on Vyuha socials, and leadership showcases.",
      link: "/projects",
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Partner with NGOs & Startups",
      description:
        "Vyuha acts as a bridge between student communities and real-world changemakers.",
      highlight: "Partner for impact projects, internships, and initiatives.",
      link: "/membership",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Work with Experts",
      description:
        "Collaborate with retired scientists, professionals, and government administrators.",
      highlight: "Gain insights and mentorship from experienced leaders.",
      link: "/mentorship",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Shape the World",
      description:
        "Be a part of prestigious projects capable of making a global impact.",
      highlight: "Contribute to initiatives that drive meaningful change.",
      link: "/projects",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              What Can You Do on Vyuha?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore powerful features designed to empower student
              organizations, connect like-minded leaders, and foster real-world
              impact. Vyuha is where youth potential meets opportunity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  rotate: 1,
                  boxShadow: "0px 10px 20px rgba(255, 165, 0, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full bg-black/70 text-white hover:shadow-orange-500 transition-all duration-300 hover:border-none rounded-lg">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-4">{feature.description}</p>
                    <p className="text-sm font-medium text-orange-500 mb-6">
                      {feature.highlight}
                    </p>
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white transition-all"
                    >
                      <Link href={feature.link}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join Vyuha today and unlock a world of opportunities for your
            student organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-orange-500 text-white hover:bg-orange-600 transition-all hover:scale-105"
            >
              <Link href="/join">Register Organization</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-orange-500 text-white hover:bg-orange-600 transition-all hover:scale-105"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
