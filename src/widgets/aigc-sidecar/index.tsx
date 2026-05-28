// src/widgets/aigc-sidecar/index.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { Button, Tag } from 'antd';

import { LOCAL_ASSISTANT_PROMPTS, resolveLocalAssistantQuery } from '@/features/local-assistant';

import type { AssistantMessage, AssistantRouteCandidate } from '@/entities/assistant-session';

type AigcSidecarProps = {
  onClose: () => void;
  onNavigate: (path: string) => void;
  open: boolean;
  routeCandidates: readonly AssistantRouteCandidate[];
};

type RenderedMessage = AssistantMessage & {
  suggestions?: ReturnType<typeof resolveLocalAssistantQuery>['suggestions'];
};

function createMessageId() {
  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AigcSidecar({ onClose, onNavigate, open, routeCandidates }: AigcSidecarProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<RenderedMessage[]>([
    {
      content: 'Tell me what you want to build or where you want to go.',
      id: 'assistant-welcome',
      role: 'assistant',
    },
  ]);
  const senderRef = useRef<HTMLDivElement | null>(null);
  const promptItems = useMemo(
    () =>
      LOCAL_ASSISTANT_PROMPTS.map((prompt) => ({
        description: prompt.prompt,
        key: prompt.key,
        label: prompt.label,
      })),
    [],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  function submitPrompt(nextPrompt: string) {
    const normalizedPrompt = nextPrompt.trim();

    if (!normalizedPrompt) {
      return;
    }

    const reply = resolveLocalAssistantQuery(normalizedPrompt, routeCandidates);

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        content: normalizedPrompt,
        id: createMessageId(),
        role: 'user',
      },
      {
        content: reply.content,
        id: createMessageId(),
        role: 'assistant',
        suggestions: reply.suggestions,
      },
    ]);
    setDraft('');
  }

  if (!open) {
    return null;
  }

  return (
    <div className="aigc-sidecar-backdrop">
      <aside aria-label="AI sidecar" className="aigc-sidecar">
        <div className="aigc-sidecar-header">
          <div className="min-w-0">
            <div className="brand-title">AI Sidecar</div>
            <div className="brand-subtitle">Local route and prompt companion</div>
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>

        <div className="aigc-sidecar-body">
          <Prompts
            items={promptItems}
            onItemClick={({ data }) => {
              const prompt = LOCAL_ASSISTANT_PROMPTS.find((item) => item.key === data.key);

              if (prompt) {
                submitPrompt(prompt.prompt);
              }
            }}
            title="Starter prompts"
            wrap
          />

          <div className="aigc-sidecar-scroll">
            {messages.map((message) => (
              <div
                className={
                  message.role === 'user'
                    ? 'aigc-sidecar-message-user'
                    : 'aigc-sidecar-message-assistant'
                }
                key={message.id}
              >
                <Bubble
                  content={message.content}
                  placement={message.role === 'user' ? 'end' : 'start'}
                />
                {message.suggestions && message.suggestions.length > 0 ? (
                  <div className="route-suggestion-list">
                    {message.suggestions.map((suggestion) => (
                      <div className="route-suggestion" key={suggestion.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="route-suggestion-title">{suggestion.label}</div>
                            <div className="route-suggestion-description">
                              {suggestion.description}
                            </div>
                          </div>
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                              onNavigate(suggestion.path);
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="metadata-row">
            <Tag>local</Tag>
            <span>{routeCandidates.length} routes indexed</span>
          </div>

          <div className="aigc-sidecar-sender" ref={senderRef}>
            <Sender
              onChange={(value) => setDraft(value)}
              onSubmit={submitPrompt}
              placeholder="Describe a route or frontend task"
              value={draft}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
