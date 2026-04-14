import type { ChatMessage } from "./api";
import type { SolutionStep } from "./parseSteps";

export const HISTORY_KEY = "mathly-history";
const HISTORY_LIMIT = 50;

export interface HistorySession {
  id: string;
  timestamp: number;
  originalInput: string | null;
  imageThumbnail: string | null;
  ocrText: string | null;
  solutionMarkdown: string;
  chatHistory: ChatMessage[];
  steps: SolutionStep[];
}

export interface ProblemSnapshot {
  id: string;
  originalInput: string | null;
  originalImage: string | null;
  ocrText: string | null;
  chatHistory: ChatMessage[];
  steps: SolutionStep[];
}

export function readHistory(): HistorySession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s) => s && typeof s.id === "string");
  } catch {
    return [];
  }
}

export function writeHistory(sessions: HistorySession[]): void {
  if (typeof window === "undefined") return;
  const capped = sessions.slice(0, HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(capped));
}

export function removeHistorySession(sessionId: string): HistorySession[] {
  const next = readHistory().filter((s) => s.id !== sessionId);
  writeHistory(next);
  return next;
}

export function clearHistorySessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

function compactChatHistory(chatHistory: ChatMessage[]): ChatMessage[] {
  return chatHistory.map((m) => {
    if (!m.file) return m;
    return {
      ...m,
      file: undefined,
      message: m.message.includes("[image attached]") ? m.message : `${m.message}\n\n[image attached]`,
    };
  });
}

function getLatestSolutionMarkdown(problem: ProblemSnapshot): string {
  const latestAssistant = [...problem.chatHistory].reverse().find((m) => m.type === "assistant");
  if (latestAssistant?.solution_md_content?.trim()) return latestAssistant.solution_md_content;
  if (latestAssistant?.message?.trim()) return latestAssistant.message;
  return problem.steps.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n");
}

export async function createThumbnail(base64: string | null): Promise<string | null> {
  if (!base64 || typeof window === "undefined") return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxW = 100;
        const scale = Math.min(1, maxW / img.width);
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, width, height);
        const out = canvas.toDataURL("image/jpeg", 0.72);
        resolve(out.split(",")[1] ?? null);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

export function upsertHistorySession(session: HistorySession): HistorySession[] {
  const current = readHistory().filter((s) => s.id !== session.id);
  const next = [session, ...current].slice(0, HISTORY_LIMIT);
  writeHistory(next);
  return next;
}

export async function buildHistorySession(problem: ProblemSnapshot): Promise<HistorySession> {
  const imageThumbnail = await createThumbnail(problem.originalImage);
  return {
    id: problem.id,
    timestamp: Date.now(),
    originalInput: problem.originalInput,
    imageThumbnail,
    ocrText: problem.ocrText,
    solutionMarkdown: getLatestSolutionMarkdown(problem),
    chatHistory: compactChatHistory(problem.chatHistory),
    steps: problem.steps,
  };
}

export function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  if (hrs < 48) return "yesterday";
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
