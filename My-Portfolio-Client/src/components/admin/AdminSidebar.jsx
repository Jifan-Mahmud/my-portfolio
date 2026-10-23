"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Mail,
  UserCheck,
  GraduationCap,
  Briefcase,
  Award,
  X,
} from "lucide-react";

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Skills", href: "/admin/skills", icon: Cpu },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "Profile & CV", href: "/admin/profile", icon: UserCheck },
    { label: "Experience & Edu", href: "/admin/experience", icon: GraduationCap },
    { label: "Services", href: "/admin/services", icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0c10] border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand & Mobile Close */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-serif italic text-2xl font-bold text-white">
                Jifan<span className="text-amber-400">.</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Admin
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status */}
        <div className="pt-4 border-t border-white/10 text-xs text-zinc-500">
          <p className="font-mono text-[11px]">B.M. Jifan Mahmud</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">Admin Workspace v1.0</p>
        </div>
      </aside>
    </>
  );
}
