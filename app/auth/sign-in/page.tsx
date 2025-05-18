"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Get the API URL from environment variables
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/auth/login";

      // Make API call to authenticate the user
      const response = await axios.post(apiUrl, values);

      if (response.status === 200) {
        const { token, userId, role } = response.data;

        // Store the token and userId in sessionStorage
        Cookies.set("authToken", token, { path: "/", expires: 1 });
        Cookies.set("userId", userId, { path: "/", expires: 1 });
        Cookies.set("role", role, { path: "/", expires: 1 });

        alert("Sign-in successful! Redirecting to the home page...");
        router.push("/");
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);

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
    <main className="h-screen flex overflow-hidden">
      {/* Left Half - Creative Section */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-white p-10 rounded-l-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to VYUHA</h1>
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

      {/* Right Half - Login Form */}
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
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="w-6 h-6 text-orange-400" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  Sign In to Your Account
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-400"
                >
                  Access your dashboard and explore endless possibilities
                </motion.p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
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
                                className="pl-10 rounded-lg"
                                placeholder="Enter your email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
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
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                className="pl-10 pr-10 rounded-lg"
                                placeholder="Enter your password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex justify-end"
                  >
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>
                </form>
              </Form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
                  >
                    Sign up now <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
