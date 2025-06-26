import TeamMemberCard from "@/components/TeamMemberCard";
import { team } from "@/data/teamData";

export default function TeamPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-10 text-center">Our Team</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <TeamMemberCard
              key={idx}
              name={member.name}
              position={member.position}
              email={member.email}
              number={member.number}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 