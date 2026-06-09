/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Bot, User, Trash2, HelpCircle } from 'lucide-react';
import { ChatMessage, Task } from '../types';

interface ChatAssistantProps {
  token: string | null;
  tasks: Task[];
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatAssistant({ token, tasks, messages, setMessages }: ChatAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What should I focus on first today?",
    "Summarize my high priority tasks.",
    "Recommend subtasks for my pending items.",
    "Do I have any tasks slipping behind schedules?"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const chatHistory = messages.map(m => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: chatHistory
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cognitive pipeline failure.');
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Cognitive network lost. Please verify keys.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden h-[calc(100vh-10rem)] shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-55/10 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 tracking-tight">AI Project Assistant</h3>
            <p className="text-[10px] text-slate-500 font-medium.">Direct live context reasoning with your board</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-rose-600 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Panel */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto my-12">
            <Bot className="w-12 h-12 text-indigo-550 border border-indigo-100 p-2 rounded-2xl bg-indigo-50/50 mb-4 text-indigo-600" />
            <h4 className="font-display font-bold text-sm text-slate-900 tracking-tight">Cognitive Assistant ready</h4>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Ask about task schedules, priority alignments, bottleneck distributions, or request Gemini to formulate speed-up recommendations.
            </p>

            {/* Quick chips templates */}
            <div className="w-full mt-6 space-y-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="w-full text-left bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 p-2.5 rounded-xl text-xs text-slate-700 font-semibold transition-all shadow-2xs"
                >
                  💡 {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 border flex items-center justify-center ${
                  m.sender === 'user' 
                    ? 'bg-indigo-600 border-indigo-550 text-white' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-3xs border ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white border-indigo-650 rounded-tr-xs'
                      : 'bg-white text-slate-855 border-slate-200/60 rounded-tl-xs text-slate-800'
                  }`}>
                    {/* Render message with line breaks or simple text */}
                    <div className="whitespace-pre-line font-medium">
                      {m.content}
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono text-slate-400 block ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="w-8 h-8 rounded-xl border bg-white border-slate-250 flex items-center justify-center text-slate-600">
                  <Bot className="w-4 h-4 animate-spin text-indigo-600" />
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl rounded-tl-xs shadow-3xs flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs text-center max-w-sm mx-auto">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input panel */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            id="chat-assistant-input"
            type="text"
            disabled={loading}
            placeholder="Discuss task distributions, re-prioritize items, etc..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
          />
          <button
            id="chat-assistant-send-btn"
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs p-3 rounded-xl shadow-md hover:shadow-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
