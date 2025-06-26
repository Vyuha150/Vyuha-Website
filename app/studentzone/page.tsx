import { courses } from "@/data/coursesData";
import { mentors as mentorsA } from "@/data/mentorsData";
// import { mentors as mentorsB } from "@/data/mentors";
import { projects } from "@/data/projectsData";
import { internships } from "@/data/internshipData";
import CourseCard from "@/components/CourseCard";
import MentorCard from "@/components/MentorCard";
import ProjectCard from "@/components/projectCard";

export default function StudentZonePage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-12 text-center">Student Zone</h1>
        {/* Courses Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={{ ...course, _id: String(course.id) }} />
            ))}
          </div>
        </section>
        {/* Mentorships Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">Mentorships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorsA.map((mentor, idx) => (
              <MentorCard key={mentor.id || idx} mentor={{ ...mentor, _id: String(mentor.id) }} />
            ))}
            {/* {mentorsB.map((mentor, idx) => (
              <div key={mentor.name + idx} className="bg-white/5 border border-orange-500/20 rounded-xl p-6 flex flex-col items-center">
                <img src={mentor.photo} alt={mentor.name} className="w-24 h-24 object-cover rounded-full mb-4" />
                <h3 className="text-lg font-bold text-orange-500 mb-1">{mentor.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{mentor.title}</p>
                <p className="text-xs text-gray-400 text-center mb-2">{mentor.bio}</p>
              </div>
            ))} */}
          </div>
        </section>
        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={{ ...project, _id: String(project.id) }} />
            ))}
          </div>
        </section>
        {/* Internships Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">Internships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((intern) => (
              <div key={intern.id} className="bg-white/5 border border-orange-500/20 rounded-xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-orange-500 mb-1">{intern.title}</h3>
                <p className="text-sm text-gray-300 mb-1">Domain: {intern.domain}</p>
                <p className="text-sm text-gray-300 mb-1">Duration: {intern.duration}</p>
                <p className="text-sm text-gray-300 mb-1">{intern.paid ? "Paid" : intern.paymentByStudent ? "Payment by Student" : "Unpaid"}</p>
                <p className="text-xs text-gray-400 mb-2">{intern.description}</p>
                <ul className="list-disc list-inside text-xs text-gray-400 mb-2">
                  {intern.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 