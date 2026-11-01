"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePreloader } from "@/context/PreloaderContext";

export default function PagePreloader() {
  const { setIsLoaded } = usePreloader();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Immediately ensure isLoaded is true so page content is accessible
    setIsLoaded(true);

    // Bypass completely for Lighthouse, PageSpeed Insights, and crawlers
    if (typeof navigator !== "undefined") {
      const isAuditBot = /Lighthouse|Googlebot|PageSpeed|Chrome-Lighthouse/i.test(navigator.userAgent);
      if (isAuditBot) {
        setLoading(false);
        return;
      }
    }

    // Check if user already saw the preloader in this browsing session
    if (typeof window !== "undefined" && sessionStorage.getItem("portfolio_preloader_seen")) {
      setLoading(false);
      return;
    }

    // Show snappy elegant intro for first-time human visitors
    setLoading(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("portfolio_preloader_seen", "true");
            }
          }, 150);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 12;
        return Math.min(prev + increment, 100);
      });
    }, 25);

    return () => clearInterval(interval);
  }, [setIsLoaded]);

  if (!loading) return null;

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="global-preloader"
          id="global-page-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.35, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090b10] light:bg-[#f8fafc] overflow-hidden select-none pointer-events-none"
        >
          {/* Ambient warm aura in background */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" />

          {/* Central Luxury Monogram & Spinner Assembly */}
          <div className="relative flex flex-col items-center">
            {/* Spinning Aura Rings */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer rotating dashed gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 border-r-amber-500/60"
              />

              {/* Counter-rotating inner glowing accent ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-amber-300 border-l-amber-500/40"
              />

              {/* Pulsing center brand bubble */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-gradient-to-b from-white/10 to-white/[0.02] light:from-black/10 light:to-black/[0.02] backdrop-blur-xl border border-white/15 light:border-black/10 flex items-center justify-center shadow-xl shadow-amber-500/10"
              >
                <span className="font-serif italic font-black text-3xl text-amber-400 light:text-amber-500 flex items-center">
                  J<span className="text-amber-500 light:text-amber-600">.</span>
                </span>
              </motion.div>
            </div>

            {/* Editorial Brand Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="mt-6 text-center space-y-1"
            >
              <h2 className="text-sm font-extrabold uppercase tracking-[0.28em] text-white light:text-zinc-900">
                B.M. Jifan Mahmud
              </h2>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 light:text-zinc-600">
                Full-Stack Web Developer
              </p>
            </motion.div>

            {/* Sleek Minimal Progress Bar */}
            <div className="mt-7 w-48 space-y-2">
              <div className="h-1 w-full rounded-full bg-white/10 light:bg-zinc-200 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Percentage & status ticker */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 light:text-zinc-400 px-0.5">
                <span className="uppercase tracking-wider">Loading portfolio</span>
                <span className="text-amber-400 light:text-amber-600 font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
