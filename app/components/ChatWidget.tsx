"use client";

import { ENV } from "@/config/env.config";
import {
  Send,
  Bot,
  Loader2,
  MessageSquare,
  X,
  UserIcon,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/app/context/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type ViewMode = "list" | "ai-chat" | "user-chat";

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = useState<ViewMode>("list");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, view]);

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

  const BUTTON_BASE =
    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 z-50 cursor-pointer";
  const THEME_CLASS =
    "bg-neutral-950 border-2 border-neutral-800 text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-500";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[380px] h-[70vh] sm:h-[550px] bg-neutral-950 border-2 border-neutral-800 rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          {/* HEADER */}
          <header className="p-4 border-b border-neutral-900 flex items-center justify-between bg-black">
            <div className="flex items-center gap-2">
              {view !== "list" && (
                <button
                  onClick={() => setView("list")}
                  className="mr-2 p-1 hover:bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div
                className={`w-1.5 h-1.5 rounded-full ${view === "ai-chat" ? "bg-cyan-500" : "bg-neutral-600"}`}
              />
              <span className="text-[10px] font-bold tracking-widest text-neutral-200">
                {view === "list"
                  ? "Messages"
                  : view === "ai-chat"
                    ? ENV.PROJECT_NAME + "'s Gemini"
                    : "Chat"}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-600 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">
            {view === "list" && user?.id ? (
              <main className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <button
                  onClick={() => setView("ai-chat")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-neutral-900 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-neutral-800 transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-900/50">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[13px] font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors">
                      {ENV.PROJECT_NAME}'s Gemini
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-medium">
                      Ask me anything...
                    </p>
                  </div>
                </button>

                <div className="pt-4 px-2">
                  <span className="text-[9px] font-black tracking-[0.2em] text-neutral-700">
                    Direct Messages
                  </span>
                </div>

                <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-neutral-900/30 transition-all opacity-50 grayscale hover:grayscale-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                    <UserIcon size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[13px] font-bold text-neutral-400">
                      User Chat
                    </h3>
                    <p className="text-[10px] text-neutral-600">
                      Coming soon...
                    </p>
                  </div>
                </button>
              </main>
            ) : (
              <>
                <main
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar"
                >
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                      <Bot size={24} strokeWidth={1.5} />
                      <p className="text-[9px] tracking-[0.2em] font-bold">
                        New Session
                      </p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} animate-in fade-in duration-300`}
                    >
                      <span
                        className={`text-[8px] tracking-tighter mb-2 font-bold px-1 ${m.role === "user" ? "text-cyan-500" : "text-neutral-600"}`}
                      >
                        {m.role === "user"
                          ? user?.nickname || "You"
                          : ENV.AI_NAME || "Gemini"}
                      </span>
                      <div
                        className={`text-[13px] leading-relaxed max-w-full prose prose-invert prose-sm wrap-break-word ${m.role === "user" ? "text-white" : "text-neutral-300 pl-1"}`}
                      >
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-cyan-500/80 py-2">
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-[9px] font-black tracking-widest">
                        Processing
                      </span>
                    </div>
                  )}
                </main>

                <footer className="p-4 bg-neutral-900/10 border-t border-neutral-900">
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 rounded-xl px-3 py-1 focus-within:border-neutral-700 transition-all"
                  >
                    <input
                      className="flex-1 bg-transparent border-none text-[13px] outline-none placeholder-neutral-700 text-white h-10"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message..."
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="text-neutral-500 hover:text-cyan-500 transition-colors disabled:opacity-0"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </footer>
              </>
            )}
          </div>
        </div>
      )}

      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${BUTTON_BASE} ${THEME_CLASS} ${isOpen ? "rotate-90 border-cyan-500/50 text-cyan-500" : ""}`}
      >
        {isOpen ? (
          <X size={20} strokeWidth={3} />
        ) : (
          <MessageSquare size={20} strokeWidth={3} />
        )}
      </button>
    </div>
  );
}
