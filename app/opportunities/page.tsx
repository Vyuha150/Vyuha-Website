"use client";

import React from "react";
import MissionValues from "@/components/opportunityComponents/MissionValues";
import TeamCulture from "@/components/opportunityComponents/TeamCulture";
import InternalMobility from "@/components/opportunityComponents/InternalMobility";
import CommunityContributions from "@/components/opportunityComponents/CommunityContributions";
import CoreTeamRoles from "@/components/opportunityComponents/CoreTeamRoles";
import FormTeam from "@/components/opportunityComponents/FormTeam";
import EnhanceClub from "@/components/opportunityComponents/EnhanceClub";
import Testimonials from "@/components/opportunityComponents/Testimonials";

export default function OpportunitiesPage() {
  return (
    <main className="text-white min-h-screen py-12 px-6">
      {/* Mission & Values Section */}
      <section id="mission-values" className="mb-12">
        <MissionValues />
      </section>

      {/* Team Culture Section */}
      <section id="team-culture" className="mb-12">
        <TeamCulture />
      </section>

      {/* Internal Mobility Section */}
      <section id="internal-mobility" className="mb-12">
        <InternalMobility />
      </section>

      {/* Community Contributions Section */}
      <section id="community-contributions" className="mb-12">
        <CommunityContributions />
      </section>

      {/* Core Team Roles Section */}
      <section id="core-team-roles" className="mb-12">
        <CoreTeamRoles />
      </section>

      {/* Form Your Team Section */}
      <section id="form-your-team" className="mb-12">
        <FormTeam />
      </section>

      {/* Enhance Your Existing Club Section */}
      <section id="enhance-club" className="mb-12">
        <EnhanceClub />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="mb-12">
        <Testimonials />
      </section>
    </main>
  );
}
