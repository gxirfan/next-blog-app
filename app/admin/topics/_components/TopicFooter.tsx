import { ENV } from "@/config/env.config";

export default function TopicFooter() {
  return (
    <footer className="flex justify-between items-center text-[9px] font-mono text-neutral-700 uppercase tracking-[0.3em] px-2">
      <p>{ENV.PROJECT_NAME}_Core v1.0.4</p>
      <p>Status: Active_Kernel</p>
    </footer>
  );
}
