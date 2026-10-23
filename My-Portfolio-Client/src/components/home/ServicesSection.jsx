"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";

export default function ServicesSection({ services }) {
  const defaultServices = [
    {
      number: "01",
      title: "Full-Stack Web Apps",
      description:
        "Building scalable, end-to-end web applications with Next.js, Express, and MongoDB that handle real-world traffic seamlessly.",
    },
    {
      number: "02",
      title: "Modern Frontend & UI/UX",
      description:
        "Translating complex Figma mockups into responsive, accessible, and fast interfaces using Tailwind CSS and HeroUI.",
    },
    {
      number: "03",
      title: "Secure REST APIs & Auth",
      description:
        "Architecting protected backend services using JWT, Better Auth, role guards, and security best practices.",
    },
    {
      number: "04",
      title: "Database & Cloud Deploy",
      description:
        "Designing optimal MongoDB schemas, indexes, and seamless production deployments on Vercel and Render.",
    },
  ];

  const items = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header matching user's image: "I CAN HELP YOU WITH" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              04 // Core Offerings
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              I Can Help You With &bull; <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                bespoke digital engineering.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            From initial prototype to production deployment, high standards are maintained at every step.
          </p>
        </div>

        {/* 4-Column Editorial Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service, idx) => (
            <motion.div
              key={service._id || idx}
              variants={fadeIn("up", idx * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col justify-between p-6 rounded-3xl glass-card hover:border-amber-400/40 transition-all duration-300 group"
            >
              <div>
                <span className="font-serif italic text-3xl sm:text-4xl text-amber-400/60 group-hover:text-amber-400 font-normal transition-colors block mb-6">
                  {service.number || `0${idx + 1}`}
                </span>

                <h3 className="text-xl font-bold text-white light:text-zinc-950 group-hover:text-amber-400 transition-colors mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-zinc-400 light:text-zinc-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 light:border-zinc-200">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 light:text-zinc-400">
                  Reliable &bull; Modern
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
