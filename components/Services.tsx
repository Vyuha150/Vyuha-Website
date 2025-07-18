"use client";
import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Star,
  Megaphone,
  Lightbulb,
  Calendar,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

// Optimized background with reduced complexity
const BackgroundEffects = React.memo(() => (
  <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
    <style jsx>{`
      .glow-1,
      .glow-2 {
        position: absolute;
        border-radius: 50%;
        filter: blur(120px);
        will-change: transform, opacity;
      }
      .glow-1 {
        top: 33%;
        left: 50%;
        width: 500px;
        height: 500px;
        background: rgba(249, 115, 22, 0.1);
        transform: translateX(-50%);
        animation: pulse1 12s infinite ease-in-out;
      }
      .glow-2 {
        bottom: 25%;
        right: 25%;
        width: 300px;
        height: 300px;
        background: rgba(249, 115, 22, 0.1);
        animation: pulse2 12s 2s infinite ease-in-out;
      }
      @keyframes pulse1 {
        0%,
        100% {
          opacity: 0.25;
          transform: translateX(-50%) scale(0.85);
        }
        50% {
          opacity: 0.4;
          transform: translateX(-50%) scale(1);
        }
      }
      @keyframes pulse2 {
        0%,
        100% {
          opacity: 0.15;
          transform: scale(1);
        }
        50% {
          opacity: 0.3;
          transform: scale(0.9);
        }
      }
    `}</style>
    <div className="glow-1"></div>
    <div className="glow-2"></div>
  </div>
));
BackgroundEffects.displayName = "BackgroundEffects";

// More efficient ServiceCard with better accessibility
const ServiceCard = React.memo(
  ({ service, index }: { service: Service; index: number }) => (
    <motion.div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex gap-6">
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 transition-all duration-300 group-hover:bg-orange-500/20 flex-shrink-0">
          {service.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-3 font-outfit">
            {service.title}
          </h3>
          <p className="text-gray-300 font-outfit leading-relaxed">
            {service.description}
          </p>

          {service.link ? (
            <Link
              href={service.link}
              className="mt-4 inline-flex items-center gap-1 text-orange-400 font-medium group-hover:text-orange-300 transition-colors"
            >
              Learn more
              <ArrowRight
                size={14}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <div className="mt-4 inline-flex items-center gap-1 text-orange-400 font-medium group-hover:text-orange-300 transition-colors">
              Learn more
              <ArrowRight
                size={14}
                className="ml-1 transition-transform group-hover:translate-x-1"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
);
ServiceCard.displayName = "ServiceCard";

// Optimized CTA Button component
const CTAButton = React.memo(
  ({
    text,
    onClick,
    icon = true,
    className = "",
  }: {
    text: string;
    onClick?: () => void;
    icon?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-medium font-outfit transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        {icon && (
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </span>
    </button>
  )
);
CTAButton.displayName = "CTAButton";

const Services = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // More optimized transforms with proper clamping
  const y = useTransform(scrollYProgress, [0, 0.3], [20, 0], { clamp: true });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1], {
    clamp: true,
  });

  // Memoize services data
  const services = useMemo<Service[]>(
    () => [
      {
        title: "Digital Marketing",
        description:
          "A blend of professionals and students creating impactful digital strategy and content.",
        icon: <Megaphone className="w-8 h-8 text-orange-400" />,
        link: "/podcast-partner",
      },
      {
        title: "Business Strategy",
        description:
          "Building the right strategy for businesses to create inspiring brands and achieve targets.",
        icon: <Lightbulb className="w-8 h-8 text-orange-400" />,
        link: "/club-partner",
      },
      {
        title: "Events & Conferences",
        description:
          "Conducting impactful events with students and professionals, generating valuable leads.",
        icon: <Calendar className="w-8 h-8 text-orange-400" />,
        link: "/events",
      },
      {
        title: "Web Services",
        description:
          "End-to-end web development for a wide range of business requirements with tailored solutions.",
        icon: <Laptop className="w-8 h-8 text-orange-400" />,
        link: "/services/web-services",
      },
    ],
    []
  );

  // Memoized event handlers
  const handleGetStarted = useCallback(() => {
    router.push("/membership");
  }, []);

  const [consultOpen, setConsultOpen] = React.useState(false);

  const handleConsultation = useCallback(() => {
    setConsultOpen(true);
  }, []);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <BackgroundEffects />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 z-[2] pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ y, opacity }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="bg-white/10 backdrop-blur-sm text-xs font-medium text-orange-200 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <Star size={12} className="text-orange-400" />
              <span>Our Expertise</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
            Services <span className="text-white/90">We Provide</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-300 text-lg font-outfit">
            From strategy development to implementation and support, our
            services help your business thrive.
          </p>
        </div>

        {/* Services grid with optimized rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* CTA section with optimized animation */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 p-8 md:p-10 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-outfit">
                Ready to transform your ideas into reality?
              </h3>
              <p className="mt-2 text-gray-300 font-outfit">
                Partner with Vyuha to bring your vision to life with our
                expertise.
              </p>
            </div>

            <CTAButton
              text="Get Started"
              onClick={handleGetStarted}
              className="flex-shrink-0 w-full md:w-auto"
            />
          </div>
        </motion.div>

        {/* Bottom CTA button */}
        <div className="mt-16 flex justify-center">
          <CTAButton
            text="Schedule a Consultation"
            onClick={handleConsultation}
          />
          <ConsultationForm open={consultOpen} onOpenChange={setConsultOpen} />
        </div>
      </motion.div>

      {/* Consultation Form Dialog */}
      <ConsultationForm open={openDialog} onOpenChange={setOpenDialog} />
    </section>
  );
};

function ConsultationForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset, formState } = useForm();
  const onSubmit = (data: any) => {
    // TODO: Send data to your API
    toast.success("Consultation request submitted!");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-black/50 text-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Schedule a Consultation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("name", { required: true })}
            placeholder="Your Name"
            required
          />
          <Input
            {...register("email", { required: true })}
            type="email"
            placeholder="Your Email"
            required
          />
          <Input
            {...register("phone", { required: true })}
            placeholder="Phone Number"
            required
          />
          <Input
            {...register("preferredTime", { required: true })}
            type="datetime-local"
            placeholder="Preferred Time Slot"
            required
          />
          <Textarea
            {...register("message")}
            placeholder="Describe your requirements (optional)"
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-orange-500 text-white"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Services;
