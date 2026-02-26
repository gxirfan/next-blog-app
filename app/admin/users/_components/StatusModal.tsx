"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  type: "success" | "error" | "loading";
  title: string;
  message: string;
  onClose: () => void;
}

export default function StatusModal({
  isOpen,
  type,
  title,
  message,
  onClose,
}: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={type !== "loading" ? onClose : undefined}
      />

      <div className="relative border-2 border-neutral-900 w-full max-w-md bg-neutral-950 rounded-[3rem] p-12 text-center animate-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          {type === "success" && (
            <div className="p-5 bg-emerald-500/10 rounded-3xl border-2 border-emerald-500/20 text-emerald-500">
              <CheckCircle2 size={40} />
            </div>
          )}
          {type === "error" && (
            <div className="p-5 bg-red-500/10 rounded-3xl border-2 border-red-500/20 text-red-500">
              <AlertCircle size={40} />
            </div>
          )}
          {type === "loading" && (
            <div className="p-5 bg-neutral-900 rounded-3xl border-2 border-neutral-800 text-white">
              <Loader2 size={40} className="animate-spin duration-[1500ms]" />
            </div>
          )}
        </div>

        <div className="space-y-3 mb-10">
          <h3 className="text-2xl font-black text-white tracking-tighter leading-none">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 font-bold leading-relaxed tracking-wide">
            {message}
          </p>
        </div>

        {type !== "loading" && (
          <button
            onClick={onClose}
            className="w-full py-5 bg-white text-black rounded-full text-[11px] font-black tracking-[0.3em] hover:bg-neutral-200 transition-all active:scale-95"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
