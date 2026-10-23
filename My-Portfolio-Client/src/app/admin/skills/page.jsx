"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialForm = {
    name: "",
    category: "Frontend",
    level: 85,
    order: 1,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.getSkills();
      if (res.success) {
        setSkills(res.data);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Frontend",
      level: skill.level || 85,
      order: skill.order || 1,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill._id, formData);
      } else {
        await api.createSkill(formData);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      setError(err.message || "Failed to save skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteSkill(deleteId);
      setDeleteId(null);
      fetchSkills();
    } catch (err) {
      alert("Failed to delete skill: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Technical Stack
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Skills Inventory
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your frontend, backend, database, and tooling proficiencies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Frontend", "Backend", "Database", "Tools"].map((category) => {
            const catSkills = skills.filter(
              (s) => s.category?.toLowerCase() === category.toLowerCase()
            );

            return (
              <div key={category} className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    {category}
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">{catSkills.length} items</span>
                </div>

                <div className="space-y-3">
                  {catSkills.length > 0 ? (
                    catSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{skill.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            Proficiency: {skill.level}%
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(skill._id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 py-4 text-center">No skills in this category.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Next.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12161f] border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Proficiency Level ({formData.level}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full accent-amber-400"
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
                  {submitting ? "Saving..." : editingSkill ? "Update Skill" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Skill"
        message="Are you sure you want to delete this skill from your catalog?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
