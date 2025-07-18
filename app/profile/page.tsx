"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Cookies from "js-cookie";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  profilePicture: z.string().optional(),
});

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      gender: "Other",
      profilePicture: "",
    },
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/profile";

  // Check if the user is logged in
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, [router]);

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true,
        });

        // Convert the compressed image to Base64
        const reader = new FileReader();
        reader.onload = () => {
          form.setValue("profilePicture", reader.result as string); // Update the form value
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // Fetch user profile data on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = Cookies.get("authToken"); // Retrieve authToken from Cookies

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Only include the token
          },
        });

        if (response.status === 200) {
          const data = response.data;

          form.reset({
            name: data.username,
            email: data.email,
            phone: data.phone || "",
            address: data.address || "",
            dob: data.dob ? data.dob.split("T")[0] : "", // Format date if needed
            gender: data.gender || "Other",
            profilePicture: data.profilePicture || "",
          });
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const authToken = Cookies.get("authToken"); // Retrieve authToken from Cookies

      // Map form data to backend structure
      const payload = {
        username: values.name, // Map `name` to `username`
        email: values.email,
        phone: values.phone,
        address: values.address,
        dob: values.dob,
        gender: values.gender,
        profilePicture: values.profilePicture,
      };

      const response = await axios.put(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Only include the token
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-screen flex items-center justify-center text-white">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="h-auto flex items-center justify-center px-4 md:px-6 mt-10 md:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
        className="w-full max-w-2xl"
      >
        <div className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-3xl shadow-lg">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              My Profile
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400"
            >
              Manage your account settings and preferences
            </motion.p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Picture */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-4">
                        {/* Profile Picture as Input */}
                        <label
                          htmlFor="profilePicture"
                          className="cursor-pointer"
                        >
                          <img
                            src={
                              field.value || "https://via.placeholder.com/150"
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full border border-gray-700 object-cover"
                          />
                        </label>
                        <input
                          type="file"
                          id="profilePicture"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden" // Hide the file input
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`rounded-lg ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="rounded-lg cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`rounded-lg ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`rounded-lg ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={!isEditing}
                        className={`rounded-lg ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={!isEditing}
                        className={`w-full p-2 bg-black border border-gray-700 text-white rounded-lg ${
                          isEditing ? "" : "cursor-not-allowed"
                        }`}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="submit" // Submits the form when clicked
                    className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button" // Prevents form submission
                    onClick={() => setIsEditing(false)} // Disables editing mode
                    className="rounded-lg border-gray-500 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
          {!isEditing && (
            <div className="flex justify-end mt-4">
              <Button
                type="button" // Prevents form submission
                onClick={() => setIsEditing(true)} // Enables editing mode
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
