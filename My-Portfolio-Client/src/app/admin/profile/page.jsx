"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  UserCheck,
  Save,
  AlertCircle,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Upload,
  Trash2,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [usePhotoUrlMode, setUsePhotoUrlMode] = useState(false);
  const [isDraggingCv, setIsDraggingCv] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    aboutJourney: "",
    education: "",
    photoUrl: "",
    resumeUrl: "",
    resumeFileName: "",
    resumeFileSize: "",
    resumeFileType: "",
    email: "",
    phone: "",
    location: "",
    availability: "",
    socialLinks: {
      github: "",
      linkedin: "",
      facebook: "",
      twitter: "",
    },
    stats: {
      projectsCompleted: "15+",
      satisfiedClients: "10+",
      yearsExperience: "2+",
      contributions: "400+",
    },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      if (res.success && res.data) {
        setFormData({
          ...res.data,
          socialLinks: {
            ...formData.socialLinks,
            ...(res.data.socialLinks || {}),
          },
          stats: {
            ...formData.stats,
            ...(res.data.stats || {}),
          },
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
    } else if (name.startsWith("stats.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        stats: { ...prev.stats, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle direct file upload for Resume / CV (.pdf, .docx, .doc, .png, .jpg)
  const processResumeFile = (file) => {
    if (!file) return;

    const allowedExtensions = ["pdf", "doc", "docx", "png", "jpg", "jpeg", "webp"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (
      !allowedExtensions.includes(ext) &&
      !file.type.includes("pdf") &&
      !file.type.includes("word") &&
      !file.type.includes("image")
    ) {
      setStatus({
        type: "error",
        message: "Please select a supported file (.pdf, .docx, .doc, .png, .jpg).",
      });
      return;
    }

    const maxSizeBytes = 25 * 1024 * 1024; // 25MB limit
    if (file.size > maxSizeBytes) {
      setStatus({
        type: "error",
        message: "File exceeds 25MB limit. Please upload a smaller document.",
      });
      return;
    }

    setIsUploadingCv(true);
    setStatus({
      type: "info",
      message: `Reading "${file.name}" and uploading directly to database...`,
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      const formattedSize =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
          : Math.round(file.size / 1024) + " KB";

      const updated = {
        ...formData,
        resumeUrl: dataUrl,
        resumeFileName: file.name,
        resumeFileSize: formattedSize,
        resumeFileType: file.type || ext,
      };

      setFormData(updated);

      try {
        const res = await api.updateProfile(updated);
        if (res.success) {
          setStatus({
            type: "success",
            message: `✔ "${file.name}" successfully uploaded and saved to MongoDB database! It will stay permanently.`,
          });
        } else {
          setStatus({
            type: "error",
            message: res.message || "Failed to save to database.",
          });
        }
      } catch (err) {
        console.error("Auto-save CV error:", err);
        setStatus({
          type: "error",
          message: "Failed to save file to database: " + (err.message || "Network error"),
        });
      } finally {
        setIsUploadingCv(false);
      }
    };

    reader.onerror = () => {
      setIsUploadingCv(false);
      setStatus({
        type: "error",
        message: "Failed to read the file from your computer.",
      });
    };

    reader.readAsDataURL(file);
  };

  // Remove Resume / CV and auto-update MongoDB immediately
  const handleRemoveResume = async () => {
    const updated = {
      ...formData,
      resumeUrl: "",
      resumeFileName: "",
      resumeFileSize: "",
      resumeFileType: "",
    };
    setFormData(updated);
    setIsUploadingCv(true);
    try {
      const res = await api.updateProfile(updated);
      if (res.success) {
        setStatus({
          type: "success",
          message: "Resume / CV removed and database updated.",
        });
      }
    } catch (err) {
      console.error("Remove CV error:", err);
      setStatus({
        type: "error",
        message: "Failed to update database: " + err.message,
      });
    } finally {
      setIsUploadingCv(false);
    }
  };

  // Handle direct file upload for profile photo
  const processPhotoFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({
        type: "error",
        message: "Please select an image file (PNG, JPG, JPEG, WebP).",
      });
      return;
    }

    setIsUploadingPhoto(true);
    setStatus({ type: "info", message: "Optimizing and saving photo to database..." });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const optimized = canvas.toDataURL("image/webp", 0.88);
        const updated = { ...formData, photoUrl: optimized };
        setFormData(updated);

        try {
          const res = await api.updateProfile(updated);
          if (res.success) {
            setStatus({
              type: "success",
              message: "✔ Profile photo successfully saved to MongoDB database!",
            });
          }
        } catch (err) {
          setStatus({
            type: "error",
            message: "Failed to save photo: " + err.message,
          });
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        setStatus({ type: "success", message: "Profile & CV details updated successfully!" });
      } else {
        setStatus({ type: "error", message: res.message || "Failed to update profile." });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to update profile." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Identity &amp; Biography
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Profile &amp; CV Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Update your bio, photo, CV download link, and social profiles displayed across the site.
          </p>
        </div>
      </div>

      {status.message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs ${
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

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Core Personal Details */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-3">
            1. Core Information &amp; CV
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Professional Role / Headline *
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume / CV Section (Direct File Upload: .pdf, .docx, .doc, .png, .jpg) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block uppercase font-semibold text-zinc-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Resume / CV Document *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseUrlMode(!useUrlMode)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
                >
                  {useUrlMode ? (
                    <>
                      <Upload className="w-3 h-3" />
                      <span>Switch to Direct Upload</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-3 h-3" />
                      <span>Or paste external link</span>
                    </>
                  )}
                </button>
              </div>

              {useUrlMode ? (
                <div>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/... or https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Direct public link to your CV (Google Drive, Dropbox, etc.)
                  </p>
                </div>
              ) : (
                <div>
                  {formData.resumeUrl ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processResumeFile(file);
                      }}
                      className={`p-4 rounded-2xl bg-white/[0.03] border transition-all ${
                        isDraggingCv
                          ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                          : "border-white/10"
                      } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${
                            formData.resumeFileName?.toLowerCase().endsWith(".pdf") ||
                            formData.resumeFileType?.includes("pdf") ||
                            formData.resumeUrl?.includes("pdf")
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              : formData.resumeFileName?.toLowerCase().includes(".doc") ||
                                formData.resumeFileType?.includes("word")
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : formData.resumeFileType?.includes("image") ||
                                formData.resumeUrl?.startsWith("data:image")
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {formData.resumeFileName?.split(".").pop()?.toUpperCase() ||
                            (formData.resumeUrl.startsWith("http") ? "URL" : "CV")}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[220px]">
                            {formData.resumeFileName ||
                              (formData.resumeUrl.startsWith("http")
                                ? "External CV Link"
                                : "Uploaded Resume Document")}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            {isUploadingCv ? (
                              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving to MongoDB...
                              </span>
                            ) : (
                              <>
                                {formData.resumeFileSize && <span>{formData.resumeFileSize}</span>}
                                {formData.resumeFileSize && <span>•</span>}
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Saved in Database
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <a
                          href={formData.resumeUrl}
                          download={formData.resumeFileName || "B.M.Jifan_Mahmud_Resume.pdf"}
                          target={formData.resumeUrl.startsWith("data:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                          title="Download or preview file"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download</span>
                        </a>

                        <label
                          className={`cursor-pointer px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                            isUploadingCv ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {isUploadingCv ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Change</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) processResumeFile(f);
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleRemoveResume}
                          disabled={isUploadingCv}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-colors disabled:opacity-50"
                          title="Remove File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingCv(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processResumeFile(file);
                      }}
                      className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDraggingCv
                          ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                          : "border-white/15 hover:border-amber-400/50 bg-white/[0.02] hover:bg-white/[0.05]"
                      } group`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        {isUploadingCv ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-white mb-0.5 text-center">
                        {isUploadingCv
                          ? "Saving to database..."
                          : isDraggingCv
                          ? "Drop Resume / CV file here"
                          : "Click to select or drag & drop Resume / CV from PC"}
                      </span>
                      <span className="text-[11px] text-zinc-400 text-center">
                        Supports PDF, Word (.docx, .doc), and Images (.png, .jpg)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processResumeFile(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Profile Photo Section (Direct Upload & Preview) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block uppercase font-semibold text-zinc-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Profile Photo (Avatar)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUsePhotoUrlMode(!usePhotoUrlMode)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
                >
                  {usePhotoUrlMode ? "Upload from Device" : "Or paste Photo URL"}
                </button>
              </div>

              {usePhotoUrlMode ? (
                <div>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    placeholder="/assets/jifan1.png or https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Path in public folder (e.g. /assets/jifan1.png) or web URL
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.photoUrl || "/assets/jifan1.png"}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]">
                        {formData.photoUrl?.startsWith("data:")
                          ? "Custom Uploaded Photo"
                          : formData.photoUrl || "/assets/jifan1.png"}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Displayed on hero, about &amp; profile
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) processPhotoFile(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block uppercase font-semibold text-zinc-400 mb-2">
              Short Bio (shown on hero &amp; about overview)
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block uppercase font-semibold text-zinc-400 mb-2">
              Detailed Journey / Background (shown in About section)
            </label>
            <textarea
              name="aboutJourney"
              rows={4}
              value={formData.aboutJourney}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Availability Badge Text
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-3">
            2. Social Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                name="social.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="social.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="social.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Twitter / X URL
              </label>
              <input
                type="url"
                name="social.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Stats Numbers */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-3">
            3. Highlight Metrics (Stats)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Projects Completed
              </label>
              <input
                type="text"
                name="stats.projectsCompleted"
                value={formData.stats.projectsCompleted}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Satisfied Clients
              </label>
              <input
                type="text"
                name="stats.satisfiedClients"
                value={formData.stats.satisfiedClients}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Years Experience
              </label>
              <input
                type="text"
                name="stats.yearsExperience"
                value={formData.stats.yearsExperience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-zinc-400 mb-2">
                Contributions
              </label>
              <input
                type="text"
                name="stats.contributions"
                value={formData.stats.contributions}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          {status.message ? (
            <div
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                status.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : status.type === "info"
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
              }`}
            >
              {status.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              {status.type === "info" && <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />}
              {status.type === "error" && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{status.message}</span>
            </div>
          ) : (
            <div className="text-zinc-500 text-[11px]">
              All changes are synced with your live MongoDB database.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || isUploadingCv || isUploadingPhoto}
            className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile &amp; CV Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
