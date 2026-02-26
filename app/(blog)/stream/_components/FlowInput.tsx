"use client";

import { useState } from "react";
import { Send, Loader2, X, CornerDownRight, CheckCircle2 } from "lucide-react";
import api from "@/api/axios";
import { useRouter, usePathname } from "next/navigation";
import { IFlow } from "@/app/types/flow";
import { useAuth } from "@/app/context/AuthContext";
import { useSWRConfig } from "swr";
import { ENV } from "@/config/env.config";

interface FlowInputProps {
  replyingTo: IFlow | null;
  onCancelReply: () => void;
}

export default function FlowInput({
  replyingTo,
  onCancelReply,
}: FlowInputProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  const charLimit = 500;
  const isNearLimit = content.length > charLimit - 50;
  const isThreadPage = pathname?.includes("/stream/thread");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || ""));
      return;
    }
    if (!content.trim() || status !== "idle") return;
    setStatus("loading");

    try {
      await api.post("/flow", {
        content: content.trim(),
        parentId: replyingTo ? replyingTo.id : undefined,
      });

      setStatus("success");
      setContent("");

      mutate(
        (key) =>
          typeof key === "string" && key.startsWith(`${ENV.API_URL}/flow`),
        undefined,
        { revalidate: true },
      );

      router.refresh();

      setTimeout(() => {
        setStatus("idle");
        onCancelReply();
      }, 2000);
    } catch (error) {
      console.error("Failed to create thread:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`bg-neutral-950 border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
          status === "success"
            ? "border-green-500/50 bg-green-500/5"
            : "border-neutral-900 focus-within:border-cyan-500/40"
        }`}
      >
        {replyingTo && !isThreadPage && status !== "success" && (
          <div className="px-6 pt-5 animate-in fade-in slide-in-from-left-2 duration-500">
            <div className="flex items-center justify-between bg-neutral-950/50 border border-neutral-900 py-2.5 px-5 rounded-full group/reply">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800">
                  <CornerDownRight
                    size={10}
                    className="text-cyan-500"
                    strokeWidth={3}
                  />
                </div>

                <p className="text-[11px] font-bold tracking-tight truncate flex items-center gap-2">
                  <span className="text-neutral-500 tracking-widest text-[9px]">
                    Replying to
                  </span>

                  <span className="text-neutral-200 font-black">
                    {replyingTo.author?.nickname}
                  </span>

                  <span className="text-neutral-800">•</span>

                  <span className="text-neutral-500 font-medium truncate max-w-[150px] md:max-w-[300px]">
                    &quot;{replyingTo.content}&quot;
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={onCancelReply}
                className="p-1.5 ml-2 hover:bg-neutral-800 rounded-full text-neutral-600 hover:text-red-500 transition-all duration-300"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="p-8 min-h-[140px] flex items-start">
          {status === "success" ? (
            <div className="w-full py-10 flex flex-col items-center justify-center space-y-3 animate-in zoom-in-95 duration-500">
              <CheckCircle2 className="text-green-500" size={36} />
              <p className="text-green-500 font-black text-xs tracking-[0.2em]">
                Thread Broadcasted
              </p>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={status === "loading"}
              placeholder={
                replyingTo
                  ? "Write your response..."
                  : "What's happening in the stream?"
              }
              className="w-full bg-transparent text-white text-lg md:text-[19px] font-medium placeholder-neutral-800 outline-none resize-none h-[120px] leading-relaxed border-none focus:ring-0 p-0 disabled:opacity-50 tracking-tight"
              maxLength={charLimit}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-neutral-900/80 bg-neutral-950">
          <div className="flex items-center gap-5">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-neutral-900"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={100}
                  strokeDashoffset={100 - (content.length / charLimit) * 100}
                  className={`transition-all duration-300 ${isNearLimit ? "text-red-500" : "text-cyan-500"}`}
                />
              </svg>
              <span
                className={`absolute text-[10px] font-black ${isNearLimit ? "text-red-500" : "text-neutral-500"}`}
              >
                {charLimit - content.length}
              </span>
            </div>
            <div className="h-5 w-px bg-neutral-900 hidden sm:block" />
            <span className="text-[10px] font-black text-neutral-700 tracking-[0.2em] hidden md:block">
              Character Limit
            </span>
          </div>

          <button
            type="submit"
            disabled={status !== "idle" || !content.trim()}
            className={`
            flex items-center justify-center gap-4 px-12 py-4 rounded-full text-[11px] font-black tracking-[0.2em] transition-all duration-300 active:scale-95
            ${
              status === "success"
                ? "bg-green-600 text-white"
                : content.trim() && status === "idle"
                  ? "bg-cyan-500 text-black hover:bg-white cursor-pointer"
                  : "bg-neutral-900 text-neutral-700 border border-neutral-800 opacity-50"
            }
          `}
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : status === "success" ? (
              <span>Success</span>
            ) : (
              <>
                <span>Post Thread</span>
                <Send size={14} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
