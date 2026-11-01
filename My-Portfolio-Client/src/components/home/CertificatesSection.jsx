"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { fadeIn } from "@/lib/motion";
import { 
  Award, 
  Eye, 
  ExternalLink, 
  FileText, 
  X, 
  Calendar, 
  Download,
  BookOpen,
  Sparkles
} from "lucide-react";
import { renderPdfFirstPageToImage } from "@/lib/pdfPreview";

export default function CertificatesSection({ certificates }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("image"); // 'image' | 'interactive'
  const [dynamicThumbnails, setDynamicThumbnails] = useState({});
  const closeButtonRef = useRef(null);

  const defaultCertificates = [
    {
      _id: "default-cert-1",
      title: "Complete Web Development Course with Jhankar Mahbub",
      issuer: "Programming Hero",
      issueDate: "December 2024",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
      pdfUrl: "https://web.programming-hero.com/certificate/PH-WD-2024-8841.pdf",
      skills: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
      description: "6-month intensive full-stack program mastering modern JavaScript, React 19, Next.js App Router, Express REST APIs, MongoDB, JWT authentication, and production deployments.",
    },
    {
      _id: "default-cert-2",
      title: "Diploma in Engineering (Computer Science & Technology)",
      issuer: "Barisal Polytechnic Institute",
      issueDate: "2024",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      pdfUrl: "",
      skills: ["Data Structures", "Algorithms", "Database Systems", "Software Engineering"],
      description: "4-year engineering curriculum establishing strong foundations in software design, object-oriented programming, data structures, database architecture, and computer networking.",
    },
    {
      _id: "default-cert-3",
      title: "JavaScript Algorithms & Data Structures Specialization",
      issuer: "freeCodeCamp",
      issueDate: "October 2024",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      pdfUrl: "https://www.freecodecamp.org/certification/jifanmahmud/javascript-algorithms-and-data-structures.pdf",
      skills: ["JavaScript (ES6+)", "OOP", "Functional Programming", "Algorithm Scripting"],
      description: "In-depth validation of algorithmic thinking, data structures, recursion, higher-order functions, and ES6+ modern JavaScript standards.",
    },
  ];

  const items = certificates && certificates.length > 0 ? certificates : defaultCertificates;

  // Defer heavy PDF rendering until browser has finished critical initial rendering
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idleFn = window.requestIdleCallback || ((cb) => setTimeout(cb, 3000));
    const handle = idleFn(() => {
      items.forEach(async (item) => {
        if (!item.image && item.pdfUrl && !dynamicThumbnails[item._id]) {
          try {
            const generatedImg = await renderPdfFirstPageToImage(item.pdfUrl, 800);
            if (generatedImg) {
              setDynamicThumbnails((prev) => ({ ...prev, [item._id]: generatedImg }));
            }
          } catch (e) {
            console.debug("Could not render client-side PDF thumbnail:", e);
          }
        }
      });
    });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
    };
  }, [items, dynamicThumbnails]);

  // Keyboard accessibility: Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };

    if (selectedCert) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
      setActiveModalTab("image");
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCert]);

  const handleOpenCertificate = (item) => {
    setSelectedCert(item);
    setActiveModalTab("image");
  };

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full amber-glow pointer-events-none -z-10 blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 light:border-zinc-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              06 // Credentials &amp; Certifications
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white light:text-zinc-950 mt-2">
              Verified Excellence <br />
              <span className="text-zinc-400 light:text-zinc-600 font-serif italic lowercase">
                and credentials.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 light:text-zinc-600 max-w-sm mt-4 md:mt-0 font-medium">
            Recognized academic diplomas and verified professional certifications showcasing proven mastery.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const displayImage = item.image || dynamicThumbnails[item._id] || null;
            const hasPdf = Boolean(item.pdfUrl);
            const canView = Boolean(displayImage || hasPdf);

            return (
              <motion.div
                key={item._id || idx}
                variants={fadeIn("up", idx * 0.12)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="glass-card rounded-3xl border border-white/10 light:border-zinc-200/80 p-6 flex flex-col justify-between group hover:border-amber-400/40 light:hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 relative"
              >
                <div>
                  {/* Certificate Image Preview (Generated from PDF) */}
                  {displayImage ? (
                    <div 
                      onClick={() => handleOpenCertificate(item)}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 cursor-pointer bg-zinc-900 border border-white/5 shadow-md group/img"
                    >
                      <Image
                        src={displayImage}
                        alt={`Certificate for ${item.title}`}
                        fill
                        unoptimized={Boolean(displayImage.startsWith("data:"))}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />

                      {/* Hover Overlay with Eye */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/45 backdrop-blur-[2px]">
                        <span className="px-4 py-2 rounded-full bg-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                          <Eye className="w-3.5 h-3.5" />
                          View Certificate
                        </span>
                      </div>

                      {/* Top Badges */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-400 border border-amber-400/30 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {item.issuer}
                      </span>

                      {hasPdf && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/80 text-white backdrop-blur-md flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5" />
                          PDF
                        </span>
                      )}
                    </div>
                  ) : hasPdf ? (
                    <div 
                      onClick={() => handleOpenCertificate(item)}
                      className="aspect-[16/10] rounded-2xl mb-5 flex flex-col items-center justify-center bg-zinc-900/80 border border-white/10 text-amber-400 cursor-pointer group/pdf hover:border-amber-400/40 transition-all p-6 text-center"
                    >
                      <FileText className="w-12 h-12 mb-2 text-amber-400 group-hover/pdf:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        PDF Certificate Document
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-1">
                        Click to view document
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[16/10] rounded-2xl mb-5 flex flex-col items-center justify-center bg-white/5 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-amber-400">
                      <Award className="w-10 h-10 mb-2 opacity-80" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 light:text-zinc-600">
                        {item.issuer}
                      </span>
                    </div>
                  )}

                  {/* Issuer & Date Row */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 light:text-zinc-500 mb-2 font-mono">
                    <span className="font-semibold text-amber-400 light:text-amber-600 uppercase tracking-wider">
                      {item.issuer}
                    </span>
                    {item.issueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.issueDate}
                      </span>
                    )}
                  </div>

                  {/* Certificate Title */}
                  <h3 className="text-lg font-bold text-white light:text-zinc-900 group-hover:text-amber-400 light:group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="mt-3 text-xs text-zinc-300 light:text-zinc-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Skills Pills */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-white/5 light:bg-zinc-200 text-[10px] font-mono text-zinc-300 light:text-zinc-700 border border-white/5 light:border-zinc-300/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Button (Active ONLY if certificate file or preview is available) */}
                <div className="mt-6 pt-4 border-t border-white/5 light:border-zinc-200/80">
                  {canView && (
                    <button
                      type="button"
                      onClick={() => handleOpenCertificate(item)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-400/10 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Accessible Certificate Modal / Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCert(null);
            }}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            aria-describedby="certificate-modal-desc"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl bg-[#0e121a] light:bg-white rounded-3xl border border-white/10 light:border-zinc-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 light:border-zinc-200 bg-white/[0.02] light:bg-zinc-50 flex-shrink-0">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black">
                      {selectedCert.issuer}
                    </span>
                    {selectedCert.issueDate && (
                      <span className="text-xs text-zinc-400 light:text-zinc-500 font-mono">
                        {selectedCert.issueDate}
                      </span>
                    )}
                  </div>
                  <h3 
                    id="certificate-modal-title" 
                    className="text-lg sm:text-xl font-bold text-white light:text-zinc-950 leading-tight"
                  >
                    {selectedCert.title}
                  </h3>
                </div>

                {/* Accessible Close Button with Keyboard Focus */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  aria-label="Close certificate modal"
                  className="p-2.5 rounded-full bg-white/5 light:bg-zinc-200 text-zinc-400 hover:text-white light:hover:text-black hover:bg-white/10 light:hover:bg-zinc-300 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Switcher Tabs (if both image preview and PDF document exist) */}
              {selectedCert.pdfUrl && (selectedCert.image || dynamicThumbnails[selectedCert._id]) && (
                <div className="px-6 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-400 font-medium hidden sm:inline">Preview Mode:</span>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("image")}
                      className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        activeModalTab === "image"
                          ? "bg-amber-400 text-black shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Certificate View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("interactive")}
                      className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        activeModalTab === "interactive"
                          ? "bg-amber-400 text-black shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Interactive PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Body / Viewer */}
              <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-black/40 light:bg-zinc-100/50 flex-1 overflow-y-auto">
                {activeModalTab === "interactive" && selectedCert.pdfUrl ? (
                  <div className="w-full h-[62vh] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner">
                    <iframe
                      src={`${selectedCert.pdfUrl}#toolbar=1&navpanes=0`}
                      title={`Interactive PDF viewer for ${selectedCert.title}`}
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (selectedCert.image || dynamicThumbnails[selectedCert._id]) ? (
                  <div className="relative w-full max-h-[62vh] h-[58vh] rounded-2xl overflow-hidden border border-white/10 light:border-zinc-200 shadow-inner bg-zinc-950">
                    <Image
                      src={selectedCert.image || dynamicThumbnails[selectedCert._id]}
                      alt={`Full certificate preview for ${selectedCert.title} issued by ${selectedCert.issuer}`}
                      fill
                      unoptimized={Boolean(
                        (selectedCert.image || dynamicThumbnails[selectedCert._id])?.startsWith("data:")
                      )}
                      sizes="(max-width: 1200px) 100vw, 1000px"
                      className="object-contain"
                    />
                  </div>
                ) : selectedCert.pdfUrl ? (
                  <div className="w-full h-[60vh] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-inner">
                    <iframe
                      src={`${selectedCert.pdfUrl}#toolbar=1`}
                      title={`Certificate PDF for ${selectedCert.title}`}
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-zinc-400">
                    <Award className="w-16 h-16 text-amber-400 mb-3" />
                    <p className="text-sm">No preview document available for this certificate.</p>
                  </div>
                )}

                {/* Description */}
                {selectedCert.description && (
                  <div 
                    id="certificate-modal-desc" 
                    className="w-full mt-4 text-xs text-zinc-400 light:text-zinc-600 px-1 leading-relaxed"
                  >
                    {selectedCert.description}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 light:border-zinc-200 bg-white/[0.02] light:bg-zinc-50 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCert.pdfUrl && (
                    <a
                      href={selectedCert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all flex items-center gap-2 shadow-md shadow-amber-400/20 active:scale-95"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Open PDF in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  )}

                  {selectedCert.pdfUrl && selectedCert.pdfUrl.startsWith("data:") && (
                    <a
                      href={selectedCert.pdfUrl}
                      download={`${selectedCert.title.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate.pdf`}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 light:bg-zinc-200 hover:bg-white/15 text-white light:text-zinc-900 transition-all flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white light:text-zinc-600 light:hover:text-black transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
