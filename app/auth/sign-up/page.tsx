"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Card } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const router = useRouter(); // Initialize useRouter for navigation

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "", // Add this line
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Use the API URL from the environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Make API call to the signup endpoint
      const response = await axios.post(`${apiUrl}/api/auth/signup`, {
        username: values.fullName,
        email: values.email,
        phone: values.phone, // Add this line
        password: values.password,
      });

      if (response.status === 201) {
        const { token, user } = response.data;

        // Store the token in sessionStorage or localStorage
        sessionStorage.setItem("authToken", token);

        alert(
          "Account created successfully! Redirecting to the sign-in page..."
        );
        router.push("/auth/sign-in"); // Navigate to the sign-in page
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      // Handle specific error messages from the API
      if (axios.isAxiosError(error) && error.response) {
        alert(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-auto flex overflow-hidden">
      {/* Left Half - Creative Section */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-white p-10 rounded-l-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Join VYUHA</h1>
          <p className="text-lg mb-6">
            Empowering Innovations and Transforming Ideas into Reality
          </p>
          <ul className="space-y-4 text-left">
            <li className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-4 h-4 bg-white rounded-full"
              ></motion.span>
              <p>Access exclusive resources and tools</p>
            </li>
            <li className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-4 h-4 bg-white rounded-full"
              ></motion.span>
              <p>Collaborate with innovators worldwide</p>
            </li>
            <li className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-4 h-4 bg-white rounded-full"
              ></motion.span>
              <p>Transform your ideas into impactful solutions</p>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Right Half - Sign-Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
          >
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-3xl shadow-lg">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <UserPlus className="w-6 h-6 text-orange-400" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-400">
                  Join our community of innovators
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Full Name Field */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              className="pl-10"
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              className="pl-10"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              className="pl-10"
                              placeholder="Enter your phone number"
                              {...field}
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              placeholder="Create a password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              placeholder="Confirm your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white text-orange-500 focus:ring-orange-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              terms and conditions
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
                  >
                    Sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
