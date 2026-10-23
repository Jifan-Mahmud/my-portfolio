"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import StatCard from "@/components/admin/StatCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  FolderGit2,
  Cpu,
  Mail,
  GraduationCap,
  Plus,
  ArrowUpRight,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Award,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      await api.markMessageRead(id);
      fetchStats();
    } catch (err) {
      alert("Failed to update message status: " + err.message);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteId) return;
    try {
      await api.deleteMessage(deleteId);
      setDeleteId(null);
      fetchStats();
    } catch (err) {
      alert("Failed to delete message: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Greeting & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            System Overview
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Welcome, Jifan Mahmud
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your personal portfolio database, projects, and incoming client messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="p-2.5 rounded-full glass-card text-zinc-400 hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
          </button>

          <Link
            href="/admin/certificates"
            className="px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider glass-card text-white hover:border-amber-400/50 transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Certificates</span>
          </Link>

          <Link
            href="/admin/projects"
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          icon={FolderGit2}
          color="text-amber-400"
        />
        <StatCard
          title="Certificates"
          value={stats?.totalCertificates ?? 0}
          icon={Award}
          color="text-amber-400"
          change="Verified Credentials"
        />
        <StatCard
          title="Active Skills"
          value={stats?.totalSkills ?? 0}
          icon={Cpu}
          color="text-emerald-400"
        />
        <StatCard
          title="Unread Inquiries"
          value={stats?.unreadMessages ?? 0}
          icon={Mail}
          color="text-rose-400"
          change={stats?.unreadMessages > 0 ? "Requires review" : "All caught up"}
        />
      </div>

      {/* Recent Contact Inquiries */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Client Inquiries</h2>
            <p className="text-xs text-zinc-400">Latest messages submitted via the contact form</p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentMessages && stats.recentMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-white/5 uppercase font-mono tracking-wider">
                  <th className="pb-3 font-semibold">Sender</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Subject</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-semibold text-white">{msg.name}</td>
                    <td className="py-4 text-zinc-300">{msg.email}</td>
                    <td className="py-4 text-zinc-400 max-w-xs truncate">{msg.subject}</td>
                    <td className="py-4">
                      {msg.read ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-zinc-400">
                          Read
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleRead(msg._id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                          title={msg.read ? "Mark unread" : "Mark as read"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(msg._id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-xs">
            No contact inquiries found. You are completely caught up!
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Contact Inquiry"
        message="Are you sure you want to delete this message? This action is permanent."
        onConfirm={handleDeleteMessage}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
