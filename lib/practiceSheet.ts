import type { SolutionStep } from "./parseSteps";

export type PracticeMode = "drill" | "timed" | "exam";
export type PracticeTopic = "algebra" | "calculus" | "trig" | "limits" | "mixed";

export interface PracticeQuestion {
  id: string;
  prompt: string;
  answer: string;
  hint: string;
}

export interface PracticeSheet {
  title: string;
  topic: PracticeTopic;
  mode: PracticeMode;
  count: number;
  targetMinutes: number;
  questions: PracticeQuestion[];
}

interface BuildPracticeSheetOptions {
  mode: PracticeMode;
  count: 5 | 10 | 20;
  seed: number;
}

export interface PracticeProblemInput {
  originalInput: string | null;
  ocrText: string | null;
  steps: SolutionStep[];
}

interface QuestionTemplate {
  prompt: string;
  answer: string;
  hint: string;
}

const BANK: Record<PracticeTopic, QuestionTemplate[]> = {
  algebra: [
    { prompt: "Solve: x^2 - 7x + 12 = 0", answer: "x = 3 or x = 4", hint: "Factor into (x-a)(x-b)." },
    { prompt: "Simplify: (3x^2 - 12x) / (3x)", answer: "x - 4, with x != 0", hint: "Factor numerator first." },
    { prompt: "Solve: 2x + 5 = 17", answer: "x = 6", hint: "Isolate x in two clean steps." },
    { prompt: "Expand: (x + 4)^2", answer: "x^2 + 8x + 16", hint: "Use (a+b)^2 formula." },
    { prompt: "Factor: x^2 + 9x + 20", answer: "(x + 4)(x + 5)", hint: "Find numbers adding to 9 and multiplying to 20." },
  ],
  calculus: [
    { prompt: "Differentiate: f(x) = x^3 - 4x", answer: "f'(x) = 3x^2 - 4", hint: "Power rule on each term." },
    { prompt: "Differentiate: f(x) = sin(x)cos(x)", answer: "f'(x) = cos^2(x) - sin^2(x)", hint: "Use product rule." },
    { prompt: "Integrate: integral(2x + 3) dx", answer: "x^2 + 3x + C", hint: "Integrate term-by-term." },
    { prompt: "Differentiate: f(x) = ln(x)", answer: "f'(x) = 1/x", hint: "Classic derivative identity." },
    { prompt: "Integrate: integral(1/x) dx", answer: "ln|x| + C", hint: "Absolute value matters." },
  ],
  trig: [
    { prompt: "Simplify: sin^2(x) + cos^2(x)", answer: "1", hint: "Most-used trig identity." },
    { prompt: "Differentiate: sin(x)", answer: "cos(x)", hint: "Basic trig derivative." },
    { prompt: "Differentiate: cos(x)", answer: "-sin(x)", hint: "Watch the sign." },
    { prompt: "Simplify: tan(x) * cos(x)", answer: "sin(x)", hint: "Rewrite tan(x) as sin/cos." },
    { prompt: "Solve on [0, 2pi): sin(x) = 0", answer: "x = 0, pi", hint: "Think unit circle intercepts." },
  ],
  limits: [
    { prompt: "Evaluate: lim x->1 (x^2 - 1)/(x - 1)", answer: "2", hint: "Factor numerator first." },
    { prompt: "Evaluate: lim x->0 (sin x)/x", answer: "1", hint: "Standard limit identity." },
    { prompt: "Evaluate: lim x->2 (3x + 1)", answer: "7", hint: "Direct substitution works." },
    { prompt: "Evaluate: lim x->3 (x^2 - 9)/(x - 3)", answer: "6", hint: "Difference of squares." },
    { prompt: "Evaluate: lim x->0 (1 - cos x)/x^2", answer: "1/2", hint: "Use trig limit identity." },
  ],
  mixed: [
    { prompt: "Solve: x^2 + 5x + 6 = 0", answer: "x = -2 or x = -3", hint: "Factor the quadratic." },
    { prompt: "Differentiate: x^2 * e^x", answer: "2xe^x + x^2e^x", hint: "Product rule." },
    { prompt: "Simplify: (x^2 - 1)/(x - 1)", answer: "x + 1, with x != 1", hint: "Factor numerator." },
    { prompt: "Evaluate: lim x->0 (e^x - 1)/x", answer: "1", hint: "Known exponential limit." },
    { prompt: "Integrate: integral(5x^4) dx", answer: "x^5 + C", hint: "Increase power, divide by new power." },
  ],
};

function detectTopic(problem: PracticeProblemInput): PracticeTopic {
  const text = `${problem.originalInput ?? ""}\n${problem.ocrText ?? ""}\n${problem.steps
    .map((s) => `${s.title}\n${s.content}`)
    .join("\n")}`.toLowerCase();

  if (/(derivative|integral|dx|d\/dx|antiderivative|ln\(|\bcos\(|\bsin\()/i.test(text)) return "calculus";
  if (/(sin|cos|tan|identity|unit circle)/i.test(text)) return "trig";
  if (/(limit|x->|indeterminate|0\/0)/i.test(text)) return "limits";
  if (/(factor|quadratic|equation|simplify|expand)/i.test(text)) return "algebra";
  return "mixed";
}

function pickQuestion(topic: PracticeTopic, i: number, seed: number): QuestionTemplate {
  const bank = BANK[topic];
  const idx = (seed * 13 + i * 7) % bank.length;
  return bank[idx];
}

function modeMinutes(mode: PracticeMode, count: number): number {
  if (mode === "drill") return Math.max(8, Math.round(count * 1.4));
  if (mode === "timed") return Math.max(6, Math.round(count * 0.9));
  return Math.max(10, Math.round(count * 1.1));
}

function titleFor(mode: PracticeMode, topic: PracticeTopic): string {
  const topicLabel = topic === "mixed" ? "Mixed" : topic.charAt(0).toUpperCase() + topic.slice(1);
  if (mode === "drill") return `${topicLabel} Drill Pack`;
  if (mode === "timed") return `${topicLabel} Speed Run`;
  return `${topicLabel} Mock Sheet`;
}

export function buildPracticeSheet(problem: PracticeProblemInput, options: BuildPracticeSheetOptions): PracticeSheet {
  const topic = detectTopic(problem);
  const questions: PracticeQuestion[] = Array.from({ length: options.count }, (_, i) => {
    const q = pickQuestion(topic, i, options.seed);
    return {
      id: `q-${topic}-${options.seed}-${i}`,
      prompt: q.prompt,
      answer: q.answer,
      hint: q.hint,
    };
  });

  return {
    title: titleFor(options.mode, topic),
    topic,
    mode: options.mode,
    count: options.count,
    targetMinutes: modeMinutes(options.mode, options.count),
    questions,
  };
}
