import { ENV } from "@/config/env.config";

export default function FlowFooter() {
  return (
    <footer className="pt-6 flex justify-between items-center text-[9px] font-mono text-neutral-700 tracking-[0.4em]">
      <p>
        {ENV.PROJECT_NAME} Stream Engine v{ENV.APP_VERSION}
      </p>
      <p>Status: Monitoring Active</p>
    </footer>
  );
}
