import type { SolutionStep } from "./parseSteps";

export type MistakeTag =
  | "sign-slip"
  | "domain-check"
  | "factoring-check"
  | "distribution-check"
  | "trig-id-check"
  | "limit-indeterminate";

export interface MistakeSignal {
  tag: MistakeTag;
  label: string;
  tip: string;
}

export type MistakeProfile = Record<MistakeTag, number>;

export interface MistakeProfileItem extends MistakeSignal {
  count: number;
}

interface DnaInput {
  originalInput: string | null;
  ocrText: string | null;
  steps: SolutionStep[];
}

const SIGNALS: Record<MistakeTag, Omit<MistakeSignal, "tag">> = {
  "sign-slip": {
    label: "Sign Slip Watch",
    tip: "Quick scan every + / - before moving to the next line.",
  },
  "domain-check": {
    label: "Domain Guard",
    tip: "Check invalid values first (denominator 0, log/sqrt constraints).",
  },
  "factoring-check": {
    label: "Factor Check",
    tip: "After factoring, expand once to confirm you get the original expression.",
  },
  "distribution-check": {
    label: "Distribution Check",
    tip: "When expanding, multiply every term. No leftovers.",
  },
  "trig-id-check": {
    label: "Trig Identity Check",
    tip: "Confirm identity direction before simplifying.",
  },
  "limit-indeterminate": {
    label: "Indeterminate Form Check",
    tip: "If direct substitution gives 0/0, simplify before evaluating.",
  },
};

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function detectMistakeSignals(input: DnaInput): MistakeSignal[] {
  const text = `${input.originalInput ?? ""}\n${input.ocrText ?? ""}\n${input.steps
    .map((s) => `${s.title}\n${s.content}`)
    .join("\n")}`.toLowerCase();

  const tags = new Set<MistakeTag>();

  if (hasAny(text, [/\+/, /-/, /quadratic/, /equation/])) tags.add("sign-slip");
  if (hasAny(text, [/\/x/, /denominator/, /ln/, /log/, /sqrt/, /x\s*!=?\s*0/])) tags.add("domain-check");
  if (hasAny(text, [/factor/, /factoring/, /\(x[^\n]*\)\(x[^\n]*\)/])) tags.add("factoring-check");
  if (hasAny(text, [/expand/, /binomial/, /\(a\s*\+\s*b\)\^?\d/])) tags.add("distribution-check");
  if (hasAny(text, [/sin/, /cos/, /tan/, /identity/, /derivative/])) tags.add("trig-id-check");
  if (hasAny(text, [/limit/, /0\/0/, /indeterminate/])) tags.add("limit-indeterminate");

  return [...tags].map((tag) => ({ tag, ...SIGNALS[tag] }));
}

export function buildMistakeProfile(inputs: DnaInput[]): MistakeProfile {
  const profile: MistakeProfile = {
    "sign-slip": 0,
    "domain-check": 0,
    "factoring-check": 0,
    "distribution-check": 0,
    "trig-id-check": 0,
    "limit-indeterminate": 0,
  };

  for (const input of inputs) {
    for (const signal of detectMistakeSignals(input)) {
      profile[signal.tag] += 1;
    }
  }

  return profile;
}

export function topMistakeSignals(profile: MistakeProfile, limit = 3): MistakeProfileItem[] {
  return (Object.keys(profile) as MistakeTag[])
    .filter((tag) => profile[tag] > 0)
    .sort((a, b) => profile[b] - profile[a])
    .slice(0, limit)
    .map((tag) => ({
      tag,
      count: profile[tag],
      label: SIGNALS[tag].label,
      tip: SIGNALS[tag].tip,
    }));
}
