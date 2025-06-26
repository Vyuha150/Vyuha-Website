"use client";

import React, { useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import axios from "axios";

// Define types for the form data
interface CentralTeamFormData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  document: File | null;
}

interface OpenClubFormData {
  collegeName: string;
  clubName: string;
  phone: string;
  vision: string;
  document: File | null;
}

interface CollaborateFormData {
  clubName: string;
  collegeName: string;
  phone: string;
  collaborationDetails: string;
  document: File | null;
}

// Add new type for join club form
interface JoinClubFormData {
  studentName: string;
  email: string;
  phone: string;
  clubName: string;
  collegeName: string;
  note: string;
  document: File | null;
}

export default function ClubPartnerForms() {
  const router = useRouter();

  const handleSubmit = async (
    endpoint: string,
    formData: CentralTeamFormData | OpenClubFormData | CollaborateFormData | JoinClubFormData
  ): Promise<void> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value as string | Blob);
        }
      });

      const response = await axios.post(
        `${apiUrl}/api/club-partner/${endpoint}`,
        formDataToSend
      );

      if (response.status === 201) {
        alert("Form submitted successfully!");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen text-white">
      <section className="py-12 px-4 md:py-16 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full space-y-3 mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-orange-400 mb-8">
            Clubs working under Vyuha Community
          </h1>
          <h4 className="text-2xl md:text-3xl text-gray-300">
            In Vyuha we have well Established student administered clubs with
            their own motives, policy and approach leading to holistic
            development of members within.
          </h4>
        </motion.div>

        <Achievement
          title="Safe Life"
          description="In collaboration with APSACS and UNICEF, Safe Life Club focuses on promoting health and wellness through four key pillars:"
          image="/clubs/club1.jpg"
          reverse={false}
          additionalContent={[
            {
              heading: "Non-Communicable Diseases (NCDs)",
              content:
                "Creating awareness and preventive measures for chronic conditions like diabetes, hypertension, and cancer.",
            },
            {
              heading: "Diet and Nutrition",
              content:
                "Educating on the importance of a balanced diet and healthy eating habits.",
            },
            {
              heading: "Yoga and Fitness",
              content:
                "Encouraging physical activity, mental well-being, and fitness practices like yoga.",
            },
            {
              heading: "HIV/AIDS Awareness",
              content:
                "Advocating for awareness, prevention, and support related to HIV/AIDS.",
            },
          ]}
        />

        <Achievement
          title="Electoral Literacy Club"
          description="Under the guidance of AICTE, the Electoral Literacy Club aims to enhance electoral literacy among students and citizens. The club focuses on educating people about the democratic process, improving understanding of electoral rights and responsibilities, and facilitating voter registrations to ensure active participation in elections. Students from Electoral Literacy club also conducted SVEEP activity initiated by Election Commission of India throughout the collage."
          image="/clubs/club2.jpg"
          reverse={true}
        />

        <Achievement
          title="Innovation and Incubation club"
          description="This club fosters an entrepreneurial mindset by working on innovative ways to engage students and help them develop startup ideas. It builds a bridge between students and professionals by providing mentorship and guidance, turning ideas into viable businesses and helping students connect with the startup ecosystem.."
          image="/clubs/club3.jpg"
          reverse={false}
        />

        <Achievement
          title="Vidhura AI and Entrepreneurship Club"
          description="To improve the culture of innovation and entrepreneurship among students, focusing on AI, Data Science, and technology-related domains. The club aims to act as a bridge between academia, industry, and government organizations to promote real-world project-based learning and develop successful business models."
          image="/clubs/club4.jpg"
          reverse={true}
        />

        <Achievement
          title="Spirituality Club"
          description="The Spirituality Club is dedicated to promoting spiritual growth and well-being through various activities and discussions. It aims to create a supportive environment for students to explore their spiritual beliefs, deepen their understanding of different religions, and engage in meaningful discussions about life's purpose and values."
          image="/clubs/club5.jpg"
          reverse={false}
        />

        <Achievement
          title="Yoga Club"
          description="The Yoga Club is dedicated to promoting physical and mental well-being through yoga practices. It aims to create a supportive environment for students to learn and practice yoga, improve their physical health, and develop a sense of inner peace and balance."
          image="/clubs/club6.jpg"
          reverse={true}
        />

        <div className="max-w-7xl mx-auto space-y-16">
          {/* Form 1: Join Vyuha Central Team */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-black/70 p-8 rounded-lg shadow-xl hover:shadow-orange-500"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
                Join the Vyuha Central Team
              </h2>
              <form
                className="space-y-6"
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const formData: CentralTeamFormData = {
                    name: (
                      target.elements.namedItem("name") as HTMLInputElement
                    ).value,
                    email: target.email.value,
                    phone: target.phone.value,
                    skills: target.skills.value,
                    document: target.document.files?.[0] || null,
                  };

                  if (
                    !formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.skills
                  ) {
                    alert(
                      "All fields are required. Please fill out all fields."
                    );
                    return; // Stop form submission
                  }

                  handleSubmit("join-central-team", formData).then(() => {
                    target.reset();
                  });
                }}
              >
                <div>
                  <label htmlFor="name" className="block text-md font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-md font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-md font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your number"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="skills" className="block text-md font-medium">
                    Skills/Expertise
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    placeholder="Describe your skills or expertise"
                    rows={4}
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="document"
                    className="block text-md font-medium"
                  >
                    Upload Document (Optional)
                  </label>
                  <input
                    type="file"
                    id="document"
                    name="document"
                    className="w-full bg-transparent mt-2 p-[6px] text-white border border-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-transform"
                >
                  Submit
                </motion.button>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center"
            >
              <img
                src="/club-partner/club-partner-3.jpg"
                alt="Join Vyuha Central Team"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center order-last lg:order-first rounded-xl"
            >
              <img
                src="/club-partner/club-partner-1.jpg"
                alt="Open a New Club"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-black/70 p-8 rounded-lg shadow-xl hover:shadow-orange-500"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
                Open a New Club in Your College
              </h2>
              <form
                className="space-y-6"
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const formData: OpenClubFormData = {
                    collegeName: target["college-name"].value,
                    clubName: target["club-name"].value,
                    phone: target.phone.value,
                    vision: target.vision.value,
                    document: target.document.files?.[0] || null,
                  };

                  if (
                    !formData.collegeName ||
                    !formData.clubName ||
                    !formData.phone ||
                    !formData.vision
                  ) {
                    alert(
                      "All fields are required. Please fill out all fields."
                    );
                    return;
                  }

                  handleSubmit("open-club", formData).then(() => {
                    target.reset();
                  });
                }}
              >
                <div>
                  <label
                    htmlFor="college-name"
                    className="block text-md font-medium"
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    id="college-name"
                    name="college-name"
                    placeholder="Your college name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="club-name"
                    className="block text-md font-medium"
                  >
                    Proposed Club Name
                  </label>
                  <input
                    type="text"
                    id="club-name"
                    name="club-name"
                    placeholder="Proposed club name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-md font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your number"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="vision" className="block text-md font-medium">
                    Vision for the Club
                  </label>
                  <textarea
                    id="vision"
                    name="vision"
                    placeholder="Describe your vision for the club"
                    rows={4}
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="document"
                    className="block text-md font-medium"
                  >
                    Upload Document (Optional)
                  </label>
                  <input
                    type="file"
                    id="document"
                    name="document"
                    className="w-full bg-transparent mt-2 p-[6px] text-white border border-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-transform"
                >
                  Submit
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Form 3: Join an Existing Club */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-black/70 p-8 rounded-lg shadow-xl hover:shadow-orange-500"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text">
                Join an Existing Club
              </h2>
              <form
                className="space-y-6"
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const formData: JoinClubFormData = {
                    studentName: target["student-name"].value,
                    email: target.email.value,
                    phone: target.phone.value,
                    clubName: target["club-name"].value,
                    collegeName: target["college-name"].value,
                    note: target["note"].value,
                    document: target.document.files?.[0] || null,
                  };

                  if (
                    !formData.studentName ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.clubName ||
                    !formData.collegeName ||
                    !formData.note
                  ) {
                    alert(
                      "All fields are required. Please fill out all fields."
                    );
                    return;
                  }

                  handleSubmit("join-existing-club", formData).then(() => {
                    target.reset();
                  });
                }}
              >
                <div>
                  <label htmlFor="student-name" className="block text-md font-medium">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="student-name"
                    name="student-name"
                    placeholder="Your name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-md font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-md font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your number"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="club-name"
                    className="block text-md font-medium"
                  >
                    Club Name
                  </label>
                  <select
                    id="club-name"
                    name="club-name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    defaultValue=""
                  >
                    <option value="" className="text-black" disabled>Select a club</option>
                    <option className="text-black" value="Safe Life">Safe Life</option>
                    <option className="text-black" value="Electoral Literacy Club">Electoral Literacy Club</option>
                    <option className="text-black" value="Innovation and Incubation club">Innovation and Incubation club</option>
                    <option className="text-black" value="Vidhura Ablack Entrepreneurship Club">Vidhura AI and Entrepreneurship Club</option>
                    <option className="text-black" value="Spirituality Club">Spirituality Club</option>
                    <option className="text-black" value="Yoga Club">Yoga Club</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="college-name"
                    className="block text-md font-medium"
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    id="college-name"
                    name="college-name"
                    placeholder="Your college name"
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="note"
                    className="block text-md font-medium"
                  >
                    Why do you want to join this club?
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    placeholder="Tell us why you want to join this club"
                    rows={4}
                    className="w-full bg-transparent mt-2 p-[6px] border border-white text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="document"
                    className="block text-md font-medium"
                  >
                    Upload Document (Optional)
                  </label>
                  <input
                    type="file"
                    id="document"
                    name="document"
                    className="w-full bg-transparent mt-2 p-[6px] text-white border border-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-transform"
                >
                  Join Club
                </motion.button>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center rounded-xl"
            >
              <img
                src="/club-partner/club-partner-2.jpg"
                alt="Join with an Existing Club"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
function Achievement({
  title,
  description,
  image,
  reverse,
  additionalContent,
}: {
  title: string;
  description: string;
  image: string;
  reverse: boolean;
  additionalContent?: { heading: string; content: string }[]; // Optional prop for additional content
}) {
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
      } items-center space-y-6 md:space-y-10 mb-10`}
    >
      {/* Content */}
      <div className={`md:w-1/2 space-y-4 ${reverse ? "md:pl-6" : "md:pr-6"}`}>
        <h2 className="text-4xl font-bold text-orange-400 text-center md:text-start">
          {title}
        </h2>
        <p className="text-gray-300 text-center md:text-start text-lg">
          {description}
        </p>

        {/* Render additional content if provided */}
        {additionalContent && (
          <ul className="text-gray-300 ">
            {additionalContent.map((item, index) => (
              <li key={index}>
                <strong className="text-white">{item.heading}:</strong>{" "}
                {item.content}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={image}
          alt={title}
          className={`w-full h-80 rounded-lg shadow-lg ${
            !reverse ? "ml-6" : "mr-6"
          } hover:scale-105 transition-transform duration-300 border border-orange-400 rounded-lg overflow-hidden`}
          style={{ objectFit: "cover" }}
        />
      </div>
    </motion.div>
  );
}
