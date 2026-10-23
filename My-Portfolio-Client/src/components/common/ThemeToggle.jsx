"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ id = "theme-toggle-btn" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-800/20 border border-white/10 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id={id}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
      className="p-2 rounded-full border border-zinc-700/50 light:border-zinc-300 hover:border-amber-500/50 text-zinc-300 light:text-zinc-800 hover:text-amber-400 light:hover:text-amber-600 bg-zinc-900/60 light:bg-white/90 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
