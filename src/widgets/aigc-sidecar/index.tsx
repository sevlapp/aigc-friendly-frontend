// src/widgets/aigc-sidecar/index.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bubble, Sender } from '@ant-design/x';
import { Button, Tag } from 'antd';

import { resolveLocalAssistantQuery } from '@/features/local-assistant';

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
      content: '告诉我你想构建什么，或想打开哪个页面。',
      id: 'assistant-welcome',
      role: 'assistant',
    },
  ]);
  const senderRef = useRef<HTMLDivElement | null>(null);

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

  const submitPrompt = useCallback(
    (nextPrompt: string) => {
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
    },
    [routeCandidates],
  );

  if (!open) {
    return null;
  }

  return (
    <div className="aigc-sidecar-backdrop">
      <aside aria-label="AI 助手侧栏" className="aigc-sidecar">
        <div className="aigc-sidecar-header">
          <div className="min-w-0">
            <div className="brand-title">AI 助手</div>
            <div className="brand-subtitle">本地路由与提示协作</div>
          </div>
          <Button onClick={onClose}>关闭</Button>
        </div>

        <div className="aigc-sidecar-body">
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
                            打开
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
            <Tag>本地</Tag>
            <span>已索引 {routeCandidates.length} 条路由</span>
          </div>

          <div className="aigc-sidecar-sender" ref={senderRef}>
            <Sender
              onChange={(value) => setDraft(value)}
              onSubmit={submitPrompt}
              placeholder="描述一个页面、路由或前端任务"
              value={draft}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
