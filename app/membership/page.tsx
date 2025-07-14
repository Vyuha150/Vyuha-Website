"use client";


import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Star, Users, Building2, GraduationCap } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function MembershipPage() {

  const membershipTypes = [
    {
      id: "collaborator",
      title: "Vyuha Collaborators",
      price: "₹500",
      icon: <Users className="w-6 h-6" />,
      benefits: [
        "Virtual Certificate",
        "Digital Badge",
        "Access to Events",
        "Networking Opportunities",
      ],
    },
    {
      id: "business",
      title: "Vyuha Business",
      price: "₹3000",
      icon: <Building2 className="w-6 h-6" />,
      benefits: [
        "Business Network Access",
        "Event Sponsorship",
        "Mentorship Opportunities",
        "Premium Support",
      ],
    },
    {
      id: "college",
      title: "Vyuha College Connect (VCC)",
      price: "₹150",
      icon: <GraduationCap className="w-6 h-6" />,
      benefits: [
        "Virtual Certificate",
        "Digital Badge",
        "Club Activities",
        "Student Resources",
      ],
    },
    {
      id: "women-empowerment",
      title: "Vyuha Women Empowerment",
      price: "Free",
      icon: <Badge className="w-6 h-6" />,
      benefits: [
        "Empowerment Programs",
        "Skill Development Workshops",
        "Networking Opportunities",
        "Community Support",
      ],
    },
    {
      id: "political-action",
      title: "Vyuha Political Action Committee",
      price: "₹100",
      icon: <Star className="w-6 h-6" />,
      benefits: [
        "Political Awareness Programs",
        "Leadership Training",
        "Policy Discussions",
        "Exclusive Events",
      ],
    },
    {
      id: "corporate-coolies",
      title: "Vyuha Corporate Coolies",
      price: "₹777",
      icon: <Star className="w-6 h-6" />,
      benefits: [
        "Corporate Networking",
        "Exclusive Workshops",
        "Premium Resources",
        "Special Recognition",
      ],
    },
    {
      id: "influencer",
      title: "Vyuha Influencer",
      price: "₹250",
      icon: <Star className="w-6 h-6" />,
      benefits: [
        "Influencer Network Access",
        "Event Sponsorship",
        "Mentorship Opportunities",
        "Premium Support",
      ],
    },
  ];

  return (
    <main className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Join Vyuha Membership</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the membership that best fits your needs and join our
            community of innovators, entrepreneurs, and change-makers.
          </p>
          <p className="mt-4 text-lg text-orange-400 font-semibold">
            <span className="inline-block align-middle mr-2">🎫</span>
            <span>
              All registered members will receive an{" "}
              <b>instant digital ID card</b> and <b>certificate</b> upon
              successful registration.
            </span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {membershipTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px] min-h-[275px] flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {type.title}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-orange-400 mb-4">
                  {type.price}
                </p>
                <ul className="space-y-2 mb-6">
                  {type.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <Star className="w-4 h-4 text-orange-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href={`/membership/apply?type=${type.id}`}>
                  <Button className="w-50  bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                    Join Now
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
