"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoFull } from "./Logo";
import ApiUsageBadge from "./ApiUsageBadge";

interface HeaderProps {
  onOpenHistory?: () => void;
  historyCount?: number;
  showSavedPulse?: boolean;
}

export default function Header({ onOpenHistory, historyCount = 0, showSavedPulse = false }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40"
      style={{
        paddingTop: 14,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 1040,
        }}
      >
        <div
          className="flex items-center justify-between px-5 sm:px-7"
          style={{
            height: 50,
            borderRadius: 9999,
            background: scrolled ? "rgba(20,20,23,0.86)" : "rgba(12,12,14,0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.32)",
            transition: "background 300ms ease",
          }}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <LogoFull size={25} />
          </Link>

          {/* Center nav — YC-style minimal */}
          <nav className="hidden sm:flex items-center gap-1.5">
            {[
              { href: "/how", label: "HOW" },
              { href: "/about", label: "ABOUT" },
            ].map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-[0.14em] transition-all duration-200"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-muted)",
                    background: "transparent",
                  }}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--accent-solid)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="relative h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
                style={{
                  color: "var(--text-secondary)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title="Open solve history"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 3.8v3.4l2.1 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{historyCount}</span>
                {showSavedPulse && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ background: "#22c55e", boxShadow: "0 0 0 4px rgba(34,197,94,0.2)" }}
                  />
                )}
              </button>
            )}
            <ApiUsageBadge />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
