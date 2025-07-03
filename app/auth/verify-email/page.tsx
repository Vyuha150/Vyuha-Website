"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Email successfully verified!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      });
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center  px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", bounce: 0.3 }}
        className="w-full max-w-md rounded-3xl shadow-lg bg-black/60 border border-orange-500 p-8 text-center"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6">
          Email Verification
        </h1>
        {status === "pending" && (
          <p className="text-white">Verifying your email, please wait...</p>
        )}
        {status === "success" && (
          <>
            <p className="text-green-400 font-semibold mb-4">{message}</p>
            <Link
              href="/auth/sign-in"
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-400 font-semibold mb-4">{message}</p>
            <Link
              href="/auth/sign-up"
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Register Again
            </Link>
          </>
        )}
      </motion.div>
    </main>
  );
} 