"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";
import { api } from "@/lib/api";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactSection({ profile }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. I will get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: res.message || "Failed to send message. Please try again.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "An error occurred while sending your message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              07 // Let&apos;s Connect
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Have An Idea? <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                let&apos;s build something great.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0">
            Open for full-time opportunities, collaborations, and contract projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact Info */}
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white light:text-zinc-900">
                Contact Information
              </h3>
              <p className="text-sm text-zinc-400 light:text-zinc-600 leading-relaxed">
                Feel free to reach out via the contact form or directly through email and phone.
                I typically respond within 24 hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 glass-card p-4 rounded-2xl">
                  <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Email</p>
                    <a
                      href={`mailto:${profile?.email || "jifanmahmud@gmail.com"}`}
                      className="text-sm font-semibold text-white light:text-zinc-900 hover:text-amber-400 transition-colors"
                    >
                      {profile?.email || "jifanmahmud@gmail.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass-card p-4 rounded-2xl">
                  <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Phone / WhatsApp</p>
                    <p className="text-sm font-semibold text-white light:text-zinc-900">
                      {profile?.phone || "+880 1700-000000"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass-card p-4 rounded-2xl">
                  <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-white light:text-zinc-900">
                      {profile?.location || "Barisal, Bangladesh"}
                    </p>
                  </div>
                </div>

                {/* Social Profiles Row */}
                {profile?.socialLinks && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    {profile.socialLinks.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-amber-400 text-xs font-medium text-zinc-300 light:text-zinc-700 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-amber-400 text-xs font-medium text-zinc-300 light:text-zinc-700 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.socialLinks.facebook && (
                      <a
                        href={profile.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-amber-400 text-xs font-medium text-zinc-300 light:text-zinc-700 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        Facebook
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-amber-400 text-xs font-medium text-zinc-300 light:text-zinc-700 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 light:border-zinc-200">
              <span className="text-xs font-mono text-zinc-500 block mb-2">
                FAST DIRECT INQUIRY
              </span>
              <p className="text-xs text-zinc-400 light:text-zinc-600">
                Messages submitted through this form are securely stored directly in the database and reviewed in the admin panel.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Working Contact Form */}
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.message && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
                      status.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 light:bg-zinc-100 border border-white/10 light:border-zinc-300 text-white light:text-zinc-900 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 light:bg-zinc-100 border border-white/10 light:border-zinc-300 text-white light:text-zinc-900 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 light:bg-zinc-100 border border-white/10 light:border-zinc-300 text-white light:text-zinc-900 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello Jifan, I'd like to discuss a project..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 light:bg-zinc-100 border border-white/10 light:border-zinc-300 text-white light:text-zinc-900 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-amber-400 text-black hover:bg-amber-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-400/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
