"use client";

import React from "react";
import ForumIntro from "@/components/ForumIntro";
import ForumCategories from "@/components/ForumCategories";
import ThreadList from "@/components/ThreadList";
import UserProfile from "@/components/UserProfile";

export default function CommunityForumPage() {
  return (
    <main className="min-h-screen text-white py-12 px-6">
      <ForumIntro />
      <div className="mt-12">
        <ForumCategories />
      </div>
      <div className="mt-12">
        <ThreadList />
      </div>
    </main>
  );
}
