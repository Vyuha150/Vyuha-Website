"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flame,
  Sparkles,
  Brain,
  Star,
  ArrowRight,
  Bot as Lotus,
  Heart,
  Infinity,
  Lightbulb,
  Compass,
  Target,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const paths = [
  {
    id: "seeker",
    title: "The Seeker's Awakening",
    icon: <Lotus className="w-6 h-6" />,
    description: "Begin your journey of self-discovery and spiritual awakening",
    level: "Beginner",
    duration: "12 weeks",
    topics: [
      {
        title: "Introduction to Mindfulness",
        description:
          "Learn foundational meditation techniques and their benefits",
        icon: <Brain className="w-5 h-5" />,
      },
      {
        title: "Finding Your Purpose",
        description: "Identify your core values, passions, and strengths",
        icon: <Compass className="w-5 h-5" />,
      },
      {
        title: "Ancient Wisdom Practices",
        description: "Explore Shambhavi mahamudra and spiritual teachings",
        icon: <Infinity className="w-5 h-5" />,
      },
      {
        title: "Breaking Limiting Beliefs",
        description: "Challenge and transform negative thought patterns",
        icon: <Lightbulb className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "explorer",
    title: "The Explorer's Growth",
    icon: <Heart className="w-6 h-6" />,
    description: "Deepen your practice and expand your consciousness",
    level: "Intermediate",
    duration: "16 weeks",
    topics: [
      {
        title: "Advanced Mindfulness",
        description: "Master advanced meditation and presence techniques",
        icon: <Star className="w-5 h-5" />,
      },
      {
        title: "Transcending the Ego",
        description: "Understand and move beyond egoic limitations",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        title: "Emotional Mastery",
        description: "Develop advanced emotional intelligence and resilience",
        icon: <Heart className="w-5 h-5" />,
      },
      {
        title: "Healing Practices",
        description:
          "Learn transformative techniques like fasting and pranayama",
        icon: <Zap className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "matrix-breaker",
    title: "The Matrix Breaker's Mastery",
    icon: <Sparkles className="w-6 h-6" />,
    description: "Achieve spiritual mastery and become a guide for others",
    level: "Advanced",
    duration: "24 weeks",
    topics: [
      {
        title: "Leadership from Within",
        description: "Develop authentic spiritual leadership abilities",
        icon: <Target className="w-5 h-5" />,
      },
      {
        title: "Higher Consciousness",
        description: "Access and maintain elevated states of awareness",
        icon: <Flame className="w-5 h-5" />,
      },
      {
        title: "Universal Alignment",
        description: "Live in harmony with higher spiritual truths",
        icon: <Infinity className="w-5 h-5" />,
      },
      {
        title: "Transformational Impact",
        description: "Guide others while fulfilling your highest purpose",
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
  },
];

const tabItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05, y: -5, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" },
  tap: { scale: 0.98 },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const topicCardVariants = {
  initial: { opacity: 0, y: 15 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" },
  }),
  hover: { scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
  tap: { scale: 0.98 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function SkillMasteryPaths() {
  const [selectedPath, setSelectedPath] = useState(paths[0].id);
  const router = useRouter();

  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 md:pt-20 md:pb-16 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,165,0,0.15)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
              Master Your Journey
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-xl md:max-w-3xl mx-auto mb-6 md:mb-8">
              Explore curated paths designed to guide you through
              self-discovery, personal growth, and the attainment of spiritual
              mastery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Paths Section */}
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedPath} onValueChange={setSelectedPath}>
            <TabsList className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-6 mb-12 md:mb-32 bg-transparent h-auto">
              {paths.map((path) => (
                <TabsTrigger
                  key={path.id}
                  value={path.id}
                  className="flex-1 p-4 md:p-6 h-auto rounded-lg shadow-lg relative overflow-hidden group transition-transform transform hover:scale-105"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    {/* Icon Container */}
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110 shadow-md group-hover:shadow-orange-500">
                      {path.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold text-center transition-colors duration-300 group-hover:text-orange-500">
                      {path.title}
                    </h3>

                    {/* Level */}
                    <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-200">
                      {path.level}
                    </p>
                  </motion.div>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence>
              {paths.map((path) => (
                <TabsContent key={path.id} value={path.id}>
                  <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10"
                  >
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
                        {path.title}
                      </h2>
                      <p className="text-gray-400 mb-6 md:mb-8">
                        {path.description}
                      </p>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8 md:mb-10">
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                            Duration
                          </p>
                          <p className="font-semibold text-lg">
                            {path.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                            Level
                          </p>
                          <p className="font-semibold text-lg">{path.level}</p>
                        </div>
                      </div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button className="w-full md:w-auto bg-gradient-to-br from-orange-500 to-orange-900 hover:from-orange-600 hover:to-orange-300 shadow-md">
                          Embark on {path.title}{" "}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                      {path.topics.map((topic, index) => (
                        <motion.div
                          key={topic.title}
                          variants={topicCardVariants}
                          initial="initial"
                          animate="animate"
                          custom={index}
                          whileHover="hover"
                          whileTap="tap"
                          className="h-full w-full"
                        >
                          <Card className="p-4 md:p-5 rounded-xl bg-black/10 text-white border border-gray-600 hover:border-orange-400 transition-colors duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500 h-[180px] w-full flex flex-col justify-between">
                            <div className="flex items-start gap-3 md:gap-4">
                              <div className="p-2 md:p-3 rounded-md bg-orange-500/10 text-orange-400">
                                {topic.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1 md:mb-2">
                                  {topic.title}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {topic.description}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8 bg-black/10 border border-orange-500 shadow-lg shadow-orange-500 rounded-lg text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
              Ready to Embrace Transformation?
            </h2>
            <p className="text-sm md:text-lg opacity-90 max-w-xl md:max-w-3xl mx-auto mb-6 md:mb-8 text-gray-400">
              Take a profound step towards self-realization and the mastery of
              your inner landscape. Your journey begins now.
            </p>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                size="lg"
                variant="secondary"
                className="w-full md:w-auto bg-white text-orange-600 hover:bg-gray-100 shadow-md"
                onClick={() => router.push("/auth/sign-up")}
              >
                Begin Your Transformation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
