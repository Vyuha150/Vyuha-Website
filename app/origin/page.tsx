"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function InitiativesPage() {
  return (
    <main className="min-h-screen text-white mt-10 md:mt-24">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between h-auto px-4 space-y-6 md:space-y-0">
        {/* Right Content (Logo) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col items-center space-y-6 group md:order-2"
        >
          {/* Image */}
          <img
            src="/logo.png"
            alt="Vyuha Initiatives"
            className="w-full max-w-md rounded-lg shadow-lg"
          />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 w-full bg-orange-500/80 rounded-b-lg py-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-2xl font-bold text-white">300+ Events</p>
            <p className="text-2xl font-bold text-white">
              10,000 Students Engaged
            </p>
          </div>
        </motion.div>

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-lg space-y-3 md:order-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-orange-400">
            Initiatives from Vyuha
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 italic">
            " कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। "
          </h2>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-orange-400">
              Our Work, Our Impact
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Explore the diverse initiatives and impactful projects undertaken
              by the Vyuha Student Community. From empowering students through
              leadership and skill development to collaborating with government
              organizations, universities, and NGOs, our portfolio showcases
              seminars, outreach activities, health initiatives, podcasts, and
              innovative solutions. Witness how we contribute to community
              service, student engagement, and societal development through
              dedication and innovation.
            </p>
          </div>
          <button className="mt-6 px-6 py-3 bg-transparent border border-white hover:bg-orange-500 text-orange-500 font-semibold rounded-lg shadow-md hover:text-white hover:scale-105 transition-all duration-300 ease-in-out hover:border-transparent">
            Know More
          </button>
        </motion.div>
      </section>

      {/* New Section */}
      <section className="mt-16 px-4 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold text-orange-400">
            We Work, We Achieve
          </h2>
          <p className="text-lg text-gray-300">
            Explore our diverse projects focusing on electoral literacy,
            technology skills, outreach activities.
          </p>
        </motion.div>

        {/* Achievements Section */}
        <div className="relative mt-12">
          {/* Vertical Track */}
          <div className="absolute md:left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange-400/50 left-0"></div>

          {/* First Achievement */}
          <Achievement
            title="TRAINING AND ON DEMAND SKILLING"
            description="Our on-demand skilling programs in Java, C, Python (Apeksha), and Editing (SIL) provided valuable technical training to participants. These programs significantly enhanced the employability of the attendees by teaching them in-demand skills, offering hands-on experience, and providing practical knowledge. This initiative helped participants advance in their careers, boosting their competencies and opening up new career growth opportunities."
            image="/portfolio/achievement1.jpg"
            reverse={false}
          />

          {/* Second Achievement */}
          <Achievement
            title="OUTREACH ACTIVITIES"
            description="Our large social internship program engaged 1500 students in meaningful community work, with a focus on projects like the restoration of SVR and Krishna Canal. This program not only provided students with hands-on experience in social work but also had a considerable impact on the environment and local infrastructure. The restoration projects improved water management and environmental conditions, while the students gained valuable insights and skills in community service and environmental stewardship."
            image="/portfolio/achievement2.jpg"
            reverse={true}
          />

          {/* Third Achievement */}
          <Achievement
            title="Social & Technical Internships"
            description="Providing Technical and social internships to students enabling them to face different real world problem statements and getting expert guidance from professionals in the process of solving the problems along with certifications. Our previous works includes organizing Social internships at KL University providing various opportunities to 1500 students working in 7 villages, collecting data"
            image="/portfolio/achievement3.jpg"
            reverse={false}
          />

          {/* Fourth Achievement */}
          <Achievement
            title="Aware Andhra Campaign"
            description="Our Volunteers made a remarkable effort by making 500+ new voter registration across various disciplines. Our contribution was recognised by Election Commission of India and awarded our members as best Campus Ambassador for SVEEP initiative."
            image="/portfolio/achievement4.jpg"
            reverse={true}
          />

          {/* Fifth Achievement */}
          <Achievement
            title="Empowering Lives Through CPR Training"
            description="The Vyuha Student Community is proud to have conducted a CPR (Cardiopulmonary Resuscitation) Training Program, empowering 1600 students with lifesaving skills. This initiative aimed to equip students with the ability to respond effectively during medical emergencies, emphasizing the importance of swift and informed action in saving lives."
            image="/portfolio/achievement5.jpg"
            reverse={false}
          />
        </div>
        <div className="flex justify-center items-center">
          <button className="mt-6 px-6 py-3 bg-transparent border border-white hover:bg-orange-500 text-orange-500 font-semibold rounded-lg shadow-md hover:text-white hover:scale-105 transition-all duration-300 ease-in-out hover:border-transparent">
            Know More
          </button>
        </div>
      </section>
    </main>
  );
}

function Achievement({ title, description, image, reverse }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 1 }}
      className={`relative flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } items-center md:items-start space-y-6 md:space-y-10 mb-10`}
    >
      {/* Content */}
      <div className={`md:w-1/2 space-y-4 ${reverse ? "md:pl-6" : "md:pr-6"}`}>
        <h3 className="text-2xl font-bold text-orange-400 text-center md:text-start">
          {title}
        </h3>
        <p className="text-gray-300 text-center md:text-start">{description}</p>
      </div>

      {/* Circle */}
      <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <div
          className={`w-8 h-8 rounded-full bg-orange-400 ${
            isInView ? "animate-pulse" : ""
          }`}
        ></div>
      </div>

      {/* Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={image}
          alt={title}
          className={`w-full h-72 rounded-lg shadow-lg ${
            !reverse ? "ml-6" : "mr-6"
          } hover:scale-105 transition-transform duration-300  border border-orange-400 rounded-lg overflow-hidden`}
        />
      </div>
    </motion.div>
  );
}
