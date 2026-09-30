import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  User,
  ChevronRight,
  ShieldCheck,
  Clock,
  Layers,
  HelpCircle,
  CornerDownLeft,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { AssistantResponse, AssistantSource } from '../types';
import Button from '../components/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: AssistantSource[];
  suggestedFollowUps?: string[];
  executionTimeMs?: number;
}

const SAMPLE_PROMPTS = [
  'Summarize all invoices requiring human review and explain why.',
  'What is the total invoice amount for Apex Global Technologies?',
  'Are there any purchase order mismatches detected?',
  'Did we detect any duplicate invoice numbers in the system?'
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your Clarion OmniAI Document Assistant. Every answer I provide is strictly grounded in your processed documents, verified extractions, and deterministic audit trails. How can I assist your review workflow today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: SAMPLE_PROMPTS
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.queryAssistant(textToSend);
      if (res?.answer) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: res.sources,
          suggestedFollowUps: res.suggestedFollowUps,
          executionTimeMs: res.executionTimeMs
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an error querying the grounded knowledge base. Please check backend connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Assistant Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Source-Grounded AI Assistant</h2>
              <span className="flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Zero Hallucination Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct citations to page numbers, field provenance, and validation logs
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-3">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 flex items-center gap-2 ${
                    msg.sender === 'user' ? 'text-indigo-200 justify-end' : 'text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.executionTimeMs && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {msg.executionTimeMs}ms
                    </span>
                  )}
                </div>
              </div>

              {/* Source Evidence Cards */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Verified Source Documents ({msg.sources.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.sources.map((src: AssistantSource, idx: number) => (
                      <Link
                        key={idx}
                        to={`/documents/${src.documentId}`}
                        className="p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-lg transition-all text-xs flex flex-col justify-between group"
                      >
                        <div className="flex items-center justify-between text-indigo-300 font-medium">
                          <span className="truncate max-w-[180px]">{src.documentTitle}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                          "{src.relevantSnippet}"
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                          <span>{src.documentType}</span>
                          <span>Page {src.page || 1}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-xs bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 px-3 py-1.5 rounded-lg text-left transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-sm text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Retrieving document chunks & cross-verifying deterministic records...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask a question grounded in processed documents, POs, or supplier spend..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-24 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="rounded-lg h-9 px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Clarion OmniAI answers are strictly derived from verified database records.</span>
          <span className="hidden sm:inline">Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}
