"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"ready" | "verifying" | "success" | "error">("ready");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    // Token is a random hex string, not a JWT - so we can't decode it
    // We'll proceed with verification and get user info from the API response
    setToken(tokenParam);
    setStatus("ready");
  }, [searchParams]);

  const handleVerifyEmail = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    setStatus("verifying");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message);
        // Automatically redirect to login after 5 seconds
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl shadow-lg bg-black/60 border border-orange-500 p-8 text-center"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6">
          Email Verification
        </h1>

        {status === "ready" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Ready to verify your email address</p>
              <p className="text-gray-400 text-sm">Click the button below to complete verification</p>
            </div>
            <button
              onClick={handleVerifyEmail}
              disabled={isVerifying}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Confirm & Verify"}
            </button>
          </div>
        )}

        {status === "verifying" && (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-white">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-400 font-semibold">{message}</p>
            <p className="text-gray-400 text-sm">
              Redirecting to login page in 5 seconds...
            </p>
            <Link
              href="/auth/sign-in"
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-400 font-semibold mb-4">{message}</p>
            <Link
              href="/auth/sign-up"
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Register Again
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  );
} 