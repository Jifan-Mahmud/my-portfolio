"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection({ testimonials }) {
  const defaultTestimonials = [
    {
      name: "Tanvir Ahmed",
      role: "Senior Instructor",
      company: "Programming Hero",
      feedback:
        "Jifan is an exceptionally hardworking and dedicated developer. His quick grasp of full-stack concepts, responsive layouts, and problem-solving mindset make him stand out.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "David Miller",
      role: "Product Manager",
      company: "Nexus Labs",
      feedback:
        "Working with Jifan was seamless! He transformed our requirements into a performant, pixel-perfect web application ahead of deadline.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              06 // Trust &amp; Endorsements
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Words From Mentors <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                and collaborators.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            Feedback on code craftsmanship, dedication, and communication.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              variants={fadeIn("up", idx * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 relative group"
            >
              <div>
                {/* Star Ratings */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-base text-zinc-300 light:text-zinc-700 leading-relaxed italic font-serif">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5 light:border-zinc-200">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                  <Image
                    src={
                      item.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                    }
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white light:text-zinc-900">{item.name}</h4>
                  <p className="text-xs text-zinc-400 light:text-zinc-600">
                    {item.role} {item.company ? `• ${item.company}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
