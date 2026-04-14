"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoFull } from "./Logo";

export default function SubpageNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div
        className="flex items-center justify-between px-6"
        style={{
          height: 56,
          background: "rgba(9,9,11,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" className="flex items-center">
          <LogoFull size={26} />
        </Link>
        <div className="flex items-center gap-1">
          {[
            { href: "/how", label: "HOW" },
            { href: "/about", label: "ABOUT" },
          ].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-[0.12em] transition-all duration-200"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? "rgba(139,92,246,0.08)" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="btn-gradient px-4 py-1.5 text-xs font-semibold rounded-lg tracking-[0.05em] ml-2"
          >
            TRY IT
          </Link>
        </div>
      </div>
      {/* Gradient bottom border */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3) 30%, rgba(6,182,212,0.3) 70%, transparent)",
        }}
      />
    </nav>
  );
}
