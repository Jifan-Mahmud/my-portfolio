"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Menu, LogOut, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminHeader({ onOpenSidebar }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear token and cookie
      setAuthToken(null);
      document.cookie =
        "portfolio_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Better Auth client sign out if active
      if (authClient?.signOut) {
        await authClient.signOut().catch(() => {});
      }
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d0f14]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl glass-card text-zinc-400 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Admin Management
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 hover:text-white glass-card transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
