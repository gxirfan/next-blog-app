import { Terminal } from "lucide-react";

import { ENV } from "@/config/env.config";

export default function UserFooter() {
  return (
    <footer className="pt-6 flex justify-between items-center text-[10px] font-mono text-neutral-700 tracking-[0.4em] px-2">
      <p>
        {ENV.PROJECT_NAME}_Identity_Audit_v{ENV.APP_VERSION}
      </p>
      <div className="flex items-center gap-2">
        <Terminal size={10} />
        <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse" />
        <span>Root_Session_Encrypted</span>
      </div>
    </footer>
  );
}
