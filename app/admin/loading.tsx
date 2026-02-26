"use client";

import { ENV } from "@/config/env.config";
import { Loader2, Shield } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 animate-in fade-in duration-1000">
      <div className="relative group">
        <div className="absolute -inset-4 border-2 border-neutral-900 rounded-[2rem] opacity-50" />

        <div className="relative h-24 w-24 bg-neutral-950 border-4 border-neutral-900 rounded-[2.5rem] flex items-center justify-center text-white">
          <Loader2
            size={40}
            strokeWidth={2.5}
            className="animate-spin duration-[1500ms]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2 bg-neutral-950 border-2 border-neutral-900 rounded-2xl">
            <Shield size={14} className="text-neutral-800" />
            <span className="text-[10px] font-black text-neutral-500 tracking-[0.4em] animate-pulse">
              Synchronizing Archive
            </span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tighter opacity-20 select-none">
            {ENV.PROJECT_NAME}
          </h2>
        </div>

        <div className="w-32 h-1 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
          <div className="h-full bg-white w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" />
        </div>

        <p className="text-[9px] font-black text-neutral-800 tracking-[0.5em]">
          Version {ENV.APP_VERSION}
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
            width: 10%;
          }
          50% {
            width: 40%;
          }
          100% {
            transform: translateX(250%);
            width: 10%;
          }
        }
      `}</style>
    </div>
  );
}
