"use client";

import "@/styles/globals.css";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IconicLoader from "@/components/IconicLoader";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Define routes where Navbar and Footer should be excluded
  const excludeNavbarFooter = [
    "/auth/sign-in",
    "/auth/sign-up",
    ...pathname.startsWith("/dashboard/") ? [pathname] : [], // Exclude for all dashboard routes
  ].includes(pathname);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Show loader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-[#0c0c0c] text-white font-outfit relative overflow-x-hidden">
        {/* 🔥 Orange Accent Gradient Blobs - Shared Site-Wide */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] top-[-100px] left-[-150px] bg-orange-500 opacity-30 rounded-full mix-blend-overlay blur-3xl animate-pulse z-0" />
          <div className="absolute w-[400px] h-[400px] bottom-[-100px] right-[-150px] bg-orange-500 opacity-30 rounded-full mix-blend-overlay blur-2xl animate-pulse z-0" />
        </div>

        {/* 🔗 Core Layout */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navbar */}
          {!excludeNavbarFooter && (
            <header className="w-full">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <Navbar />
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className={`flex-1 w-full ${!pathname.startsWith("/dashboard/") ? "max-w-7xl mx-auto sm:px-10 pt-16 md:pt-10" : ""}`}>
            {loading ? <IconicLoader /> : children}
          </main>

          {/* Footer */}
          {!excludeNavbarFooter && (
            <footer className="mt-auto">
              <Footer />
            </footer>
          )}
        </div>
        
        {/* React Hot Toast */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Default options for specific types
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
