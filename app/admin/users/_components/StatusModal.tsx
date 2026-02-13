"use client";

import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={type !== "loading" ? onClose : undefined}
      />

      <div className="relative bg-[#0d0d0d] border border-neutral-800 w-full max-w-sm rounded-[2rem] p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          {type === "success" && (
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
          )}
          {type === "error" && (
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
              <AlertCircle size={32} />
            </div>
          )}
          {type === "loading" && (
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-500">
              <Loader2 size={32} className="animate-spin" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed font-medium">
          {message}
        </p>

        {type !== "loading" && (
          <button
            onClick={onClose}
            className="w-full py-3 bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
