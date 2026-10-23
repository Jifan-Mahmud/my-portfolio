"use client";

import { useState } from "react";
import Link from "next/link";
import { setAuthToken, api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail, Shield, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Express Server to receive JWT token (using jose-cjs)
      const res = await api.adminLogin({ email: email.trim(), password: password.trim() });

      if (res.success && res.token) {
        // Store JWT token in localStorage for client API calls
        setAuthToken(res.token);

        // Set cookie so Next.js edge middleware grants immediate access to /admin
        document.cookie = `portfolio_admin_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;

        // 2. Optional Better Auth sign-in for client-side session sync
        try {
          if (authClient?.signIn?.email) {
            await authClient.signIn.email({
              email: email.trim(),
              password: password.trim(),
            });
          }
        } catch (authErr) {
          console.warn("Better auth client sync:", authErr.message);
        }

        // Navigate with full refresh so middleware instantly recognizes the cookie
        window.location.href = "/admin";
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0c10] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>

        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 border border-amber-400/20">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Owner Portal</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Authenticate with your administrative credentials
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-lg shadow-amber-400/20"
            >
              {loading ? "Verifying Credentials..." : "Access Admin Panel"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[11px] text-zinc-500">
              Protected by JWT &bull; Strictly single-admin architecture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
