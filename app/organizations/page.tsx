"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Award,
  CheckCircle,
  Clock,
  Instagram,
  Linkedin,
  Youtube,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@radix-ui/react-label";

// Invite Form Schema
const inviteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().optional(),
});

// Join Form Schema
const joinSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  domain: z.string().min(2, "Domain is required"),
  region: z.string().min(2, "Region is required"),
});

interface Organization {
  id: number;
  logo: string;
  name: string;
  domain: string;
  description: string;
  social: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  eventsHosted: number;
  verified: boolean;
  region?: string; // Optional, in case some orgs don't have it
}

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  function filterOrganizations(orgs: Organization[]): Organization[] {
    return orgs.filter((org) => {
      const matchesSearch = org.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDomain = domainFilter
        ? org.domain.toLowerCase() === domainFilter.toLowerCase()
        : true;
      const matchesRegion = regionFilter
        ? org.region?.toLowerCase() === regionFilter.toLowerCase()
        : true;
      return matchesSearch && matchesDomain && matchesRegion;
    });
  }

  const featuredOrgs = [
    {
      id: 1,
      logo: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      name: "TechMinds Club",
      domain: "Tech",
      region: "Maharashtra", // Add region
      description:
        "Fostering innovation and technical excellence through workshops and hackathons.",
      social: {
        instagram: "techminds",
        linkedin: "techminds-club",
        youtube: "techminds",
      },
      eventsHosted: 25,
      verified: true,
    },
    {
      id: 2,
      logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      name: "Cultural Connect",
      domain: "Cultural",
      region: "Karnataka",
      description:
        "Celebrating diversity and promoting cultural exchange through events and performances.",
      social: {
        instagram: "culturalconnect",
        linkedin: "cultural-connect",
        youtube: "culturalconnect",
      },
      eventsHosted: 18,
      verified: true,
    },
    {
      id: 3,
      logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      name: "Social Impact Hub",
      domain: "Social",
      region: "Delhi",

      description:
        "Driving positive change through community service and social initiatives.",
      social: {
        instagram: "socialimpacthub",
        linkedin: "social-impact-hub",
        youtube: "socialimpacthub",
      },
      eventsHosted: 15,
      verified: false,
    },
  ];

  const newlyJoined = [
    {
      id: 4,
      logo: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
      name: "Entrepreneurship Cell",
      domain: "Entrepreneurship",
      region: "Maharashtra",

      description:
        "Nurturing the next generation of business leaders and innovators.",
      social: {
        instagram: "ecell",
        linkedin: "entrepreneurship-cell",
        youtube: "ecell",
      },
      eventsHosted: 5,
      verified: false,
    },
    {
      id: 5,
      logo: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
      name: "Design Club",
      domain: "Tech",
      region: "Tamil Nadu",

      description:
        "Exploring creativity through UI/UX design and digital arts.",
      social: {
        instagram: "designclub",
        linkedin: "design-club",
        youtube: "designclub",
      },
      eventsHosted: 3,
      verified: false,
    },
  ];

  const InviteForm = () => {
    const [success, setSuccess] = useState(false);
    const form = useForm<z.infer<typeof inviteSchema>>({
      resolver: zodResolver(inviteSchema),
      defaultValues: { name: "", phone: "", email: "", message: "" },
    });

    const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
      // TODO: Replace with your API call
      setSuccess(true);
      form.reset();
    };

    return (
      <Card className="mb-8 bg-black/50 text-white">
        <CardHeader>
          <CardTitle>Invite an Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">Your Name:</Label>
              <Input
                placeholder="Your Name"
                {...form.register("name")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Your Phone Number:
              </Label>
              <Input
                placeholder="Your Phone Number"
                {...form.register("phone")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Organization Email:
              </Label>
              <Input
                placeholder="Organization Email"
                {...form.register("email")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Optional message to the organization:
              </Label>
              <Input
                placeholder="Message (optional)"
                {...form.register("message")}
              />
            </div>
            <Button type="submit" className="bg-orange-500 text-white">
              Send Invite
            </Button>
            {success && (
              <span className="text-green-500 text-sm mt-2">
                Invitation sent!
              </span>
            )}
          </form>
        </CardContent>
      </Card>
    );
  };

  const JoinForm = () => {
    const [success, setSuccess] = useState(false);
    const form = useForm<z.infer<typeof joinSchema>>({
      resolver: zodResolver(joinSchema),
      defaultValues: { name: "", email: "", domain: "", region: "" },
    });

    const onSubmit = async (values: z.infer<typeof joinSchema>) => {
      // TODO: Replace with your API call
      setSuccess(true);
      form.reset();
    };

    return (
      <Card className="mb-8 bg-black/50 text-white">
        <CardHeader>
          <CardTitle>Join as an Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Fill in the details of your organization:
              </Label>
              <Input
                placeholder="Organization Name"
                {...form.register("name")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">Contact Email:</Label>
              <Input
                placeholder="Contact Email"
                {...form.register("email")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Domain of Interest:
              </Label>
              <Input
                placeholder="Domain"
                {...form.register("domain")}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-400">
                Region/State of Operation:
              </Label>
              <Input
                placeholder="Region/State"
                {...form.register("region")}
                required
              />
            </div>
            <Button type="submit" className="bg-orange-500 text-white">
              Join Network
            </Button>
            {success && (
              <span className="text-green-500 text-sm mt-2">
                Registration submitted!
              </span>
            )}
          </form>
        </CardContent>
      </Card>
    );
  };

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
              Explore & Connect with Student Communities
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet other student-led clubs, explore their work, and build
              powerful cross-campus collaborations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select onValueChange={(val) => setDomainFilter(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent className="bg-transparent text-white">
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Entrepreneurship">
                  Entrepreneurship
                </SelectItem>
                <SelectItem value="Social">Social</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setRegionFilter(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Region/State" />
              </SelectTrigger>
              <SelectContent className="bg-transparent text-white">
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Featured Organizations */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Organizations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterOrganizations(featuredOrgs).map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ translateY: -8 }}
              >
                <Card className="overflow-hidden bg-black text-white hover:shadow-orange-500/50 transition-shadow duration-300 hover:border-none hover:shadow-lg hover:-translate-y-2">
                  <div className="aspect-video relative">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                    {org.verified && (
                      <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle>{org.name}</CardTitle>
                      <Badge variant="default">{org.domain}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">{org.description}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`https://instagram.com/${org.social.instagram}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Instagram className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`https://linkedin.com/company/${org.social.linkedin}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`https://youtube.com/${org.social.youtube}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Youtube className="w-5 h-5" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{org.eventsHosted} Events Hosted</span>
                      </div>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2">
                      <Send className="w-4 h-4" />
                      Invite to Collaborate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newly Joined */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Newly Joined</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterOrganizations(newlyJoined).map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ translateY: -8 }}
              >
                <Card className="overflow-hidden bg-black text-white hover:shadow-orange-500/50 transition-shadow duration-300 hover:-translate-y-2">
                  <div className="aspect-video relative">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle>{org.name}</CardTitle>
                      <Badge variant="default">{org.domain}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">{org.description}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`https://instagram.com/${org.social.instagram}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Instagram className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`https://linkedin.com/company/${org.social.linkedin}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`https://youtube.com/${org.social.youtube}`}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Youtube className="w-5 h-5" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{org.eventsHosted} Events Hosted</span>
                      </div>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2">
                      <Send className="w-4 h-4" />
                      Invite to Collaborate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8  text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Network?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Register your organization and become part of India's largest
            student community network.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-orange-500 text-white hover:bg-orange-600 hover:scale-105"
          >
            <Link href="/join">Register Your Organization</Link>
          </Button>
        </div>
      </section>

      {/* Invite & Join Forms */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <InviteForm />
          <JoinForm />
        </div>
      </section>
    </main>
  );
}
