"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
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
import { stateNames } from "@/data/statesData";
import { districtNames } from "@/data/districtsData";
import { countryNames } from "@/data/coutriesData";


const genderOptions = ["Male", "Female", "Other"];

const formSchema = z
  .object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    isStudent: z.boolean(),
    // Student fields (optional if not student)
    college: z.string().optional(),
    otherCollege: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    addressLine: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.isStudent) {
      return !!data.college && !!data.gender && !!data.country && !!data.addressLine && (data.country !== "India" || (!!data.state && !!data.district));
    }
    return true;
  }, {
    message: "All student fields are required",
    path: ["college"],
  });

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const [colleges, setColleges] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [showOtherCollege, setShowOtherCollege] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    // Fetch colleges from backend
    const fetchColleges = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/api/colleges`);
        setColleges(res.data);
      } catch (err) {
        setColleges([]);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    if (selectedState && districtNames[selectedState as keyof typeof districtNames]) {
      setDistricts(districtNames[selectedState as keyof typeof districtNames]);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
      isStudent: false,
      college: "",
      otherCollege: "",
      gender: "Other",
      country: "India",
      state: "",
      district: "",
      addressLine: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let payload: any = {
        username: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };
      if (values.isStudent) {
        let collegeValue = values.college || "";
        if (collegeValue === "Other") {
          collegeValue = values.otherCollege || "";
        }
        let address = values.addressLine;
        if (values.country === "India") {
          address = `${values.addressLine}, ${values.district}, ${values.state}, India`;
        }
        payload = {
          ...payload,
          gender: values.gender,
          college: collegeValue,
          address,
          country: values.country,
          state: values.state,
          district: values.district,
        };
      }
      const response = await axios.post(`${apiUrl}/api/auth/signup`, payload);

      if (response.status === 201) {
        const { token, user } = response.data;

        // Store the token in sessionStorage or localStorage
        sessionStorage.setItem("authToken", token);

        toast.success(
          "Account created successfully! Redirecting to the sign-in page..."
        );
        router.push("/auth/sign-in"); // Navigate to the sign-in page
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      // Handle specific error messages from the API
      if (axios.isAxiosError(error) && error.response) {
          toast.error(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        toast.error("An error occurred. Please try again later.");
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
                        <div className="text-xs text-gray-400 mt-1">
                          Please include at least 8 characters, 1 uppercase
                          letter, 1 lowercase letter, 1 number, and 1 special
                          character (@, $, !, %, *, ?, &, etc).
                        </div>
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

                  {/* Are you a student? */}
                  <div className="flex items-center gap-4">
                    <label className="text-white font-medium">Are you a student?</label>
                    <input
                      type="radio"
                      id="student-yes"
                      checked={form.watch("isStudent")}
                      onChange={() => { form.setValue("isStudent", true); setIsStudent(true); }}
                    />
                    <label htmlFor="student-yes" className="text-white">Yes</label>
                    <input
                      type="radio"
                      id="student-no"
                      checked={!form.watch("isStudent")}
                      onChange={() => { form.setValue("isStudent", false); setIsStudent(false); }}
                    />
                    <label htmlFor="student-no" className="text-white">No</label>
                  </div>
                  {/* Student fields */}
                  {form.watch("isStudent") && (
                    <>
                      {/* College Field */}
                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 rounded bg-black/70 text-white border border-white/20"
                                {...field}
                                onChange={e => {
                                  field.onChange(e);
                                  setShowOtherCollege(e.target.value === "Other");
                                }}
                              >
                                <option value="">Select your college</option>
                                {colleges.map((c: any) => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                                <option value="Other">Other College</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Other College Field */}
                      {showOtherCollege && (
                        <FormField
                          control={form.control}
                          name="otherCollege"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter College Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your college name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {/* Gender Field */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 rounded bg-black/70 text-white border border-white/20"
                                {...field}
                              >
                                {genderOptions.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Country Field */}
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 rounded bg-black/70 text-white border border-white/20"
                                {...field}
                                onChange={e => {
                                  field.onChange(e);
                                  if (e.target.value !== "India") {
                                    setSelectedState("");
                                    setDistricts([]);
                                  }
                                }}
                              >
                                <option value="">Select country</option>
                                {countryNames.map((c: string) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* State and District Fields (India only) */}
                      {form.watch("country") === "India" && (
                        <>
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <select
                                    className="w-full p-2 rounded bg-black/70 text-white border border-white/20"
                                    {...field}
                                    onChange={e => {
                                      field.onChange(e);
                                      setSelectedState(e.target.value);
                                    }}
                                  >
                                    <option value="">Select state</option>
                                    {stateNames.map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                  <select
                                    className="w-full p-2 rounded bg-black/70 text-white border border-white/20"
                                    {...field}
                                  >
                                    <option value="">Select district</option>
                                    {districts.map(d => (
                                      <option key={d} value={d}>{d}</option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      {/* Address Line Field */}
                      <FormField
                        control={form.control}
                        name="addressLine"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Address line (street, area, etc.)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

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
