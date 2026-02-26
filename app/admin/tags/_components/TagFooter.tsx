import { Activity, ShieldCheck } from "lucide-react";
import { ENV } from "@/config/env.config";

export default function TagFooter() {
  return (
    <footer className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-neutral-950 px-6">
      <div className="flex items-center gap-4 text-[10px] font-black text-neutral-800 tracking-[0.5em]">
        <Activity size={16} strokeWidth={3} />
        <span className="select-none">{ENV.PROJECT_NAME} GLOBAL ARCHIVE</span>
      </div>

      <div className="flex items-center gap-8 text-[10px] font-black text-neutral-700 tracking-widest">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} className="text-neutral-900" />
          <span className="text-neutral-800">Authorization Verified</span>
        </div>

        <div className="h-5 w-0.5 bg-neutral-900 hidden md:block" />

        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-emerald-600 font-black tracking-[0.2em]">
            SYSTEM OPERATIONAL
          </span>
        </div>

        <div className="pl-4 text-neutral-900 border-l border-neutral-900 hidden lg:block font-bold">
          R.0{ENV.APP_VERSION}
        </div>
      </div>
    </footer>
  );
}
