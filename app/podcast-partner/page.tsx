"use client";

import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// Define the schema for the form
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.string().min(10, "Number must be at least 10 digits"),
  partnerType: z.string().min(1, "Please select a partner type"),
  comments: z.string().min(1, "Comments are required"),
  document: z.any().optional(), // Optional file upload
});

export default function PodcastPartnerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      number: "",
      partnerType: "",
      comments: "",
      document: null,
    },
  });

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL + "/api/podcast-partner/submit";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("number", values.number);
      formData.append("partnerType", values.partnerType);
      formData.append("comments", values.comments);
      if (values.document) {
        formData.append("document", values.document[0]); // Append the file
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Thank you for your submission!");
        form.reset();
      } else {
        throw new Error("Failed to submit the form");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // YouTube videos data
  const videos = [
    {
      id: "1",
      title: "Podcast with Pemmasani Chandra Shekhar garu Guntur MP",
      url: "https://youtu.be/sZ8u-TqG6Tw?si=fEWXtRAtEbibvDnM",
    },
    {
      id: "2",
      title: "Podcast reels of Galla Madhavi garu",
      url: "https://www.instagram.com/reel/C62kktFrqyA/?igsh=MWxvbnp0djBnbjZ3cg==",
    },
    {
      id: "3",
      title: "Podcast with Mahesh Yadav Eluru MP",
      url: "https://www.instagram.com/reel/C6xUCWVJsBM/?igsh=MXg0NGg1NDkyYmkzZg== ",
    },
  ];

  // Helper function to extract YouTube video ID and generate thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch
      ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`
      : null; // Return null if the URL is not a valid YouTube link
  };

  return (
    <main className="min-h-screen text-white">
      {/* YouTube Videos Section */}
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
            Watch Our Podcast Episodes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const thumbnail = getYouTubeThumbnail(video.url);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-black/70 p-4 rounded-lg shadow-lg hover:shadow-orange-500 beam-shadow border border-gray-700 hover:border-transparent hover:-translate-y-3 transform transition-all duration-300"
                >
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <img
                        src={`/insta${index}.jpg`}
                        alt={`/insta${index}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-bold text-orange-500">
                      {video.title}
                    </h3>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/70 p-8 rounded-lg shadow-xl order-2 md:order-1 hover:shadow-orange-500 beam-shadow"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
              Become a Partner for Vyuha Podcasts
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your name"
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number Field */}
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your number"
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type of Partner */}
                <FormField
                  control={form.control}
                  name="partnerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Partner</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select a partner type" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/70 text-white rounded-lg shadow-lg">
                            <SelectItem value="collaboration">
                              Collaboration Partners
                            </SelectItem>
                            <SelectItem value="event">
                              Event Partners
                            </SelectItem>
                            <SelectItem value="technology">
                              Technology Partners
                            </SelectItem>
                            <SelectItem value="social-impact">
                              Social Impact Partners
                            </SelectItem>
                            <SelectItem value="merchandise">
                              Merchandise Partners
                            </SelectItem>
                            <SelectItem value="distribution">
                              Distribution Partners
                            </SelectItem>
                            <SelectItem value="sponsorship">
                              Sponsorship Partners
                            </SelectItem>
                            <SelectItem value="content">
                              Content Partners
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comments/Suggestions */}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments/Suggestions*</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please mention your requirements, perceptions, or suggestions."
                          rows={4}
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Document (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files || null)
                          }
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center order-1 md:order-2"
          >
            <div className="relative w-full h-96 lg:h-full">
              <img
                src="/anna.png"
                alt="Podcast Partner"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
