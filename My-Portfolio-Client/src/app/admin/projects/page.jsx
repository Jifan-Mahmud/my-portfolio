"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  X,
  Layers,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { LogoGithub } from "@gravity-ui/icons";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const initialForm = {
    title: "",
    description: "",
    details: "",
    image: "",
    liveLink: "",
    githubLink: "",
    githubServerLink: "",
    techStack: "",
    category: "Full-Stack",
    featured: false,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(initialForm);
    setUseUrlMode(false);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      details: project.details || project.description || "",
      image: project.image || "",
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || "",
      githubServerLink: project.githubServerLink || "",
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      category: project.category || "Full-Stack",
      featured: Boolean(project.featured),
    });
    // If image exists and starts with http/https, allow URL mode toggle
    setUseUrlMode(Boolean(project.image && project.image.startsWith("http")));
    setError("");
    setModalOpen(true);
  };

  // Process and optimize image file from device (direct upload / drag-and-drop)
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Optimize and resize image using canvas to avoid heavy DB payload
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
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

        // Convert to lightweight WebP data URL
        const optimizedDataUrl = canvas.toDataURL("image/webp", 0.85);
        setFormData((prev) => ({ ...prev, image: optimizedDataUrl }));
        setError("");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingProject) {
        await api.updateProject(editingProject._id, formData);
      } else {
        await api.createProject(formData);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteProject(deleteId);
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Portfolio Management
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Projects Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add, update, and manage showcased works with direct image upload, GitHub and live links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/30 transition-all"
            >
              <div className="relative aspect-[16/10] bg-zinc-900">
                <Image
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={project.title}
                  fill
                  unoptimized={Boolean(project.image?.startsWith("data:"))}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                {project.featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-black" />
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400">
                    {project.category || "Full-Stack"}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {(project.techStack || []).slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                        title="Live link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                        title="GitHub link"
                      >
                        <LogoGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                      title="Edit project"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(project._id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl text-zinc-500 text-xs">
          No projects found. Click &quot;New Project&quot; above to create one.
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. SkillBridge - E-Learning Platform"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12161f] border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="MERN">MERN</option>
                    <option value="API / Backend">API / Backend</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload from Computer Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block uppercase font-semibold text-zinc-400">
                    Project Image *
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUrlMode(!useUrlMode)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1"
                  >
                    {useUrlMode ? (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Switch to Upload from Device</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-3 h-3" />
                        <span>Or paste Image URL</span>
                      </>
                    )}
                  </button>
                </div>

                {useUrlMode ? (
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                  />
                ) : (
                  <div>
                    {formData.image ? (
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 group bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.image}
                          alt="Project Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="cursor-pointer px-4 py-2 rounded-full bg-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Change Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) processImageFile(file);
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                            : "border-white/15 hover:border-amber-400/50 bg-white/[0.02] hover:bg-white/[0.05]"
                        } group`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-white mb-0.5">
                          {isDragging ? "Drop image here" : "Click to select or drag & drop image from device"}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Supports PNG, JPG, JPEG, WebP (automatically optimized)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary shown on project cards..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Detailed Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="In-depth explanation shown on the project details page..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="Next.js, Express.js, MongoDB, Tailwind CSS, Better Auth"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    placeholder="https://my-app.vercel.app"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    GitHub Client Repo
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    GitHub Server Repo
                  </label>
                  <input
                    type="url"
                    value={formData.githubServerLink}
                    onChange={(e) =>
                      setFormData({ ...formData, githubServerLink: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400 accent-amber-400 bg-zinc-800"
                />
                <label htmlFor="featured" className="text-zinc-300 font-medium cursor-pointer">
                  Featured Project (highlighted with badge)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white glass-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? It will be removed from your public portfolio."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
