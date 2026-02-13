import { Command } from "lucide-react";

export default function TagFooter() {
  return (
    <footer className="pt-6 flex justify-between items-center text-[10px] font-mono text-neutral-700 uppercase tracking-[0.4em] px-2">
      <p>
        {process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog"}_Data_Terminal v1.0.4
      </p>
      <div className="flex items-center gap-2">
        <Command size={10} />
        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
        <span>Secure Admin Session</span>
      </div>
    </footer>
  );
}
