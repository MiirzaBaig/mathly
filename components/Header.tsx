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
          className="flex items-center justify-between px-4 sm:px-7"
          style={{
            height: 50,
            borderRadius: 9999,
            backgroundColor: scrolled ? "rgba(18,18,20,0.72)" : "rgba(10,10,12,0.58)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0.0) 100%)",
            backdropFilter: "blur(22px) saturate(140%)",
            WebkitBackdropFilter: "blur(22px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
            transition: "background 250ms ease, border-color 250ms ease",
          }}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <LogoFull size={25} />
          </Link>

          {/* Center nav — always visible (mobile + desktop) */}
          <nav className="flex items-center gap-1">
            {[
              { href: "/how", label: "HOW" },
              { href: "/about", label: "ABOUT" },
            ].map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold tracking-[0.14em] transition-all duration-200"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-muted)",
                    background: active ? "rgba(255,255,255,0.06)" : "transparent",
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
              <motion.button
                onClick={onOpenHistory}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative h-[30px] pl-2 pr-1.5 rounded-full flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title="Open solve history"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v5l3.5 2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="8" r="6.25" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                </svg>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  solves
                </span>
                <span
                  className="tabular-nums h-[20px] px-1.5 rounded-full text-[10px] font-semibold flex items-center justify-center"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.08)",
                    minWidth: 20,
                  }}
                >
                  {historyCount}
                </span>
                {showSavedPulse && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{
                      background: "#8b5cf6",
                      boxShadow: "0 0 6px rgba(139,92,246,0.5)",
                    }}
                  />
                )}
              </motion.button>
            )}
            <ApiUsageBadge />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
