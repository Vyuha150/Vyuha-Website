export interface Internship {
  id: number;
  title: string;
  domain: string;
  duration: string;
  paid: boolean;
  paymentByStudent: boolean;
  description: string;
  requirements: string[];
}

export const internships: Internship[] = [
  {
    id: 1,
    title: "Frontend Web Development Internship",
    domain: "Web Development",
    duration: "3 Months",
    paid: true,
    paymentByStudent: false,
    description: "Work on real-world web projects using React and Tailwind CSS.",
    requirements: ["Basic HTML, CSS, JavaScript", "React knowledge preferred"],
  },
  {
    id: 2,
    title: "AI & Machine Learning Internship",
    domain: "Artificial Intelligence",
    duration: "2 Months",
    paid: false,
    paymentByStudent: false,
    description: "Participate in AI research and build ML models for real applications.",
    requirements: ["Python", "Basic ML concepts"],
  },
  {
    id: 3,
    title: "Business Analytics Internship",
    domain: "Business Analytics",
    duration: "1 Month",
    paid: false,
    paymentByStudent: true,
    description: "Learn business analytics tools and work on live case studies.",
    requirements: ["Excel", "Interest in business analysis"],
  },
]; 