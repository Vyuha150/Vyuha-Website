"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge, Star, Users, Building2, GraduationCap } from "lucide-react";
import axios from "axios";

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
});

export default function MembershipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      organization: "",
      membershipType: "collaborator",
      occupation: "",
      linkedinProfile: "",
      interests: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Convert interests to array by splitting on commas
      const payload = {
        ...values,
        interests: values.interests
          .split(",")
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
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay key
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
            // Verify payment
            const verifyResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/membership/verify-payment`,
              {
                orderId,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
              }
            );

            alert(verifyResponse.data.message);
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
        // If no payment is required
        alert(response.data.message);
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
              <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_4px_rgba(255,115,0,0.4)] transition-all duration-300 hover:transform hover:translate-y-[-5px]">
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
                <ul className="space-y-2">
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
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-6 bg-black/50 backdrop-blur-sm border border-white/10 hover:shadow-[0_0_20px_10px_rgba(255,115,0,0.4),0_0_50px_15px_rgba(255,115,0,0.2)] hover:transform hover:translate-y-[-10px] transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-bold mb-10 text-orange-500 text-center">
                Membership Application
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 text-white"
                >
                  <FormField
                    control={form.control}
                    name="membershipType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Membership Type
                        </FormLabel>
                        <FormControl className="text-white">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid sm:grid-cols-3 grid-cols-1 gap-4 text-white"
                          >
                            {membershipTypes.map((type) => (
                              <div
                                key={type.id}
                                className="flex items-center space-x-2 text-white"
                              >
                                <RadioGroupItem
                                  value={type.id}
                                  id={type.id}
                                  className="w-4 h-4 rounded-full border-2 border-white bg-transparent relative
             transition-all duration-200 ease-in-out data-[state=checked]:after:content-[''] data-[state=checked]:after:absolute data-[state=checked]:after:top-1/2 data-[state=checked]:after:left-1/2 data-[state=checked]:after:-translate-x-1/2 data-[state=checked]:after:-translate-y-1/2 data-[state=checked]:after:transform data-[state=checked]:after:w-[100%] data-[state=checked]:after:h-[100%] data-[state=checked]:after:bg-orange-500 data-[state=checked]:after:rounded-full"
                                />

                                <FormLabel
                                  htmlFor={type.id}
                                  className="cursor-pointer text-orange-400"
                                >
                                  {type.title}
                                </FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              className="border-orange-400"
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
                              className="border-orange-400"
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
                              className="border-orange-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company/College Name"
                              {...field}
                              className="border-orange-400"
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
                            className="border-orange-400"
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
                            className="border-orange-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className="border-orange-400"
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
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. web development, AI, marketing"
                            {...field}
                            className="border-orange-400"
                          />
                        </FormControl>
                        <div className="text-xs text-gray-400 mt-1">
                          Separate multiple interests with commas.
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center items-center">
                    <Button
                      type="submit"
                      className="w-auto px-12 bg-gradient-to-r from-orange-500 to-orange-600 mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
