"use client";

import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge, Star, Users, Building2, GraduationCap, ArrowLeft } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import InlineLoader from "@/components/InlineLoader";
import Cookies from "js-cookie";

declare const Razorpay: any;

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  organization: z.string().min(2, "Organization name is required"),
  membershipType: z.enum([
    "collaborator",
    "business",
    "college",
    "political-action",
    "women-empowerment",
    "corporate-coolies",
    "influencer",
  ]),
  occupation: z.string().min(2, "Occupation is required"),
  linkedinProfile: z
    .string()
    .optional()
    .refine(
      (value) => !value || (value && z.string().url().safeParse(value).success),
      {
        message: "Invalid LinkedIn URL",
      }
    ),
  interests: z.string().min(10, "Please describe your interests"),
  studentId: z.string().optional(),
  gstNumber: z.string().optional(),
  gender: z.string().optional(),
  empowermentGoals: z.string().optional(),
});

function MembershipApplicationContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const membershipType = searchParams.get("type") || "collaborator";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      organization: "",
      membershipType: membershipType as any,
      occupation: "",
      linkedinProfile: "",
      interests: "",
    },
    mode: "onSubmit",
  });

  const selectedType = useWatch({ control: form.control, name: "membershipType" });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Auto-fill form fields from URL parameters or logged-in user data
  useEffect(() => {
    const urlName = searchParams.get("name");
    const urlEmail = searchParams.get("email");
    const urlPhone = searchParams.get("phone");
    
    // Set membership type first
    form.setValue("membershipType", membershipType as any);
    
    // Function to fetch user profile data
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          console.log("No auth token found, skipping auto-fill");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/profile";
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data;
          console.log("Fetched user data for auto-fill:", userData);

          // Auto-fill form with user data (URL parameters take priority)
          if (urlName) {
            form.setValue("fullName", urlName);
          } else if (userData.username) {
            form.setValue("fullName", userData.username);
          }
          
          if (urlEmail) {
            form.setValue("email", urlEmail);
          } else if (userData.email) {
            form.setValue("email", userData.email);
          }
          
          if (urlPhone) {
            form.setValue("phone", urlPhone);
          } else if (userData.phone) {
            form.setValue("phone", userData.phone);
          }

          // Auto-fill other fields if available
          if (userData.address) {
            form.setValue("address", userData.address);
          }
          
          // Note: organization and occupation are not in the user profile,
          // so they won't be auto-filled unless passed via URL
        }
      } catch (error) {
        console.error("Error fetching user profile for auto-fill:", error);
        // Don't show error to user, just skip auto-fill
      } finally {
        setIsLoadingProfile(false);
      }
    };

    // If user is logged in, fetch their data for auto-fill
    const authToken = Cookies.get("authToken");
    if (authToken) {
      fetchUserProfile();
    } else {
      // If not logged in, just fill from URL parameters
      if (urlName) form.setValue("fullName", urlName);
      if (urlEmail) form.setValue("email", urlEmail);
      if (urlPhone) form.setValue("phone", urlPhone);
    }
  }, [searchParams, membershipType, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Convert interests to array by splitting on commas and newlines
      const payload = {
        ...values,
        interests: values.interests
          .split(/[,\n]/)
          .map((i) => i.trim())
          .filter(Boolean),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/membership/apply`,
        payload
      );

      if (response.data.orderId) {
        // If payment is required, initiate payment
        const { orderId, amount, currency } = response.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: "Vyuha Membership",
          description: "Membership Payment",
          order_id: orderId,
          handler: async function (paymentResponse: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/membership/verify-payment`,
                {
                  orderId,
                  paymentId: paymentResponse.razorpay_payment_id,
                  signature: paymentResponse.razorpay_signature,
                }
              );
              toast.success(verifyResponse.data.message);
              router.push("/membership");
            } catch (err) {
              toast.error("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: values.fullName,
            email: values.email,
            contact: values.phone,
          },
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
      } else {
        toast.success(response.data.message);
        router.push("/membership");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message ||
          "Error submitting form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const membershipTypes = [
    {
      id: "collaborator",
      title: "Vyuha Collaborators",
      price: "₹500",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "business",
      title: "Vyuha Business",
      price: "₹3000",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: "college",
      title: "Vyuha College Connect (VCC)",
      price: "₹150",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: "women-empowerment",
      title: "Vyuha Women Empowerment",
      price: "Free",
      icon: <Badge className="w-6 h-6" />,
    },
    {
      id: "political-action",
      title: "Vyuha Political Action Committee",
      price: "₹100",
      icon: <Star className="w-6 h-6" />,
    },
    {
      id: "corporate-coolies",
      title: "Vyuha Corporate Coolies",
      price: "₹777",
      icon: <Star className="w-6 h-6" />,
    },
    {
      id: "influencer",
      title: "Vyuha Influencer",
      price: "₹250",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  const currentMembership = membershipTypes.find(type => type.id === selectedType);

  return (
    <main className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/membership" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Membership Plans
        </Link>

        {/* Selected Membership Type Display */}
        {currentMembership && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-orange-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                  {currentMembership.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentMembership.title}</h2>
                  <p className="text-xl font-semibold text-orange-400">{currentMembership.price}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-8 bg-black/50 backdrop-blur-sm border border-white/10">
            <h3 className="text-2xl font-bold mb-8 text-orange-500 text-center">
              Membership Application
            </h3>
            {isLoadingProfile && (
              <div className="flex items-center justify-center gap-2 mb-6 text-orange-400">
                <InlineLoader size="small" />
                <span className="text-sm">Loading your profile data...</span>
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-white"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="border-orange-400 bg-black/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            {...field}
                            className="border-orange-400 bg-black/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+91 1234567890"
                            {...field}
                            className="border-orange-400 bg-black/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your current role"
                            {...field}
                            className="border-orange-400 bg-black/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your complete address"
                          {...field}
                          className="border-orange-400 bg-black/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional fields based on membershipType */}
                {selectedType === "college" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your College Name"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Student ID"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedType === "business" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Business Name"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="GST Number"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedType === "women-empowerment" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Gender"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empowermentGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empowerment Goals</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Empowerment Goals"
                              {...field}
                              className="border-orange-400 bg-black/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Default organization field for other types */}
                {selectedType !== "college" && selectedType !== "business" && selectedType !== "women-empowerment" && (
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Company/Organization Name"
                            {...field}
                            className="border-orange-400 bg-black/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="linkedinProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          {...field}
                          className="border-orange-400 bg-black/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (one per line or comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your interests, hobbies, and professional areas of focus..."
                          {...field}
                          className="border-orange-400 bg-black/20 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center items-center pt-4">
                  <Button
                    type="submit"
                    className="px-12 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <InlineLoader className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

export default function MembershipApplicationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><InlineLoader size="medium" /></div>}>
      <MembershipApplicationContent />
    </Suspense>
  );
} 