export interface Mentor {
  _id: string; // MongoDB ObjectId is a string
  name: string;
  photo: string;
  skills: string[];
  industry: string;
  experience: string;
  mentorshipStyle: string;
  availability: string;
}
