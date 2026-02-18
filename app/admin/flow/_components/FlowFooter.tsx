import { ENV } from "@/config/env.config";

export default function FlowFooter() {
  return (
    <footer className="pt-6 flex justify-between items-center text-[9px] font-mono text-neutral-700 uppercase tracking-[0.4em]">
      <p>{ENV.PROJECT_NAME}_Stream_Engine v1.0.4</p>
      <p>Status: Monitoring_Active</p>
    </footer>
  );
}
