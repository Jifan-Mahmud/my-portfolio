"use client";

import { motion } from "motion/react";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { Code, Database, Server, Wrench, Shield, CheckCircle2 } from "lucide-react";

export default function SkillsSection({ skills }) {
  const categories = [
    { name: "Frontend", icon: Code, color: "text-amber-400" },
    { name: "Backend", icon: Server, color: "text-emerald-400" },
    { name: "Database", icon: Database, color: "text-blue-400" },
    { name: "Tools", icon: Wrench, color: "text-purple-400" },
  ];

  const getSkillsForCategory = (cat) => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.filter((s) => s.category?.toLowerCase() === cat.toLowerCase());
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              02 // Technical Proficiencies
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Core Skills &amp; <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                technological capabilities.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            A battle-tested stack tuned for building performant full-stack systems.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const catSkills = getSkillsForCategory(cat.name);
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.name}
                variants={fadeIn("up", idx * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="glass-card p-6 rounded-3xl flex flex-col justify-between hover:border-amber-400/30 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-white/5 ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white light:text-zinc-900">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {catSkills.length > 0 ? (
                      catSkills.map((skill) => (
                        <div key={skill._id || skill.name} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-300 light:text-zinc-700 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                              {skill.name}
                            </span>
                            <span className="text-zinc-400 font-mono">{skill.level || 85}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 light:bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.level || 85}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 light:border-zinc-200 text-[11px] text-zinc-500 light:text-zinc-400 flex items-center justify-between">
                  <span>Standardized Best Practices</span>
                  <span>v2026</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
