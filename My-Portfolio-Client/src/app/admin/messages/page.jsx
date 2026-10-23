"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  Mail,
  CheckCircle,
  Trash2,
  Reply,
  RefreshCw,
  Clock,
  User,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      await api.markMessageRead(id);
      fetchMessages();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteMessage(deleteId);
      if (activeMessage?._id === deleteId) {
        setActiveMessage(null);
      }
      setDeleteId(null);
      fetchMessages();
    } catch (err) {
      alert("Error deleting message: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Communications
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Client Inquiries
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review and respond to messages submitted through your public contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2.5 rounded-full glass-card text-zinc-400 hover:text-white transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Message List */}
          <div className="lg:col-span-5 space-y-3">
            {messages.map((msg) => {
              const isSelected = activeMessage?._id === msg._id;

              return (
                <div
                  key={msg._id}
                  onClick={() => setActiveMessage(msg)}
                  className={`p-5 rounded-2xl glass-card cursor-pointer transition-all border ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/5 shadow-lg shadow-amber-400/10"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-zinc-200 line-clamp-1">{msg.subject}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{msg.message}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        msg.read
                          ? "bg-white/5 text-zinc-400"
                          : "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                      }`}
                    >
                      {msg.read ? "Read" : "Unread"}
                    </span>

                    <span className="text-zinc-500 font-mono">{msg.email}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-7">
            {activeMessage ? (
              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase text-amber-400">
                      Message Subject
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {activeMessage.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        {activeMessage.name}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">{activeMessage.email}</span>
                      <span>&bull;</span>
                      <span>{new Date(activeMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(activeMessage._id)}
                      className="p-2 rounded-xl glass-card text-zinc-400 hover:text-amber-400 transition-colors"
                      title={activeMessage.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(activeMessage._id)}
                      className="p-2 rounded-xl glass-card text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
                    Message Body
                  </span>
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                    {activeMessage.message}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                      activeMessage.subject
                    )}`}
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 rounded-3xl text-center text-zinc-500 text-xs">
                Select an inquiry from the list on the left to read full message details.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl text-zinc-500 text-xs">
          No contact inquiries recorded yet.
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this inquiry? This cannot be recovered."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
