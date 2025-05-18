"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";

const CTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating particles consistent with other components
    const createParticles = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full opacity-0";

        const colors = ["bg-white/30", "bg-orange-500/20", "bg-orange-400/15"];
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        particle.classList.add(colorClass);

        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const animDuration = Math.random() * 15 + 5;
        particle.style.animation = `float ${animDuration}s infinite ease-in-out`;

        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;

        container.appendChild(particle);
      }
    };

    createParticles();

    return () => {
      if (containerRef.current) {
        const particles = containerRef.current.querySelectorAll(
          'div[class*="absolute rounded-full"]'
        );
        particles.forEach((particle: Element) => particle.remove());
      }
    };
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden z-[1]"
      >
        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) translateX(10px) rotate(5deg);
            }
            50% {
              transform: translateY(-40px) translateX(-15px) rotate(-5deg);
            }
            75% {
              transform: translateY(-20px) translateX(5px) rotate(3deg);
            }
          }
        `}</style>

        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] z-[1]"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-orange-400/10 blur-[100px] z-[1]"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 z-[2]" />

      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <motion.div
          className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{
            boxShadow: "0 0 30px 5px rgba(249, 115, 22, 0.2)",
            borderColor: "rgba(249, 115, 22, 0.4)",
          }}
        >
          <div className="p-10 md:p-14">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to <span className="text-white/90">Transform</span> Your
                Ideas?
              </motion.h2>

              <motion.p
                className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto font-outfit"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join Vyuha to connect with innovators, gain skills, and make an
                impact. Together, we can build solutions that matter.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href={"/join"}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px 2px rgba(249, 115, 22, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-medium font-outfit transition-all duration-300 shadow-lg shadow-orange-500/20 group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Join Our Community
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                  </motion.button>
                </Link>

                <Link href={"/contact"}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      borderColor: "rgba(249, 115, 22, 0.8)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-medium font-outfit transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-2">
                      Contact Us
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
