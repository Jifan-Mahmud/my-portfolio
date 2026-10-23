"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">{title || "Confirm Action"}</h3>
        </div>

        <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
          {message || "Are you sure you want to proceed? This action cannot be undone."}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white glass-card transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
