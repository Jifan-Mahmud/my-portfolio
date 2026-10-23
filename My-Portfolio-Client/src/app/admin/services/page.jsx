"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialForm = {
    number: "01",
    title: "",
    description: "",
    order: 1,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.getServices();
      if (res.success) {
        setServices(res.data);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData(initialForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      number: service.number || "01",
      title: service.title || "",
      description: service.description || "",
      order: service.order || 1,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingService) {
        await api.updateService(editingService._id, formData);
      } else {
        await api.createService(formData);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      setError(err.message || "Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteService(deleteId);
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      alert("Failed to delete service: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Services &amp; Offerings
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Core Services
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure the offerings shown in the &quot;I Can Help You With&quot; section.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="p-6 rounded-3xl glass-card flex flex-col justify-between hover:border-amber-400/30 transition-all"
            >
              <div>
                <span className="font-serif italic text-3xl text-amber-400 block mb-4">
                  {service.number || "01"}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{service.description}</p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-2 rounded-xl glass-card text-zinc-400 hover:text-amber-400 transition-colors"
                  title="Edit service"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(service._id)}
                  className="p-2 rounded-xl glass-card text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl text-zinc-500 text-xs">
          No services defined. Click &quot;Add Service&quot; above to create one.
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingService ? "Edit Service" : "Add New Service"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Number Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="01"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm font-serif"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of what you deliver..."
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
                  {submitting ? "Saving..." : editingService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
