import { Activity, ShieldCheck } from "lucide-react";
import { ENV } from "@/config/env.config";

export default function TopicFooter() {
  return (
    <footer className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t-2 border-neutral-950 px-4">
      <div className="flex items-center gap-3 text-[10px] font-black text-neutral-800 tracking-[0.4em]">
        <Activity size={14} />
        <span>
          {ENV.PROJECT_NAME} Archive v{ENV.APP_VERSION}
        </span>
      </div>

      <div className="flex items-center gap-6 text-[10px] font-black text-neutral-700 tracking-widest">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-neutral-800" />
          <span>Security Validated</span>
        </div>

        <div className="h-4 w-0.5 bg-neutral-900" />

        <div className="flex items-center gap-2 text-emerald-500">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Archive Active</span>
        </div>
      </div>
    </footer>
  );
}
