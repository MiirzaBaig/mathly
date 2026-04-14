"use client";

import { useId } from "react";

/**
 * Mathly logo mark — moon lens + electric slash.
 * Inline SVG keeps it crisp at every size.
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `logo-grad-${uid}`;
  const glowId = `logo-glow-${uid}`;
  const accentId = `logo-accent-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="Mathly logo"
    >
      <defs>
        <linearGradient id={gradId} x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b1020" />
          <stop offset="55%" stopColor="#17213b" />
          <stop offset="100%" stopColor="#1e2c4f" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={accentId} x1="11" y1="8.8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill={`url(#${gradId})`} />
      <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" stroke="rgba(124,58,237,0.45)" />
      <circle cx="16" cy="16" r="9" stroke="rgba(129,140,248,0.3)" strokeWidth="1.3" fill="none" />
      <path
        d="M20 9.2A7 7 0 1 0 20 22.8A5.6 5.6 0 1 1 20 9.2Z"
        fill={`url(#${accentId})`}
        filter={`url(#${glowId})`}
      />
      <path
        d="M11 23 L15.2 15.5 L12.8 15.5 L16.8 8.9"
        stroke="#22d3ee"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#${glowId})`}
      />
      <path
        d="M9 24.3 C12 26.2, 20 26.3, 23.1 24.2"
        stroke="rgba(99,102,241,0.72)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="23.8" cy="8.3" r="1.2" fill="#a78bfa" opacity="0.9" />
      <circle cx="8.6" cy="9.2" r="0.9" fill="#22d3ee" opacity="0.75" />
      <circle cx="7.7" cy="22.9" r="0.8" fill="#818cf8" opacity="0.8" />
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="8.5"
        stroke="rgba(255,255,255,0.08)"
      />
    </svg>
  );
}

/**
 * Full logo with mark + wordmark.
 * "Night" in clean white, "Solve" in neon accent.
 */
interface LogoFullProps {
  size?: number;
  className?: string;
}

export function LogoFull({ size = 28, className = "" }: LogoFullProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span
        className="tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size * 0.62,
          lineHeight: 1,
        }}
      >
        <span style={{ color: "var(--text-primary)", fontWeight: 900 }}>Math</span>
        <span
          style={{
            fontWeight: 900,
            color: "var(--accent-solid)",
          }}
        >
          ly
        </span>
      </span>
    </div>
  );
}

/**
 * Simplified logo for favicon / tiny sizes.
 * Returns raw SVG string for use in favicon generation.
 */
export function logoFaviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b1020"/>
      <stop offset="55%" stop-color="#17213b"/>
      <stop offset="100%" stop-color="#1e2c4f"/>
    </linearGradient>
    <linearGradient id="a" x1="11" y1="8.8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8.5" fill="url(#g)"/>
  <rect x="0.5" y="0.5" width="31" height="31" rx="8" stroke="rgba(124,58,237,0.48)"/>
  <circle cx="16" cy="16" r="9" stroke="rgba(129,140,248,0.32)" stroke-width="1.3" fill="none"/>
  <path d="M20 9.2A7 7 0 1 0 20 22.8A5.6 5.6 0 1 1 20 9.2Z" fill="url(#a)"/>
  <path d="M11 23L15.2 15.5L12.8 15.5L16.8 8.9" stroke="#22d3ee" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}
