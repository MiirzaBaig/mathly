export interface ApiResponse {
  success: boolean;
  data: {
    solution_md_content: string;
    message_count: number;
    ocr_text?: string;
  };
}

const TEXT_SOLUTIONS: Record<string, string> = {
  quadratic: `## Given Equation

We need to solve the quadratic equation:

$$x^2 + 5x + 6 = 0$$

## Factoring Approach

We look for two numbers that multiply to **6** and add to **5**.

Those numbers are **2** and **3**, since $2 \\times 3 = 6$ and $2 + 3 = 5$.

## Factored Form

$$x^2 + 5x + 6 = (x + 2)(x + 3) = 0$$

## Apply Zero Product Property

Setting each factor equal to zero:

$$x + 2 = 0 \\quad \\Rightarrow \\quad x = -2$$

$$x + 3 = 0 \\quad \\Rightarrow \\quad x = -3$$

## Solution

$$\\boxed{x = -2 \\quad \\text{or} \\quad x = -3}$$

We can verify: $(-2)^2 + 5(-2) + 6 = 4 - 10 + 6 = 0$ ✓`,

  derivative: `## Problem Setup

Find the derivative of:

$$f(x) = \\sin(x) \\cdot \\cos(x)$$

## Strategy: Product Rule

Since $f(x) = u \\cdot v$ where $u = \\sin(x)$ and $v = \\cos(x)$, we apply the **Product Rule**:

$$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$

## Compute Individual Derivatives

$$u = \\sin(x) \\implies u' = \\cos(x)$$

$$v = \\cos(x) \\implies v' = -\\sin(x)$$

## Apply the Product Rule

$$f'(x) = \\cos(x) \\cdot \\cos(x) + \\sin(x) \\cdot (-\\sin(x))$$

$$f'(x) = \\cos^2(x) - \\sin^2(x)$$

## Simplify with Double Angle Identity

Using the identity $\\cos(2x) = \\cos^2(x) - \\sin^2(x)$:

$$\\boxed{f'(x) = \\cos(2x)}$$`,

  integral: `## Integral Setup

We want to evaluate:

$$\\int \\frac{1}{x} \\, dx$$

## Recognizing the Pattern

This is a fundamental integral. The derivative of $\\ln|x|$ is $\\frac{1}{x}$, which means:

$$\\frac{d}{dx}[\\ln|x|] = \\frac{1}{x}$$

## Apply the Fundamental Theorem

By the definition of the antiderivative:

$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$

## Result

$$\\boxed{\\int \\frac{1}{x} \\, dx = \\ln|x| + C}$$

**Note:** The absolute value $|x|$ is essential because $\\ln$ is only defined for positive real numbers, but $\\frac{1}{x}$ is defined for all $x \\neq 0$.`,

  simplify: `## Expression to Simplify

$$\\frac{3x^2 + 6x}{3x}$$

## Factor the Numerator

Factor out the GCF (Greatest Common Factor) from the numerator:

$$3x^2 + 6x = 3x(x + 2)$$

## Rewrite the Fraction

$$\\frac{3x(x + 2)}{3x}$$

## Cancel Common Factors

Assuming $x \\neq 0$, cancel $3x$ from numerator and denominator:

$$\\frac{\\cancel{3x}(x + 2)}{\\cancel{3x}} = x + 2$$

## Result

$$\\boxed{\\frac{3x^2 + 6x}{3x} = x + 2, \\quad x \\neq 0}$$`,

  limit: `## Limit to Evaluate

$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$$

## Direct Substitution Check

Substituting $x = 1$ directly gives $\\frac{0}{0}$ — an **indeterminate form**. We need to simplify first.

## Factor the Numerator

The numerator is a difference of squares:

$$x^2 - 1 = (x-1)(x+1)$$

## Simplify

$$\\lim_{x \\to 1} \\frac{(x-1)(x+1)}{x-1} = \\lim_{x \\to 1} (x+1)$$

Here we cancelled $(x-1)$ since we're taking a limit as $x \\to 1$, not at $x = 1$.

## Evaluate

$$\\lim_{x \\to 1} (x+1) = 1 + 1 = \\boxed{2}$$`,

  expand: `## Expression

Expand $(a + b)^3$

## Using Pascal's Triangle / Binomial Theorem

The **Binomial Theorem** states:

$$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$$

For $n = 3$, the binomial coefficients from Pascal's Triangle are: **1, 3, 3, 1**

## Expansion

$$(a + b)^3 = \\binom{3}{0}a^3 + \\binom{3}{1}a^2 b + \\binom{3}{2}a b^2 + \\binom{3}{3}b^3$$

## Evaluate Coefficients

$$= 1 \\cdot a^3 + 3 \\cdot a^2 b + 3 \\cdot a b^2 + 1 \\cdot b^3$$

## Final Result

$$\\boxed{(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3}$$`,
};

const FOLLOWUP_RESPONSE = `## Follow-up Explanation

Great question! Let me clarify this step further.

The key insight here is that we're working with a **fundamental algebraic principle** that appears throughout mathematics.

## Breaking It Down

When we encounter this type of expression, we can think of it step-by-step:

$$\\text{Step 1: Identify the structure}$$

$$\\text{Step 2: Apply the appropriate rule or theorem}$$

$$\\text{Step 3: Simplify systematically}$$

## The Core Concept

The underlying principle relies on the fact that for any valid operation:

$$f(a) \\circ f(b) = f(a \\circ b)$$

where $\\circ$ represents the relevant operation.

## Summary

Think of it this way — math operations follow consistent patterns. Once you recognize the pattern, the solution becomes clear!

Is there a specific step you'd like me to elaborate on further?`;

const IMAGE_SOLUTION = `## Problem Detected (from image)

OCR analysis detected a mathematical expression. Here is the complete solution:

## Problem

Solve the equation detected in your image:

$$2x^2 - 8x + 6 = 0$$

## Simplify First

Divide everything by 2:

$$x^2 - 4x + 3 = 0$$

## Factor

Find two numbers that multiply to **3** and add to **−4**: those are **−1** and **−3**.

$$(x - 1)(x - 3) = 0$$

## Solve Each Factor

$$x - 1 = 0 \\implies x = 1$$

$$x - 3 = 0 \\implies x = 3$$

## Solutions

$$\\boxed{x = 1 \\quad \\text{or} \\quad x = 3}$$

**Verification:**
- $x=1$: $2(1)^2 - 8(1) + 6 = 2 - 8 + 6 = 0$ ✓
- $x=3$: $2(9) - 8(3) + 6 = 18 - 24 + 6 = 0$ ✓`;

function detectSolutionType(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("x² + 5x + 6") || m.includes("x^2 + 5x + 6") || m.includes("quadratic")) return "quadratic";
  if (m.includes("derivative") || m.includes("sin(x)") || m.includes("cos(x)")) return "derivative";
  if (m.includes("integral") || m.includes("1/x")) return "integral";
  if (m.includes("simplify") || m.includes("3x²") || m.includes("3x^2")) return "simplify";
  if (m.includes("limit") || m.includes("x²-1") || m.includes("x^2-1")) return "limit";
  if (m.includes("expand") || m.includes("(a + b)") || m.includes("(a+b)")) return "expand";
  return "quadratic"; // default
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockSolve(
  chatHistory: Array<{ type?: string; message: string; file?: { content: string }; solution_md_content?: string }>
): Promise<ApiResponse> {
  // Simulate realistic network latency
  await delay(1200 + Math.random() * 800);

  const lastUserMessage = [...chatHistory].reverse().find(
    (m) => m.type !== "assistant"
  );

  const isFollowup = chatHistory.filter((m) => m.type === "assistant").length > 0;
  const hasImage = lastUserMessage?.file !== undefined;

  if (isFollowup) {
    return {
      success: true,
      data: {
        solution_md_content: FOLLOWUP_RESPONSE,
        message_count: chatHistory.length + 1,
      },
    };
  }

  if (hasImage) {
    return {
      success: true,
      data: {
        solution_md_content: IMAGE_SOLUTION,
        message_count: 1,
        ocr_text: "2x² - 8x + 6 = 0",
      },
    };
  }

  const messageText = lastUserMessage?.message ?? "";
  const solutionKey = detectSolutionType(messageText);

  return {
    success: true,
    data: {
      solution_md_content:
        TEXT_SOLUTIONS[solutionKey] ?? TEXT_SOLUTIONS["quadratic"],
      message_count: 1,
    },
  };
}
