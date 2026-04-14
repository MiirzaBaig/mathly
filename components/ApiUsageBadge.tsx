"use client";

import { useApiUsage } from "@/hooks/useApiUsage";

export default function ApiUsageBadge() {
  const { count, limit, status, mounted } = useApiUsage();

  if (!mounted) return null;

  const colorMap = {
    safe: { dot: "var(--accent-solid)", text: "var(--text-secondary)" },
    warning: { dot: "var(--accent-solid)", text: "var(--text-secondary)" },
    danger: { dot: "var(--accent-solid)", text: "var(--text-secondary)" },
    exhausted: { dot: "var(--accent-solid)", text: "var(--text-secondary)" },
  };

  const colors = colorMap[status];

  return (
    <div
      className="flex items-center gap-2 text-xs font-semibold"
      style={{
        color: colors.text,
        letterSpacing: "0.02em",
      }}
      title={`${count} of ${limit} lifetime API calls used`}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: colors.dot,
          display: "inline-block",
        }}
      />
      <span>
        {count}/{limit}
      </span>
    </div>
  );
}
