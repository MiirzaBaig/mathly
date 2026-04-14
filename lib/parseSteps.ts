export interface SolutionStep {
  id: string;
  title: string;
  content: string;
}

export function parseSteps(markdown: string, idPrefix = "step"): SolutionStep[] {
  if (!markdown?.trim()) return [];

  // Split on ## headings
  const lines = markdown.split("\n");
  const steps: SolutionStep[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) {
        steps.push({
          id: `${idPrefix}-${steps.length}`,
          title: current.title,
          content: current.lines.join("\n").trim(),
        });
      }
      current = { title: line.replace(/^## /, "").trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }

  // Push last section
  if (current) {
    steps.push({
      id: `${idPrefix}-${steps.length}`,
      title: current.title,
      content: current.lines.join("\n").trim(),
    });
  }

  // If no ## headings found, treat the whole thing as one step
  if (steps.length === 0 && markdown.trim()) {
    steps.push({
      id: `${idPrefix}-0`,
      title: "Solution",
      content: markdown.trim(),
    });
  }

  return steps;
}
