"use client";

import Link from "next/link";
import {
  FolderOpen,
  Crown,
  Users,
  ArrowRight,
  Tag,
  Settings,
  Zap,
  Mail,
  Activity,
} from "lucide-react";
import { ENV } from "@/config/env.config";

export default function AdminPage() {
  const modules = [
    {
      href: `/admin/${ENV.SOCIAL_POST_TYPE}`,
      label: "Threads",
      description: "Monitor content propagation and community interactions.",
      icon: Zap,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      description: "Management of internal inquiries and user communications.",
      icon: Mail,
    },
    {
      href: "/admin/users",
      label: "Users",
      description: "Security permissions, roles, and account management.",
      icon: Users,
    },
    {
      href: "/admin/topics",
      label: "Topics",
      description: "Structural organization of forum categories and hierarchy.",
      icon: FolderOpen,
    },
    {
      href: "/admin/tags",
      label: "Tags",
      description: "Data indexing logic and content hashtag management.",
      icon: Tag,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000 px-6 py-10">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-neutral-950 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-neutral-600 font-black text-[10px] tracking-[0.4em]">
            <Settings size={14} className="text-neutral-800" />
            Administrative Control
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Control <span className="text-neutral-800">Hub</span>
          </h1>
          <p className="text-sm font-bold text-neutral-500 max-w-sm tracking-wide">
            Central management terminal for {ENV.PROJECT_NAME} core archive
            modules.
          </p>
        </div>

        {/* System Status Badge */}
        <div className="bg-neutral-950 border-2 border-neutral-900 flex items-center gap-6 px-8 py-5 rounded-[2rem]">
          <div className="text-right space-y-1">
            <p className="text-[10px] text-neutral-700 font-black tracking-widest">
              System Status
            </p>
            <p className="text-xs font-black text-emerald-500 flex items-center justify-end gap-2 tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational
            </p>
          </div>
          <div className="h-10 w-0.5 bg-neutral-900" />
          <Crown className="text-white opacity-20" size={32} />
        </div>
      </header>

      {/* 2. MODULES ARCHIVE */}
      <div className="border-2 border-neutral-900 rounded-[3rem] overflow-hidden bg-neutral-950">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-neutral-950 text-neutral-700 text-[10px] tracking-[0.3em] font-black">
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[40%]">
                Modules
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 w-[40%]">
                Description
              </th>
              <th className="px-10 py-7 border-b-2 border-neutral-900 text-right w-[20%]">
                Access
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-900">
            {modules.map((module) => (
              <tr
                key={module.href}
                className="group hover:bg-neutral-900/30 transition-all duration-300"
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-white group-hover:border-white transition-all duration-500">
                      <module.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-black text-white tracking-tighter group-hover:pl-2 transition-all duration-300">
                      {module.label}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className="text-sm text-neutral-500 font-bold leading-relaxed group-hover:text-neutral-300 transition-colors">
                    {module.description}
                  </p>
                </td>
                <td className="px-10 py-8 text-right">
                  <Link
                    href={module.href}
                    className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-neutral-900 border-2 border-neutral-800 text-neutral-600 hover:text-white hover:border-white transition-all active:scale-90"
                  >
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. SYSTEM FOOTER */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        <div className="flex items-center gap-3 text-[10px] font-black text-neutral-800 tracking-[0.4em]">
          <Activity size={14} />
          {ENV.PROJECT_NAME}_Terminal_v{ENV.APP_VERSION}
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black text-neutral-700 tracking-widest">
          <span>Auth: Administrator</span>
          <div className="h-4 w-0.5 bg-neutral-900" />
          <p className="font-mono">
            {new Date().toLocaleTimeString("en-US", { hour12: false })}
          </p>
        </div>
      </footer>
    </div>
  );
}
