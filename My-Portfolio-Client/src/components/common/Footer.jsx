"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowChevronUp } from "@gravity-ui/icons";

export default function Footer({ profile }) {
  const [liveProfile, setLiveProfile] = useState(profile);

  useEffect(() => {
    // Only fetch if profile was not provided by server
    if (profile) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/profile`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setLiveProfile(res.data);
        }
      })
      .catch(() => {});
  }, [profile]);

  const activeProfile = liveProfile || profile;
  const social = activeProfile?.socialLinks || {};

  const githubUrl = social.github || "https://github.com/Jifan-Mahmud";
  const linkedinUrl = social.linkedin || "https://www.linkedin.com/in/b-m-jifan-mahmud-37b376326/";
  const facebookUrl = social.facebook || "https://www.facebook.com/jifan.mahmud";
  const twitterUrl = social.twitter || "";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 light:border-zinc-200 bg-[#0a0c10] light:bg-zinc-100 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5 light:border-zinc-200">
          <div>
            <h3 className="text-2xl font-serif font-bold text-white light:text-zinc-900 tracking-tight">
              {activeProfile?.name || "B.M. Jifan Mahmud"}<span className="text-amber-500">.</span>
            </h3>
            <p className="text-sm text-zinc-400 light:text-zinc-600 mt-1">
              {activeProfile?.role || "Full-Stack Web Developer"} &bull; {activeProfile?.location || "Barisal, Bangladesh"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 light:text-zinc-600">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 light:hover:text-amber-600 transition-colors font-medium cursor-pointer"
                title="GitHub Profile"
              >
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 light:hover:text-amber-600 transition-colors font-medium cursor-pointer"
                title="LinkedIn Profile"
              >
                LinkedIn
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 light:hover:text-amber-600 transition-colors font-medium cursor-pointer"
                title="Facebook Profile"
              >
                Facebook
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 light:hover:text-amber-600 transition-colors font-medium cursor-pointer"
                title="Twitter Profile"
              >
                Twitter
              </a>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full border border-white/10 hover:border-amber-400 text-zinc-400 hover:text-amber-400 transition-colors ml-2 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 light:text-zinc-600 gap-4">
          <p>&copy; {new Date().getFullYear()} {activeProfile?.name || "B.M. Jifan Mahmud"}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, Tailwind CSS &amp; MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
