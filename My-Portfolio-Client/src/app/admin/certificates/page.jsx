"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { 
  Award, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  AlertCircle, 
  Upload, 
  FileText, 
  Calendar,
  Loader2,
  CheckCircle2,
  FileCheck,
  Eye,
  ExternalLink
} from "lucide-react";
import { renderPdfFirstPageToImage } from "@/lib/pdfPreview";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pdfInputRef = useRef(null);

  const initialForm = {
    title: "",
    issuer: "",
    issueDate: "",
    image: "",
    pdfUrl: "",
    pdfFileName: "",
    pdfFileSize: "",
    skills: "",
    description: "",
    order: 1,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.getCertificates();
      if (res.success) {
        setCertificates(res.data);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || "",
      issuer: cert.issuer || "",
      issueDate: cert.issueDate || "",
      image: cert.image || "",
      pdfUrl: cert.pdfUrl || "",
      pdfFileName: cert.pdfFileName || (cert.pdfUrl ? "certificate.pdf" : ""),
      pdfFileSize: cert.pdfFileSize || "",
      skills: Array.isArray(cert.skills) ? cert.skills.join(", ") : cert.skills || "",
      description: cert.description || "",
      order: cert.order || 1,
    });
    setError("");
    setModalOpen(true);
  };

  // Process uploaded PDF file: read base64 and generate high-res image of page 1
  const handlePdfUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file (.pdf).");
      return;
    }

    const maxSizeBytes = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSizeBytes) {
      setError("PDF file exceeds 25MB limit. Please upload a smaller PDF.");
      return;
    }

    setIsProcessingPdf(true);
    setError("");

    try {
      const formattedSize =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
          : Math.round(file.size / 1024) + " KB";

      // 1. Read PDF file as Data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdfDataUrl = e.target.result;

        // 2. Render Page 1 to high-resolution JPEG image
        let renderedImage = "";
        try {
          renderedImage = await renderPdfFirstPageToImage(pdfDataUrl, 1400);
        } catch (renderErr) {
          console.warn("Could not generate page 1 thumbnail directly:", renderErr);
        }

        setFormData((prev) => ({
          ...prev,
          pdfUrl: pdfDataUrl,
          pdfFileName: file.name,
          pdfFileSize: formattedSize,
          image: renderedImage || prev.image || "",
        }));

        setIsProcessingPdf(false);
      };

      reader.onerror = () => {
        setError("Failed to read the PDF file.");
        setIsProcessingPdf(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("PDF upload error:", err);
      setError("Failed to process the PDF: " + err.message);
      setIsProcessingPdf(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  const removeUploadedPdf = () => {
    setFormData((prev) => ({
      ...prev,
      pdfUrl: "",
      pdfFileName: "",
      pdfFileSize: "",
      image: "",
    }));
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        image: formData.image,
        pdfUrl: formData.pdfUrl,
        pdfFileName: formData.pdfFileName,
        pdfFileSize: formData.pdfFileSize,
        skills: formData.skills,
        description: formData.description,
        order: Number(formData.order) || 0,
      };

      if (editingCert) {
        await api.updateCertificate(editingCert._id, payload);
      } else {
        await api.createCertificate(payload);
      }

      setModalOpen(false);
      fetchCertificates();
    } catch (err) {
      setError(err.message || "Failed to save certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteCertificate(deleteId);
      setDeleteId(null);
      fetchCertificates();
    } catch (err) {
      alert("Failed to delete certificate: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Certificates &amp; Credentials</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Upload certificate PDF documents. Page 1 is automatically rendered as a crystal-clear preview image.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Certificates List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-zinc-400">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white">No certificates found</h3>
          <p className="text-xs text-zinc-500 mt-1">Add your verified credentials to showcase them on your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="glass-card rounded-3xl border border-white/10 p-5 flex flex-col justify-between group hover:border-amber-400/40 transition-all"
            >
              <div>
                {/* Preview Thumbnail (Rendered from PDF) */}
                {cert.image ? (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-zinc-900 border border-white/5">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      unoptimized={Boolean(cert.image.startsWith("data:"))}
                      className="object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-amber-400 backdrop-blur-md border border-amber-400/30">
                      {cert.issuer}
                    </span>

                    {cert.pdfUrl && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/80 text-white backdrop-blur-md flex items-center gap-1">
                        <FileCheck className="w-2.5 h-2.5" />
                        PDF
                      </span>
                    )}
                  </div>
                ) : cert.pdfUrl ? (
                  <div className="aspect-[16/10] rounded-2xl mb-4 flex flex-col items-center justify-center bg-zinc-900 border border-white/10 text-amber-400 p-4 text-center">
                    <FileText className="w-8 h-8 opacity-80 mb-1" />
                    <span className="text-xs font-semibold text-white">PDF Attached</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{cert.issuer}</span>
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-2xl mb-4 flex flex-col items-center justify-center bg-white/5 border border-white/5 text-amber-400">
                    <Award className="w-8 h-8 opacity-70 mb-1" />
                    <span className="text-[11px] font-semibold text-zinc-400">{cert.issuer}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1.5">
                  <span className="text-amber-400 font-semibold">{cert.issuer}</span>
                  {cert.issueDate && <span>{cert.issueDate}</span>}
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">{cert.title}</h3>

                {cert.skills && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(Array.isArray(cert.skills) ? cert.skills : cert.skills.split(","))
                      .slice(0, 3)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-zinc-400"
                        >
                          {typeof skill === "string" ? skill.trim() : skill}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">Order: {cert.order || 0}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit certificate"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(cert._id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e121a] rounded-3xl border border-white/10 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingCert ? "Edit Certificate" : "Add New Certificate"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Complete Web Development"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Programming Hero"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. December 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Dedicated PDF Document Upload Section */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Upload Certificate PDF Document *</span>
                  </label>
                  {formData.pdfUrl && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PDF Attached
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400">
                  Select or drag &amp; drop your certificate PDF. The system will automatically render Page 1 as the certificate image preview.
                </p>

                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePdfUpload(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                {/* Upload Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => pdfInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                      : "border-white/15 hover:border-amber-400/50 bg-white/[0.01]"
                  }`}
                >
                  {isProcessingPdf ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                      <p className="text-xs font-semibold text-white">
                        Rendering PDF Page 1 into Certificate Image...
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Please wait a moment</p>
                    </div>
                  ) : formData.pdfUrl ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white break-all">
                            {formData.pdfFileName || "certificate.pdf"}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            {formData.pdfFileSize ? `${formData.pdfFileSize} • ` : ""}Click or drop to replace PDF
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {formData.image && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Preview Ready
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={removeUploadedPdf}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Remove PDF"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3">
                      <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-medium text-zinc-200">
                        Click or drag &amp; drop to upload Certificate PDF
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Accepts standard .pdf files (up to 25MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Rendered Certificate Image Preview */}
                {formData.image && (
                  <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Certificate Preview (Rendered from PDF):
                      </span>
                      <span className="text-[10px] text-zinc-500">Auto-extracted from Page 1</span>
                    </div>
                    <div className="relative aspect-[16/10] w-full max-h-52 rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
                      <img
                        src={formData.image}
                        alt="PDF Certificate Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Skills Covered (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React.js, Next.js, Node.js, Express.js, MongoDB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description / Curriculum Highlights
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of skills, achievements, or coursework..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isProcessingPdf}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : editingCert ? "Update Certificate" : "Create Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Certificate"
        message="Are you sure you want to permanently delete this certificate? This action cannot be undone."
        confirmText="Delete Certificate"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
