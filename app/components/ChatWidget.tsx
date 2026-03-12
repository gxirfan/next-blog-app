"use client";

import { ENV } from "@/config/env.config";
import { Send, Bot, Loader2, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/app/context/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch(`${ENV.API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Connection failed.");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          const cleanedChunk = chunkValue
            .replace(/^\d+:"/g, "")
            .replace(/"$/g, "")
            .replace(/\\n/g, "\n");

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + cleanedChunk }
                : msg,
            ),
          );
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[400px] h-[600px] bg-neutral-950 border-2 border-neutral-800 rounded-4xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <header className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-200">
                {ENV.PROJECT_NAME}&apos;s Gemini.
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          {/* Messages */}
          <main
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                <Bot size={32} strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
                  New Session
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${m.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`block text-[9px] tracking-widest font-black mb-1.5 ${m.role === "user" ? "text-cyan-500" : "text-neutral-600"}`}
                  >
                    {m.role === "user"
                      ? user?.nickname || "Guest"
                      : ENV.AI_NAME}
                  </span>
                  <div
                    className={`text-[13px] leading-relaxed p-4 rounded-2xl border ${
                      m.role === "user"
                        ? "bg-neutral-900 border-neutral-800 text-white"
                        : "bg-transparent border-transparent text-neutral-300"
                    }`}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-500/80">
                <Loader2 size={12} className="animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Processing
                </span>
              </div>
            )}
          </main>

          {/* Input Area */}
          <footer className="p-6 bg-neutral-900/30 border-t border-neutral-800">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-4 py-2 focus-within:border-cyan-500/50 transition-all"
            >
              <input
                className="flex-1 bg-transparent border-none text-[13px] outline-none placeholder-neutral-700 text-white py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 text-cyan-500 disabled:opacity-0 transition-opacity"
              >
                <Send size={18} />
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-neutral-800 text-white rotate-90"
            : "bg-cyan-500 text-neutral-950 hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageSquare size={24} fill="currentColor" />
        )}
      </button>
    </div>
  );
}
