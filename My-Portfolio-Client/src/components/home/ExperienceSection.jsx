"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";

export default function ExperienceSection({ experiences }) {
  const defaultExperiences = [
    {
      period: "2020 - 2024",
      title: "Diploma in Computer Science & Technology",
      organization: "Barisal Polytechnic Institute",
      type: "Education",
      description:
        "Comprehensive foundations in algorithms, data structures, computer networks, database systems, and software principles.",
    },
    {
      period: "2024 - 2025",
      title: "Complete Web Development",
      organization: "Programming Hero",
      type: "Training",
      description:
        "Intensive project-based development in MERN stack: React, Node.js, Express, MongoDB, Tailwind CSS, authentication, and cloud deployment.",
    },
    {
      period: "2024 - 2025",
      title: "Full-Stack Development Course",
      organization: "People N Tech",
      type: "Training",
      description:
        "Modern enterprise JavaScript workflows, real-world team project collaboration, Git branching models, and clean architecture.",
    },
    {
      period: "2024 - Present",
      title: "Full-Stack Freelance Developer",
      organization: "Remote / Self-Employed",
      type: "Work",
      description:
        "Developing bespoke client web apps, e-commerce storefronts, and dynamic dashboards with high performance and responsive design.",
    },
  ];

  const items = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              05 // Trajectory &amp; Training
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Education &amp; <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                practical experience.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            A solid academic foundation reinforced by rigorous modern web engineering courses.
          </p>
        </div>

        {/* Minimalist Editorial Timeline rows matching reference photo */}
        <div className="divide-y divide-white/10 light:divide-zinc-200">
          {items.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              variants={fadeIn("up", idx * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start group hover:bg-white/[0.02] light:hover:bg-zinc-50 transition-colors px-2 rounded-2xl"
            >
              {/* Left Column: Period */}
              <div className="md:col-span-3">
                <span className="text-sm font-mono text-zinc-400 light:text-zinc-500">
                  {item.period}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-amber-400 mt-1">
                  {item.type || "Milestone"}
                </span>
              </div>

              {/* Center Column: Title & Organization */}
              <div className="md:col-span-4">
                <h3 className="text-xl font-bold text-white light:text-zinc-950 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-zinc-300 light:text-zinc-700 mt-1">
                  {item.organization}
                </p>
              </div>

              {/* Right Column: Description */}
              <div className="md:col-span-5">
                <p className="text-sm text-zinc-400 light:text-zinc-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
