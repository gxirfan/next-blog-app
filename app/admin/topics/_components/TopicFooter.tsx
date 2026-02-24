import { ENV } from "@/config/env.config";

export default function TopicFooter() {
  return (
    <footer className="flex justify-between items-center text-[9px] font-mono text-neutral-700 tracking-[0.3em] px-2">
      <p>
        {ENV.PROJECT_NAME}_Core v{ENV.APP_VERSION}
      </p>
      <p>Status: Active_Kernel</p>
    </footer>
  );
}
