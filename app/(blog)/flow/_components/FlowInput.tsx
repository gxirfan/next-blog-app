"use client";

import { useState } from "react";
import { Send, Loader2, X, CornerDownRight } from "lucide-react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { IFlow } from "@/app/types/flow";
import { useAuth } from "@/app/context/AuthContext";

interface FlowInputProps {
  replyingTo: IFlow | null;
  onCancelReply: () => void;
}

export default function FlowInput({
  replyingTo,
  onCancelReply,
}: FlowInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const charLimit = 500;
  const isNearLimit = content.length > charLimit - 50;

  // 🎯 Orijinal Gönderme Fonksiyonu (Eksiksiz)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!content.trim()) return;
    setLoading(true);

    try {
      await api.post("/flow", {
        content: content.trim(),
        parentId: replyingTo ? replyingTo.id : undefined,
      });

      setContent("");
      onCancelReply();
      router.refresh();
    } catch (error) {
      console.error("Failed to create flow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-950 border border-neutral-800 rounded-[2rem] overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500/20 focus-within:border-cyan-500/40"
      >
        {/* 1. Reply Context Bar */}
        {replyingTo && (
          <div className="px-4 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between bg-neutral-900/40 backdrop-blur-md py-2 px-4 rounded-2xl border border-neutral-500/50">
              <div className="flex items-center gap-2 overflow-hidden">
                <CornerDownRight size={14} className="text-cyan-500 shrink-0" />
                <p className="text-xs text-neutral-400 truncate">
                  <span className="font-bold text-neutral-200">
                    @{replyingTo.author?.username || "user"}
                  </span>
                  <span className="mx-1 opacity-30">·</span>
                  <span>
                    &quot;{replyingTo.content.substring(0, 60)}...&quot;
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onCancelReply}
                className="p-1 hover:bg-neutral-800 rounded-full text-neutral-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* 2. Stable Text Area */}
        <div className="p-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              replyingTo ? "Write your reply..." : "What's in your flow?"
            }
            className="w-full bg-transparent text-white text-lg md:text-xl placeholder-neutral-700 outline-none resize-none h-[120px] leading-normal border-none focus:ring-0 p-0"
            maxLength={charLimit}
          />
        </div>

        {/* 3. Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-900/50 bg-neutral-900/10">
          <div className="flex flex-col w-24">
            <div className="flex justify-between items-center mb-1.5">
              <span
                className={`text-[9px] tracking-widest uppercase ${
                  isNearLimit ? "text-red-500" : "text-neutral-600"
                }`}
              >
                {content.length}
              </span>
              <span className="text-[9px] text-neutral-800 uppercase tracking-widest">
                {charLimit}
              </span>
            </div>
            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out ${
                  isNearLimit ? "bg-red-500" : "bg-cyan-500"
                }`}
                style={{ width: `${(content.length / charLimit) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`
              relative flex items-center gap-3 px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-200
              ${
                content.trim() && !loading
                  ? "bg-white text-black hover:bg-neutral-100 active:scale-95 cursor-pointer"
                  : "bg-neutral-900 text-neutral-700 border border-neutral-800 opacity-50 cursor-default"
              }
            `}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Post Flow</span>
                <Send size={14} className="opacity-40" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
