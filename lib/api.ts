import { mockSolve, type ApiResponse } from "./mock";

export type ChatMessage = {
  type?: "user" | "assistant";
  message: string;
  file?: { content: string };
  solution_md_content?: string;
};

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function solveMath(chatHistory: ChatMessage[]): Promise<ApiResponse> {
  if (USE_MOCK) {
    return mockSolve(chatHistory);
  }

  const response = await fetch("/api/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_history: chatHistory }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw new ApiError("Invalid API key", 401);
    if (status === 429) throw new ApiError("API limit reached", 429);
    throw new ApiError("Something went wrong on the server", status);
  }

  const data = await response.json();

  if (!data.success) {
    throw new ApiError(data.message ?? "Request failed", 500);
  }

  return data as ApiResponse;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}
