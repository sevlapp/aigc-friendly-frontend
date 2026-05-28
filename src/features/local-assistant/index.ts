// src/features/local-assistant/index.ts

import type {
  AssistantReply,
  AssistantRouteCandidate,
  AssistantRouteSuggestion,
} from '@/entities/assistant-session';

export type StarterPrompt = {
  key: string;
  label: string;
  prompt: string;
};

export const LOCAL_ASSISTANT_PROMPTS: StarterPrompt[] = [
  {
    key: 'open-workbench',
    label: 'Open workbench',
    prompt: 'Show me the main AIGC workbench',
  },
  {
    key: 'review-structure',
    label: 'Review structure',
    prompt: 'Where should a new AI feature be placed?',
  },
  {
    key: 'try-lab',
    label: 'Try prompt lab',
    prompt: 'Open the prompt lab experiment',
  },
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function scoreCandidate(query: string, candidate: AssistantRouteCandidate) {
  const searchableText = normalizeText(
    [candidate.label, candidate.description, ...candidate.tags].join(' '),
  );

  if (!query) {
    return 0;
  }

  return query
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .reduce((score, token) => (searchableText.includes(token) ? score + 1 : score), 0);
}

function toSuggestion(candidate: AssistantRouteCandidate): AssistantRouteSuggestion {
  return {
    description: candidate.description,
    id: candidate.id,
    label: candidate.label,
    path: candidate.path,
  };
}

export function resolveLocalAssistantQuery(
  input: string,
  candidates: readonly AssistantRouteCandidate[],
): AssistantReply {
  const query = normalizeText(input);
  const rankedCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(query, candidate),
    }))
    .sort((left, right) => right.score - left.score);
  const matchedSuggestions = rankedCandidates
    .filter((item) => item.score > 0)
    .slice(0, 3)
    .map((item) => toSuggestion(item.candidate));

  if (matchedSuggestions.length > 0) {
    return {
      content: 'I found the closest local routes for that intent.',
      suggestions: matchedSuggestions,
    };
  }

  return {
    content: 'No exact local match yet. Start from the workbench or review the structure map.',
    suggestions: rankedCandidates.slice(0, 2).map((item) => toSuggestion(item.candidate)),
  };
}
