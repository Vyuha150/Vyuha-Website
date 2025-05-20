"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/public/logo.png";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/origin" },
  { name: "Events", href: "/events" },
  { name: "Clubs", href: "/club-partner" },
];

const connectLinks = [
  { name: "Membership", href: "/membership" },
  { name: "Podcast Connect", href: "/podcast-partner" },
  { name: "Career Boost", href: "/path" },
  { name: "Organizations", href: "/organizations" },
];

const additionalLinks = [
  { name: "Careers", href: "/career" },
  { name: "Resources", href: "/organization" },
  { name: "Courses", href: "/courses" },
  { name: "Vyuha Features", href: "/features" },
  { name: "Vyuha Community Forum", href: "/forum" },
  { name: "Mentorship", href: "/mentorship" },
  { name: "Opportunities", href: "/opportunities" },
  { name: "Projects", href: "/projects" },
  { name: "Join Vyuha", href: "/join" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showConnectMenu, setShowConnectMenu] = useState(false);
  const [showAdditionalMenu, setShowAdditionalMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = Cookies.get("authToken");
      setIsLoggedIn(!!authToken);
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("role");
    setIsLoggedIn(false);
    router.push("/auth/sign-in");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-0 right-0 z-[999] flex justify-center px-4 md:px-6"
    >
      <div
        className={`w-full max-w-6xl rounded-2xl backdrop-blur-lg bg-[#0c0c0ccc] border border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md transition-all duration-300 ${
          scrolled ? "shadow-orange-500/10 border-orange-500/10" : ""
        }`}
      >
        {/* Logo with Company Name */}
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Image
              src={logo}
              alt="Vyuha Logo"
              width={36}
              height={36}
              className="rounded-full relative z-10"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200"
          >
            VYUHA
          </motion.span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-200 group ${
                    isActive ? "text-orange-400" : "text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </motion.div>
            );
          })}

          {/* Connect Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowConnectMenu(true)}
            onMouseLeave={() => setShowConnectMenu(false)}
          >
            <button className="flex items-center space-x-2 text-sm font-medium text-white transition-all">
              <span>Connect</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showConnectMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0c0c0ccc] border border-white/10 rounded-lg shadow-lg overflow-hidden"
                >
                  {connectLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowAdditionalMenu(true)}
            onMouseLeave={() => setShowAdditionalMenu(false)}
          >
            <button className="flex items-center space-x-2 text-sm font-medium text-white transition-all">
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showAdditionalMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0c0c0ccc] border border-white/10 rounded-lg shadow-lg overflow-hidden"
                >
                  {additionalLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-sm font-medium text-white px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0c0c0ccc] border border-white/10 rounded-lg shadow-lg overflow-hidden"
                >
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="inline w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="inline w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <Link
                        href="/profile/notifications"
                        className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Bell className="inline w-4 h-4 mr-2" />
                        Notifications
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/sign-in"
                        className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 transition-all"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-[#0c0c0ccc] border-t border-white/10 rounded-b-lg shadow-lg md:hidden rounded-lg"
            >
              <div className="flex flex-col p-4">
                {/* Main Links */}
                <div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 mb-2 ${
                        pathname === link.href
                          ? "text-orange-400"
                          : "text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Connect Links Dropdown */}
                <div>
                  <button
                    onClick={() => setShowConnectMenu(!showConnectMenu)}
                    className="flex items-center justify-between w-full text-sm font-bold text-white mb-2"
                  >
                    Connect
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showConnectMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showConnectMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 space-y-2"
                      >
                        {connectLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="block text-sm font-medium text-white hover:text-orange-400 transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* More Links Dropdown */}
                <div>
                  <button
                    onClick={() => setShowAdditionalMenu(!showAdditionalMenu)}
                    className="flex items-center justify-between w-full text-sm font-bold text-white mb-2"
                  >
                    More
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showAdditionalMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showAdditionalMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 space-y-2"
                      >
                        {additionalLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="block text-sm font-medium text-white hover:text-orange-400 transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Section */}
                <div className="border-t border-white/10 pt-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 text-sm font-medium text-white hover:text-orange-400 transition-all mb-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center space-x-2 text-sm font-medium text-white hover:text-orange-400 transition-all mb-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/profile/notifications"
                        className="flex items-center space-x-2 text-sm font-medium text-white hover:text-orange-400 transition-all mb-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-white hover:text-orange-400 transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/auth/sign-in"
                        className="text-sm font-medium text-orange-400 hover:underline transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="text-sm font-medium text-orange-400 hover:underline transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
