"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mathly-api-calls";
const LIMIT = 75;
const SYNC_EVENT = "mathly-api-usage-sync";

export type UsageStatus = "safe" | "warning" | "danger" | "exhausted";

export function useApiUsage() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const read = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      setCount(stored ? parseInt(stored, 10) || 0 : 0);
    };

    read();
    setMounted(true);

    // Keep multiple hook instances (and tabs) in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) read();
    };
    const onSync = () => read();

    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onSync as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onSync as EventListener);
    };
  }, []);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      // Dispatch async to avoid setState during another component's render.
      setTimeout(() => window.dispatchEvent(new Event(SYNC_EVENT)), 0);
      return next;
    });
  }, []);

  const status: UsageStatus =
    count >= LIMIT
      ? "exhausted"
      : count >= 73
      ? "danger"
      : count >= 65
      ? "warning"
      : "safe";

  const isExhausted = count >= LIMIT;

  return { count, limit: LIMIT, status, isExhausted, increment, mounted };
}
