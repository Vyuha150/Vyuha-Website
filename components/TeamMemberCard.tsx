import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberCardProps {
  name: string;
  position: string;
  email: string;
  number: string;
  image: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, position, email, number, image }) => {
  return (
    <Card className="bg-black/80 border border-orange-500 hover:shadow-orange-500/50 text-white transition-shadow duration-300">
      <CardContent className="flex flex-col items-center p-6">
        <div className="w-28 h-28 mb-4 relative rounded-full overflow-hidden border-4 border-orange-500">
          <Image
            src={image + ".jpg"}
            alt={name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <h3 className="text-xl font-bold text-orange-500 mb-1 text-center">{name}</h3>
        <p className="text-sm text-gray-300 mb-2 text-center">{position}</p>
        <p className="text-xs text-gray-400 mb-1 text-center">{email}</p>
        <p className="text-xs text-gray-400 text-center">{number}</p>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard; 