"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Bars, Xmark } from "@gravity-ui/icons";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Works", href: "/#projects" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Services", href: "/#services" },
    { label: "Experience", href: "/#experience" },
    { label: "Certificates", href: "/#certificates" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const targetId = href.replace("/#", "").replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0d0f14]/80 dark:bg-[#0d0f14]/85 light:bg-white/85 backdrop-blur-md border-b border-white/5 py-3 shadow-lg shadow-black/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/#home"
          onClick={(e) => handleNavClick(e, "/#home")}
          className="text-2xl font-bold tracking-tight text-white light:text-zinc-900 group flex items-center gap-1"
        >
          <span className="font-serif italic text-3xl group-hover:text-amber-400 transition-colors">
            Jifan
          </span>
          <span className="text-amber-500 text-3xl">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-zinc-400 light:text-zinc-600 hover:text-white light:hover:text-zinc-950 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle id="desktop-theme-toggle" />
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact")}
            id="nav-hire-me-btn"
            className="px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white light:bg-zinc-900 text-zinc-950 light:text-white hover:bg-amber-400 light:hover:bg-amber-500 hover:text-black transition-all duration-200 shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer inline-flex items-center justify-center select-none"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle id="mobile-theme-toggle" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 light:text-zinc-700 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <Xmark className="w-6 h-6" /> : <Bars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f14]/95 light:bg-white/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-zinc-300 light:text-zinc-700 hover:text-amber-400 transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className="mt-2 text-center py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-500 transition-colors"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
