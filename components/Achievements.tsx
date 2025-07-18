"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

// Properly type the feature and article interfaces
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Article {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
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
  ({ article, index }: { article: Article; index: number }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-[#18181b] text-white p-8 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              <span className="block text-2xl font-bold text-orange-400 mb-2 text-center">{article.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden border border-orange-400">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-4 text-sm text-orange-300">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <DialogDescription className="text-gray-300 text-base text-center mt-4">
                {article.description}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
NewsCard.displayName = "NewsCard";

// CSS-based particle background (more efficient)
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden">
      <div className="particle-container absolute inset-0 overflow-hidden">
        <div className="glow-1 absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[100px] -translate-x-1/2 animate-pulse"></div>
        <div className="glow-2 absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse"></div>
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
  const [achievements, setAchievements] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch achievements from API
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${baseUrl}/api/achievements/latest`);
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        // Fallback to static data if API fails
        setAchievements([
          {
            _id: '1',
            image: "/news/new1.jpg",
            title: "Vyuha's Health Camp Recognized by APSACS",
            description: "Vyuha's health camp was recognized by APSACS for its outstanding service, providing free health checkups and awareness sessions to hundreds of students and community members.",
            date: "2024-01-15",
          },
          {
            _id: '2',
            image: "/news/new2.jpg",
            title: "Innovation Fest Gains Media Attention",
            description: "The Innovation Fest organized by Vyuha attracted significant media attention, showcasing student-led projects and technological advancements.",
            date: "2024-02-20",
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

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

  // Memoized event handler
  const handleExploreClick = useCallback(() => {
    router.push("/achievements");
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
          {features.map((feature, featureIndex) => (
            <FeatureCard key={`feature-${featureIndex}`} feature={feature} index={featureIndex} />
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
            {loading ? (
              <div className="col-span-3 flex justify-center items-center py-12">
                <div className="text-white">Loading achievements...</div>
              </div>
            ) : (
              achievements.map((article, index) => (
                <NewsCard key={article._id} article={article} index={index} />
              ))
            )}
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
