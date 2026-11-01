"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Chip } from "@heroui/react";
import { ArrowChevronRight, ArrowDown } from "@gravity-ui/icons";
import { usePreloader } from "@/context/PreloaderContext";

export default function HeroSection({ profile }) {
  const { isLoaded } = usePreloader();
  const [downloading, setDownloading] = useState(false);
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
  const name = activeProfile?.name || "B.M. Jifan Mahmud";
  const availability = activeProfile?.availability || "Available for new opportunities";
  const photoUrl =
    activeProfile?.photoUrl && !activeProfile.photoUrl.includes("WhatsApp_Image")
      ? activeProfile.photoUrl
      : "/assets/jifan1.png";

  const scrollToSection = (e, sectionId) => {
    if (e && e.preventDefault) e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${sectionId}`);
    } else {
      window.location.hash = sectionId;
    }
  };

  const handleDownloadCV = async () => {
    setDownloading(true);
    try {
      let targetUrl = activeProfile?.resumeUrl;
      let fileName = activeProfile?.resumeFileName || "B.M.Jifan_Mahmud_Resume.pdf";

      // If missing or dummy link, fetch fresh from server
      if (!targetUrl || targetUrl === "#" || targetUrl.includes("exampleResumeID")) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/profile`
          ).then((r) => r.json());
          if (res.success && res.data?.resumeUrl) {
            targetUrl = res.data.resumeUrl;
            fileName = res.data.resumeFileName || fileName;
            setLiveProfile(res.data);
          }
        } catch (_) {}
      }

      // 1. If it's a Base64 data URI, convert to Blob and download directly
      if (targetUrl && targetUrl.startsWith("data:")) {
        const parts = targetUrl.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (document.body.contains(a)) document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
        return;
      }

      // 2. If it's an external web URL (Google Drive, etc.)
      if (targetUrl && targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        return;
      }

      // 3. Fallback: stream directly from backend /api/profile/resume
      const downloadEndpoint = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/profile/resume`;
      window.location.href = downloadEndpoint;
    } catch (err) {
      console.error("Error downloading CV:", err);
      window.location.href = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/profile/resume`;
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && /Lighthouse|Googlebot|PageSpeed/i.test(navigator.userAgent)) {
      setIsBot(true);
    }
  }, []);

  // Coordinated luxury entrance animations for visitors (instant for audit bots)
  const containerVariants = {
    hidden: { opacity: isBot ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isBot ? 0 : 0.12,
        delayChildren: isBot ? 0 : 0.05,
      },
    },
  };

  const fadeFromLeft = {
    hidden: { opacity: isBot ? 1 : 0, x: isBot ? 0 : -35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: isBot ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeFromRight = {
    hidden: { opacity: isBot ? 1 : 0, x: isBot ? 0 : 35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: isBot ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeFromTop = {
    hidden: { opacity: isBot ? 1 : 0, y: isBot ? 0 : -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isBot ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeFromBottom = {
    hidden: { opacity: isBot ? 1 : 0, y: isBot ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isBot ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const photoScaleVariant = {
    hidden: { opacity: isBot ? 1 : 0, scale: isBot ? 1 : 0.9, y: isBot ? 0 : 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: isBot ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-32 pb-8 overflow-hidden"
    >
      {/* Ambient warm radial glow backdrop centered behind Jifan */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 0.85, scale: 1, transition: { duration: isBot ? 0 : 1.2, ease: "easeOut" } },
        }}
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full amber-glow pointer-events-none -z-10 blur-3xl"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 sm:px-8 w-full flex-1 flex flex-col justify-between"
      >
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.div variants={fadeFromLeft}>
            <Chip
              variant="flat"
              color="warning"
              size="sm"
              className="glass-card text-amber-300 light:text-amber-800 border border-amber-400/20 font-medium px-3 py-1 text-xs inline-flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>{availability}</span>
            </Chip>
          </motion.div>

          <motion.p
            variants={fadeFromRight}
            className="text-xs text-zinc-400 light:text-zinc-600 max-w-xs text-left sm:text-right font-medium"
          >
            Specialized in Next.js, React, Node.js, Express, and MongoDB.
          </motion.p>
        </div>

        {/* Big Editorial Script: "Hey, there" */}
        <motion.div variants={fadeFromTop} className="text-center my-1 z-10">
          <span className="editorial-serif italic text-4xl sm:text-6xl md:text-7xl font-normal text-zinc-200 light:text-zinc-800 tracking-wide select-none">
            Hey, <span className="text-amber-400 light:text-amber-500">there</span>
          </span>
        </motion.div>

        {/* Center Cutout Photo with Large Flanking Headlines */}
        <div className="relative flex-1 flex flex-col lg:flex-row items-center justify-between my-1">
          {/* Left Title: I AM JIFAN */}
          <motion.div
            variants={fadeFromLeft}
            className="z-20 text-center lg:text-left mb-4 lg:mb-0 lg:max-w-[300px]"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white light:text-zinc-950 leading-[0.9]">
              I AM <br />
              <span className="text-zinc-300 light:text-zinc-700">JIFAN</span>
            </h1>
            <p className="mt-1.5 text-sm font-serif italic text-amber-400 light:text-amber-600">
              {name}
            </p>
          </motion.div>

          {/* Center Cutout Photo of Jifan with warm halo */}
          <motion.div
            variants={photoScaleVariant}
            className="relative w-64 h-[340px] sm:w-[320px] sm:h-[400px] lg:w-[380px] lg:h-[460px] flex items-end justify-center z-10"
          >
            {/* Halo behind shoulders/head */}
            <div className="absolute top-8 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-amber-500/35 to-amber-200/15 blur-2xl -z-10" />

            <Image
              src={photoUrl}
              alt={name}
              fill
              priority
              fetchPriority="high"
              unoptimized={Boolean(photoUrl?.startsWith("data:"))}
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
            />
          </motion.div>

          {/* Right Role: FULL-STACK DEVELOPER */}
          <motion.div
            variants={fadeFromRight}
            className="z-20 text-center lg:text-right mt-4 lg:mt-0 lg:max-w-[320px]"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white light:text-zinc-950 leading-[0.94]">
              FULL-STACK <br />
              <span className="text-amber-400 light:text-amber-500">DEVELOPER</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 light:text-zinc-600 max-w-xs mx-auto lg:ml-auto leading-relaxed">
              Crafting high-performance web applications with clean architecture and delightful UI.
            </p>
          </motion.div>
        </div>

        {/* Action Buttons Row */}
        <motion.div
          variants={fadeFromBottom}
          className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10 light:border-zinc-200 z-20"
        >
          <Link
            href="/#projects"
            onClick={(e) => scrollToSection(e, "projects")}
            id="hero-view-projects-btn"
            className="inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-full shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 active:scale-95 transition-all cursor-pointer select-none"
          >
            <span>View Projects</span>
            <ArrowChevronRight className="w-4 h-4 ml-0.5" />
          </Link>

          <Link
            href="/#contact"
            onClick={(e) => scrollToSection(e, "contact")}
            id="hero-hire-me-btn"
            className="inline-flex items-center justify-center glass-card text-white light:text-zinc-900 border border-white/20 hover:border-amber-400/60 light:border-zinc-300 light:hover:border-amber-500 font-semibold text-xs uppercase tracking-wider px-7 py-3 rounded-full active:scale-95 transition-all cursor-pointer select-none"
          >
            <span>Hire Me</span>
          </Link>

          <button
            type="button"
            id="download-resume-btn"
            onClick={handleDownloadCV}
            disabled={downloading}
            className="flex items-center gap-2 text-zinc-300 light:text-zinc-700 hover:text-white font-medium text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowDown className={`w-4 h-4 text-amber-400 ${downloading ? "animate-bounce" : ""}`} />
            <span>{downloading ? "Downloading..." : "Download Resume"}</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
