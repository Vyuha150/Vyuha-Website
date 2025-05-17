"use client";

import React, { useEffect, useState } from "react";
import { threads } from "@/data/threadsData";

export default function ThreadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [thread, setThread] = useState<any>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      const threadId = parseInt(resolvedParams.id);
      const selectedThread = threads.find((t) => t.id === threadId);
      setThread(selectedThread);
    });
  }, [params]);

  if (!thread) {
    return (
      <main className="min-h-screen mt-4 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Thread not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 mt-4 text-white">
      {/* Thread Title */}
      <h1 className="text-4xl font-bold text-orange-500 mb-4">
        {thread.title}
      </h1>

      {/* Thread Description */}
      <p className="text-gray-300 leading-relaxed mb-6">{thread.description}</p>

      {/* Replies Section */}
      <section className="bg-black/70 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Replies</h2>
        <ul className="space-y-4">
          {thread.replies &&
            thread.replies.map((reply: string, index: number) => (
              <li
                key={index}
                className="bg-black p-4 rounded-lg shadow-md border border-gray-700"
              >
                {reply}
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
