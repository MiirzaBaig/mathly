"use client";

import { useState, useCallback } from "react";
import { solveMath, ApiError, type ChatMessage } from "@/lib/api";
import { parseSteps, type SolutionStep } from "@/lib/parseSteps";

export interface Problem {
  id: string;
  chatHistory: ChatMessage[];
  steps: SolutionStep[];
  originalInput: string | null;
  originalImage: string | null;
  ocrText: string | null;
  isLoading: boolean;
  isFollowupLoading: boolean;
  error: string | null;
  createdAt: number;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useProblemStore(onApiSuccess?: () => void) {
  const [problems, setProblems] = useState<Problem[]>([]);

  const updateProblem = useCallback(
    (id: string, updates: Partial<Problem>) => {
      setProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const addProblem = useCallback(
    async ({
      text,
      imageBase64,
    }: {
      text: string;
      imageBase64?: string;
    }) => {
      const id = generateId();

      const firstMessage: ChatMessage = imageBase64
        ? { message: text || "Solve this math problem", file: { content: imageBase64 } }
        : { message: text };

      const newProblem: Problem = {
        id,
        chatHistory: [firstMessage],
        steps: [],
        originalInput: text || null,
        originalImage: imageBase64 || null,
        ocrText: null,
        isLoading: true,
        isFollowupLoading: false,
        error: null,
        createdAt: Date.now(),
      };

      setProblems((prev) => [newProblem, ...prev]);

      try {
        const response = await solveMath([firstMessage]);
        const responseStamp = Date.now();

        const assistantMessage: ChatMessage = {
          type: "assistant",
          message: response.data.solution_md_content,
          solution_md_content: response.data.solution_md_content,
        };

        const updatedHistory = [...[firstMessage], assistantMessage];

        // If OCR text returned, annotate the user message
        if (response.data.ocr_text) {
          updatedHistory[0] = {
            ...firstMessage,
            message: `${firstMessage.message}\n\n[OCR: ${response.data.ocr_text}]`,
          };
        }

        updateProblem(id, {
          chatHistory: updatedHistory,
          steps: parseSteps(response.data.solution_md_content, `problem-${id}-${responseStamp}`),
          ocrText: response.data.ocr_text ?? null,
          isLoading: false,
        });

        onApiSuccess?.();
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
        updateProblem(id, { isLoading: false, error: message });
      }
    },
    [updateProblem, onApiSuccess]
  );

  const addFollowup = useCallback(
    async (problemId: string, followupText: string) => {
      const problem = problems.find((p) => p.id === problemId);
      if (!problem || problem.isFollowupLoading) return;

      updateProblem(problemId, { isFollowupLoading: true, error: null });

      const newUserMessage: ChatMessage = {
        type: "user",
        message: followupText,
      };

      const updatedHistory = [...problem.chatHistory, newUserMessage];

      try {
        const response = await solveMath(updatedHistory);
        const followupStamp = Date.now();

        const assistantMessage: ChatMessage = {
          type: "assistant",
          message: response.data.solution_md_content,
          solution_md_content: response.data.solution_md_content,
        };

        const newSteps = parseSteps(
          response.data.solution_md_content,
          `followup-${problemId}-${followupStamp}`
        );

        updateProblem(problemId, {
          chatHistory: [...updatedHistory, assistantMessage],
          steps: [
            ...problem.steps,
            {
              id: `followup-title-${followupStamp}`,
              title: `Follow-up: ${followupText.slice(0, 40)}${followupText.length > 40 ? "…" : ""}`,
              content: response.data.solution_md_content,
            },
            ...newSteps.slice(1),
          ],
          isFollowupLoading: false,
        });

        onApiSuccess?.();
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Follow-up failed. Try again.";
        updateProblem(problemId, { isFollowupLoading: false, error: message });
      }
    },
    [problems, updateProblem, onApiSuccess]
  );

  const clearError = useCallback(
    (problemId: string) => {
      updateProblem(problemId, { error: null });
    },
    [updateProblem]
  );

  return { problems, addProblem, addFollowup, clearError };
}
