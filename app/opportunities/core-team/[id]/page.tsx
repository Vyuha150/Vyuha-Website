"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function CoreTeamRoleDetailsPage() {
  const params = useParams();
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedRoles, setRelatedRoles] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await axios.get(
          `${apiUrl}/api/core-team-role/${params.id}`
        );
        setRole(res.data);

        // Fetch all roles to show related roles
        const allRes = await axios.get(`${apiUrl}/api/core-team-role`);
        setRelatedRoles(allRes.data.filter((r: any) => r._id !== params.id));
      } catch (err) {
        setRole(null);
        setRelatedRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [params.id]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);
    setSubmitErr(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await axios.post(`${apiUrl}/api/core-team-application`, {
        roleId: role._id,
        ...form,
      });
      if (res.status === 201) {
        setSubmitMsg("Your application has been submitted!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setSubmitErr("Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitErr(
        err.response?.data?.message || "Error submitting application."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  if (!role) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Role not found</h1>
      </main>
    );
  }

  return (
    <main className="text-white min-h-screen py-12 px-6 mt-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">
          {role.title}
        </h1>
        <p className="text-gray-300 leading-relaxed mb-6">{role.description}</p>

        {/* Responsibilities Section */}
        {role.responsibilities && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {role.responsibilities.map(
                (responsibility: string, index: number) => (
                  <li key={index}>{responsibility}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Requirements Section */}
        {role.requirements && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {role.requirements.map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Apply for this Role
          </h2>
          <form
            onSubmit={handleApply}
            className="bg-black/60 border border-orange-500 hover:shadow-orange-500 p-6 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-400 mb-2">
                Why are you a good fit for this role?
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleFormChange}
                className="w-full p-3 bg-black border border-gray-700 text-white rounded-lg"
                placeholder="Write a brief message"
                rows={4}
                required
              ></textarea>
            </div>
            {submitMsg && (
              <div className="text-green-500 mb-2">{submitMsg}</div>
            )}
            {submitErr && <div className="text-red-500 mb-2">{submitErr}</div>}
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
            >
              Submit Application
            </button>
          </form>
        </div>

        {/* Related Roles Section */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Related Roles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedRoles.map((relatedRole) => (
              <div
                key={relatedRole._id}
                className="p-4 bg-black/100 border border-gray-700 hover:border-orange-500 hover:shadow-orange-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-orange-500">
                  {relatedRole.title}
                </h3>
                <p className="text-gray-300 mt-2">{relatedRole.description}</p>
                <a
                  href={`/opportunities/core-team/${relatedRole._id}`}
                  className="text-orange-500 hover:underline mt-4 inline-block"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
