import {
  Layers,
  Server,
  Code,
  Cpu,
  Terminal,
  Database,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in duration-700">
      {/* 1. Page Header */}
      <div className="space-y-4 border-b border-neutral-900 pb-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-500">
          <Terminal size={14} />
          <span>System Specifications</span>
        </div>
        <h1 className="text-4xl md:text-6xl text-white tracking-tighter flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <Layers size={32} />
          </div>
          About Project
        </h1>
      </div>

      {/* 2. Main Architecture Card */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-[2.5rem] p-8 md:p-12 space-y-10">
        <div className="space-y-6">
          <h2 className="text-2xl text-white flex items-center gap-3 uppercase tracking-tight">
            <Cpu size={24} className="text-cyan-500" />
            <span>Architecture Overview</span>
          </h2>

          <div className="space-y-6">
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-medium">
              This application is designed to combine the most powerful tools of
              modern web development with a{" "}
              <span className="text-white">minimal and dark aesthetic</span>.
              The project's architecture prioritizes high performance and
              security.
            </p>
            <p className="text-neutral-500 text-base leading-relaxed border-l-2 border-neutral-800 pl-6">
              The author of this project wrote it solely for self-improvement!
            </p>
          </div>
        </div>

        {/* 3. Tech Stack Grid */}
        <div className="space-y-6 pt-10 border-t border-neutral-900">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 flex items-center gap-2">
            <Server size={14} />
            Core Technology Stack
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TechItem
              label="Backend"
              value="NestJS (TypeScript)"
              icon={<Terminal size={16} />}
            />
            <TechItem
              label="Database"
              value="MongoDB (NoSQL)"
              icon={<Database size={16} />}
            />
            <TechItem
              label="Frontend"
              value="Next.js 14 (App Router)"
              icon={<Globe size={16} />}
            />
            <TechItem
              label="Style"
              value="Tailwind CSS (Flat UI)"
              icon={<Code size={16} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Tech Item Component
const TechItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-neutral-900/30 border border-neutral-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-cyan-500/30 transition-all">
    <div className="text-neutral-700 group-hover:text-cyan-500 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-widest text-neutral-600 mb-0.5">
        {label}
      </span>
      <span className="text-sm font-bold text-neutral-300">{value}</span>
    </div>
  </div>
);
