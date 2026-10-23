"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";
import { GraduationCap, Award, Compass, Sparkles } from "lucide-react";

export default function AboutSection({ profile }) {
  const bio =
    profile?.bio ||
    "Passionate Full-Stack Web Developer skilled in React.js, Next.js, Node.js, Express.js, and MongoDB. Committed to crafting high-performance, responsive web applications with exceptional user experiences.";
  const journey =
    profile?.aboutJourney ||
    "Graduated with a Diploma in Engineering in Computer Science and Technology (CST) from Barisal Polytechnic Institute. Advanced my skills through rigorous web development training at Programming Hero and People N Tech.";

  const stats = [
    { label: "Completed Projects", value: profile?.stats?.projectsCompleted || "15+" },
    { label: "Years Experience", value: profile?.stats?.yearsExperience || "2+" },
    { label: "Satisfied Clients", value: profile?.stats?.satisfiedClients || "10+" },
    { label: "GitHub Contributions", value: profile?.stats?.contributions || "400+" },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              01 // Background &amp; Story
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Turning Vision Into <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                impactful web solutions.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            A developer who merges design precision with backend architectural stability.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Card */}
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-card p-4 aspect-[4/5] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] light:from-white/90 via-transparent to-transparent z-10 opacity-70" />
              <Image
                src="/assets/jifan.png"
                alt="B.M. Jifan Mahmud workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-500 scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                  Full-Stack Engineer
                </span>
                <p className="text-lg font-serif italic text-white font-medium">
                  &ldquo;Striving to continuously improve technical skills and craft world-class software.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Milestones */}
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div className="space-y-6 text-zinc-300 light:text-zinc-700 leading-relaxed">
              <p className="text-lg font-normal leading-relaxed text-zinc-200 light:text-zinc-800">
                {bio}
              </p>
              <p className="text-base text-zinc-400 light:text-zinc-600 leading-relaxed">
                {journey}
              </p>
            </div>

            {/* Credentials Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white light:text-zinc-900">
                    Barisal Polytechnic Institute
                  </h4>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-0.5">
                    Diploma in Engg. (Computer Science &amp; Technology)
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white light:text-zinc-900">
                    Professional Training
                  </h4>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-0.5">
                    Programming Hero &amp; People N Tech
                  </p>
                </div>
              </div>
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10 light:border-zinc-200">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
