"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialForm = {
    title: "",
    organization: "",
    type: "Education",
    period: "2020 - 2024",
    description: "",
    order: 1,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.getExperiences();
      if (res.success) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error("Failed to load experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      organization: item.organization || "",
      type: item.type || "Education",
      period: item.period || "",
      description: item.description || "",
      order: item.order || 1,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingItem) {
        await api.updateExperience(editingItem._id, formData);
      } else {
        await api.createExperience(formData);
      }
      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      setError(err.message || "Failed to save milestone.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteExperience(deleteId);
      setDeleteId(null);
      fetchExperiences();
    } catch (err) {
      alert("Failed to delete milestone: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Timeline Records
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Education &amp; Experience
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your degrees, professional diplomas, training certificates, and work milestones.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-400/30 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400">{item.period}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {item.type || "Milestone"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs font-medium text-zinc-300">{item.organization}</p>
                <p className="text-xs text-zinc-400 max-w-2xl mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl glass-card text-zinc-400 hover:text-amber-400 transition-colors"
                  title="Edit milestone"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="p-2 rounded-xl glass-card text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Delete milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl text-zinc-500 text-xs">
          No milestones found. Click &quot;Add Milestone&quot; above to create one.
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Milestone" : "Add New Milestone"}
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
              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Title / Degree *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diploma in Engineering (CST)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Institution / Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Barisal Polytechnic Institute"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12161f] border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                  >
                    <option value="Education">Education</option>
                    <option value="Training">Training</option>
                    <option value="Work">Work / Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2020 - 2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key accomplishments and skills learned..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm resize-none"
                />
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
                  {submitting ? "Saving..." : editingItem ? "Update Milestone" : "Add Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Milestone"
        message="Are you sure you want to delete this timeline entry?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
