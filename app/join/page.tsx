"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Award, Users, Megaphone, Rocket, GraduationCap } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  collegeUniversity: z.string().min(2, "College/University name is required"),
  organizationType: z.string().min(1, "Please select organization type"),
  activeMembers: z.string().min(1, "Number of active members is required"),
  pastEvents: z.string().min(10, "Please provide details about past events"),
  contactName: z.string().min(2, "Contact person's name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  logo: z.any().optional(),
});

export default function JoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      organizationName: "",
      collegeUniversity: "",
      organizationType: "",
      activeMembers: "",
      pastEvents: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      logo: [],
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("organizationName", values.organizationName);
      formData.append("collegeUniversity", values.collegeUniversity);
      formData.append("organizationType", values.organizationType);
      formData.append("activeMembers", values.activeMembers);
      formData.append("pastEvents", values.pastEvents);
      formData.append("contactName", values.contactName);
      formData.append("contactEmail", values.contactEmail);
      formData.append("contactPhone", values.contactPhone);

      if (values.logo && values.logo[0]) {
        formData.append("logo", values.logo[0]); // Append the logo file
      }

      // Send the form data to the backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organization/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Registration submitted successfully!");
        form.reset(); // Reset the form
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message ||
          "Error submitting form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Nationwide Recognition",
      description: "Get visibility across India's largest student network",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration Opportunities",
      description: "Connect with like-minded organizations and leaders",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "Event Promotion",
      description: "Promote your events to a wider audience effortlessly",
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Free Access to Programs",
      description: "Access premium upskilling programs at no cost",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Community Network",
      description: "Join India's largest student community network",
    },
  ];

  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Register Your Organization on Vyuha
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your student group deserves a larger stage. Join the Vyuha Network
              and unlock a world of opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Register?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ translateY: -8 }}
              >
                <Card className="p-6 h-full bg-black text-white hover:shadow-orange-500 transition-all duration-300 hover:-translate-y-2 hover:border-none hover:shadow-lg transform">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-black text-white hover:shadow-orange-500/50 transition-shadow duration-300 hover:border-none hover:shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-orange-500">
                Registration Form
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collegeUniversity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College/University Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter college/university name"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-black text-white border-gray-700">
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white border-gray-700">
                              <SelectItem value="studentClub">
                                Student Club
                              </SelectItem>
                              <SelectItem value="ngo">NGO</SelectItem>
                              <SelectItem value="startup">Startup</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activeMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Active Members</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter number of active members"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pastEvents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Past Events</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details about past events"
                            rows={4}
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact person's name"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact email"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact phone number"
                            {...field}
                            className="bg-black text-white border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Logo (Optional)</FormLabel>
                        <FormControl className="cursor-pointer">
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(
                                e.target.files ? e.target.files : []
                              )
                            }
                            className="bg-black text-white border-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
