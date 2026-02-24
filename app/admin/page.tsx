import Link from "next/link";
import {
  FolderOpen,
  Crown,
  Users,
  ArrowRight,
  Tag,
  Command,
  Zap,
  Mail,
} from "lucide-react";
import { ENV } from "@/config/env.config";

export default function AdminPage() {
  const BORDER_STYLE = "border border-neutral-800/60";

  const modules = [
    {
      href: `/admin/${ENV.SOCIAL_POST_TYPE}`,
      label: ENV.SOCIAL_POST_TYPE,
      description: "Monitor real-time data streams and content propagation.",
      icon: Zap,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      description: "View and manage user messages.",
      icon: Mail,
    },
    {
      href: "/admin/users",
      label: "User Management",
      description: "Manage system accounts, roles, and security permissions.",
      icon: Users,
    },
    {
      href: "/admin/topics",
      label: "Topics",
      description: "Organize forum categories, structure, and hierarchy.",
      icon: FolderOpen,
    },
    {
      href: "/admin/tags",
      label: "Tags",
      description: "Control content hashtags and data indexing logic.",
      icon: Tag,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/50 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-[0.3em] uppercase">
            <Command size={14} />
            Kernel Root Access
          </div>
          <h1 className="text-4xl font-semibold text-white tracking-tight leading-none">
            Control{" "}
            <span className="text-neutral-500 font-light text-3xl">Hub</span>
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mt-2">
            Centralized administrative terminal for {ENV.PROJECT_NAME} core
            modules.
          </p>
        </div>

        <div
          className={`${BORDER_STYLE} flex items-center gap-4 px-6 py-4 rounded-3xl transition-all hover:border-cyan-500/30`}
        >
          <div className="text-right">
            <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">
              System Status
            </p>
            <p className="text-sm font-medium text-emerald-500 flex items-center justify-end gap-2 uppercase tracking-tighter">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Operational
            </p>
          </div>
          <div className="h-10 w-[1px] bg-neutral-800" />
          <Crown className="text-cyan-500 opacity-50" size={28} />
        </div>
      </header>

      <div className={`${BORDER_STYLE} rounded-[2.5rem] overflow-hidden`}>
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-900/40 text-neutral-600 text-[11px] uppercase tracking-[0.2em] font-black">
              <th className="px-10 py-6 border-b border-neutral-800/50">
                Core Module
              </th>
              <th className="px-10 py-6 border-b border-neutral-800/50">
                Description / Scope
              </th>
              <th className="px-10 py-6 border-b border-neutral-800/50 text-right">
                Access
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40">
            {modules.map((module) => (
              <tr
                key={module.href}
                className="group hover:bg-white/[0.015] transition-all duration-300"
              >
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-5">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition-all duration-500`}
                    >
                      <module.icon size={20} />
                    </div>
                    <span className="text-[15px] font-bold text-neutral-200 uppercase tracking-tight group-hover:text-white transition-colors">
                      {module.label}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className="text-sm text-neutral-500 max-w-sm leading-relaxed font-medium group-hover:text-neutral-400 transition-colors">
                    {module.description}
                  </p>
                </td>
                <td className="px-10 py-8 text-right">
                  <Link
                    href={module.href}
                    className={`inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all active:scale-90`}
                  >
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Footer */}
      <footer className="flex justify-between items-center text-[10px] font-mono text-neutral-700 tracking-[0.4em] px-4">
        <p>
          {ENV.PROJECT_NAME}_Terminal_v{ENV.APP_VERSION}
        </p>
        <div className="flex items-center gap-4">
          <p>Auth: Admin_Privileges</p>
          <div className="h-3 w-px bg-neutral-800" />
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </footer>
    </div>
  );
}
