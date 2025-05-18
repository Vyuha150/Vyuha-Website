"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  ArrowRight,
  Newspaper,
  RocketIcon,
  HeartPulse,
  GraduationCap,
  Star,
} from "lucide-react";
import Image from "next/image";
import router, { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Properly type the feature and article interfaces
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Article {
  image: string;
  title: string;
}

// Animation variants - simplified for better performance
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// Optimized FeatureCard component
const FeatureCard = React.memo(
  ({ feature, index }: { feature: Feature; index: number }) => (
    <motion.div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-4 p-3 rounded-full inline-flex bg-orange-500/10 border border-orange-500/20 transition-all duration-300 group-hover:bg-orange-500/20">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-outfit">
        {feature.title}
      </h3>
      <p className="text-gray-300 font-outfit">{feature.description}</p>
    </motion.div>
  )
);
FeatureCard.displayName = "FeatureCard";

// Optimized NewsCard component
const NewsCard = React.memo(
  ({ article, index }: { article: Article; index: number }) => (
    <motion.div
      className="group relative overflow-hidden rounded-xl cursor-pointer border border-white/10 hover:border-orange-500/30 transition-colors duration-300"
      variants={scaleInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-xl font-bold text-white font-outfit">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center">
            <span className="text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
              Read more
            </span>
            <ArrowRight
              size={14}
              className="ml-1 text-orange-400 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
);
NewsCard.displayName = "NewsCard";

// CSS-based particle background (more efficient)
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden">
      <style jsx>{`
        .particle-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .glow-1,
        .glow-2 {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }
        .glow-1 {
          top: 33%;
          left: 50%;
          width: 600px;
          height: 600px;
          background: rgba(249, 115, 22, 0.15);
          transform: translateX(-50%);
          animation: pulse1 8s infinite ease-in-out;
        }
        .glow-2 {
          bottom: 25%;
          right: 25%;
          width: 300px;
          height: 300px;
          background: rgba(249, 115, 22, 0.1);
          animation: pulse2 6s 2s infinite ease-in-out;
        }
        @keyframes pulse1 {
          0%,
          100% {
            opacity: 0.3;
            transform: translateX(-50%) scale(0.8);
          }
          50% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1);
          }
        }
        @keyframes pulse2 {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }
      `}</style>
      <div className="particle-container">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>
    </div>
  );
};

// Main Achievements component
const Achievements = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [900, 1200], [20, 0], { clamp: true });
  const opacity = useTransform(scrollY, [900, 1200], [0, 1], { clamp: true });

  // Memoize static data
  const features = useMemo<Feature[]>(
    () => [
      {
        title: "Innovation & Entrepreneurship",
        description:
          "Students learn to convert problem-solving solutions into business models by integrating technology.",
        icon: <RocketIcon className="w-8 h-8 text-orange-400" />,
      },
      {
        title: "Health & Outreach Projects",
        description:
          "We organize impactful health and outreach activities recognized by APSACS, KL University, and AIMS Mangalgiri.",
        icon: <HeartPulse className="w-8 h-8 text-orange-400" />,
      },
      {
        title: "Upskilling & Training",
        description:
          "Vyuha believes that equipping students with on-demand skills is essential for success.",
        icon: <GraduationCap className="w-8 h-8 text-orange-400" />,
      },
    ],
    []
  );

  const newspaperArticles = useMemo<Article[]>(
    () => [
      {
        image: "/news/new2.png",
        title: "Vyuha's Health Camp Recognized by APSACS",
      },
      {
        image: "/news/new2.png",
        title: "Innovation Fest Gains Media Attention",
      },
      {
        image: "/news/new2.png",
        title: "Students Launch New Startup with Vyuha",
      },
    ],
    []
  );

  // Memoized event handler
  const handleExploreClick = useCallback(() => {
    router.push("/origin");
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 z-[2]" />

      <motion.div
        className="max-w-7xl mx-auto px-8 relative z-10"
        style={{ y, opacity }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <div className="bg-white/10 backdrop-blur-sm text-xs font-medium text-orange-200 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Star size={12} className="text-orange-400" />
              <span>Our Impact</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
            Notable <span className="text-white/90">Achievements</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-300 text-lg font-outfit">
            Our commitment to excellence has led to remarkable achievements that
            showcase the power of student-led initiatives.
          </p>
        </motion.div>

        {/* Features grid - render only if above fold */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Media coverage section */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <div className="inline-block mb-4">
                <div className="bg-white/10 backdrop-blur-sm text-xs font-medium text-orange-200 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <Newspaper size={12} className="text-orange-400" />
                  <span>Press Coverage</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
                Featured in News
              </h2>
            </div>

            <button className="mt-4 md:mt-0 flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-medium font-outfit group">
              View all press releases
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newspaperArticles.map((article, index) => (
              <NewsCard key={index} article={article} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA button */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleExploreClick}
            className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-medium font-outfit transition-all duration-300 shadow-lg shadow-orange-500/20 group hover:shadow-orange-500/40 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore More Achievements
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Achievements;
