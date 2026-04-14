import type { SolutionStep } from "./parseSteps";

export interface ExamRescueCard {
  id: "formula" | "playbook" | "check";
  title: string;
  value: string;
}

interface ExamRescueInput {
  steps: SolutionStep[];
  ocrText: string | null;
}

function getFirstLatexBlock(steps: SolutionStep[]): string | null {
  const joined = steps.map((s) => s.content).join("\n");
  const match = joined.match(/\$\$([\s\S]+?)\$\$/);
  if (!match?.[1]) return null;
  return match[1].replace(/\s+/g, " ").trim();
}

function getBoxedResult(steps: SolutionStep[]): string | null {
  const joined = steps.map((s) => s.content).join("\n");
  const match = joined.match(/\\boxed\{([^}]+)\}/);
  if (!match?.[1]) return null;
  return match[1].replace(/\s+/g, " ").trim();
}

export function buildExamRescueCards({ steps, ocrText }: ExamRescueInput): ExamRescueCard[] {
  const formula =
    ocrText?.trim() ||
    getFirstLatexBlock(steps) ||
    "No clean formula detected. Read the setup line first, then map knowns and unknowns.";

  const first = steps[0]?.title ?? "Read the setup";
  const second = steps[1]?.title ?? "Apply the core rule";
  const playbook = `1) ${first}\n2) ${second}`;

  const boxed = getBoxedResult(steps);
  const check = boxed
    ? `Final target: ${boxed}. Plug it back once to verify.`
    : "Do a 15-second check: substitute your result and confirm both sides match.";

  return [
    { id: "formula", title: "Formula Snap", value: formula },
    { id: "playbook", title: "2-Step Playbook", value: playbook },
    { id: "check", title: "Final Check", value: check },
  ];
}
