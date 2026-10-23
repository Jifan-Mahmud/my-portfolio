"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react";
import { LogoGithub } from "@gravity-ui/icons";

export default function ProjectsSection({ projects }) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Full-Stack", "Frontend", "MERN"];

  const filteredProjects =
    filter === "All"
      ? projects || []
      : (projects || []).filter(
          (p) =>
            p.category?.toLowerCase() === filter.toLowerCase() ||
            p.techStack?.some((t) => t.toLowerCase() === filter.toLowerCase())
        );

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              03 // Featured Works
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Recent Projects &amp; <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                architectural case studies.
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                    : "glass-card text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project._id || idx}
              variants={fadeIn("up", idx * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/40 transition-all duration-300"
            >
              {/* Image Preview with Hover Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                <Image
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={project.title}
                  fill
                  unoptimized={Boolean(project.image?.startsWith("data:"))}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Featured Tag */}
                {project.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black shadow-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Content Block */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(project.techStack || []).slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-white/5 light:bg-zinc-200 text-[11px] font-mono text-zinc-300 light:text-zinc-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-white light:text-zinc-950 group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-zinc-400 light:text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-6 pt-4 border-t border-white/5 light:border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 hover:border-amber-400 text-zinc-300 hover:text-amber-400 transition-colors"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-white/10 hover:border-amber-400 text-zinc-300 hover:text-amber-400 transition-colors"
                        title="GitHub Repository"
                      >
                        <LogoGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project._id}`}
                    className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
