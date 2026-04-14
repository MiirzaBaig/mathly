export type HintModeId = "nudge" | "hint" | "strong_hint" | "full_solve";

export interface HintMode {
  id: HintModeId;
  label: string;
  caption: string;
  prompt: string;
}

export const HINT_LADDER: HintMode[] = [
  {
    id: "nudge",
    label: "nudge",
    caption: "tiny push, no spoilers",
    prompt:
      "Give me one tiny nudge only. Do not give the final answer, and do not solve it fully yet.",
  },
  {
    id: "hint",
    label: "hint",
    caption: "point me to the right move",
    prompt:
      "Give me a medium hint and the next best step to try. Keep it short and do not reveal the full final answer.",
  },
  {
    id: "strong_hint",
    label: "strong hint",
    caption: "almost there, show structure",
    prompt:
      "Give me a strong hint with structure and setup, but stop before the final numeric/algebraic answer.",
  },
  {
    id: "full_solve",
    label: "full solve",
    caption: "okay, show the full run",
    prompt:
      "Give me the complete step-by-step solution with a final answer and a quick verification.",
  },
];
