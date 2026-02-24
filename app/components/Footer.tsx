"use client";

import React from "react";
import Link from "next/link";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Cpu, ShieldCheck, Globe, Info } from "lucide-react";
import { ENV } from "@/config/env.config";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-neutral-900 bg-neutral-950/50 pb-16 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* 1. Brand & System Status Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center">
                <Cpu size={18} className="text-cyan-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-[0.3em] text-white">
                  <span className="text-cyan-500">{ENV.PROJECT_NAME}</span>
                </span>
                <span className="text-[9px] font-mono text-neutral-600 tracking-widest">
                  Content_Node_System
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.2em]">
                &copy; {currentYear} All Rights Reserved_
              </p>
              <div className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-cyan-900 rounded-full animate-pulse" />
                  V{ENV.APP_VERSION}_{ENV.VERSION_TEST}
                </span>
                <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                <span>Production_Env</span>
              </div>
            </div>
          </div>

          {/* 2. Navigation & Legal Actions */}
          <div className="flex flex-col md:items-end gap-8 w-full md:w-auto">
            {/* Primary Nav */}
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-start md:justify-end">
              <FooterLink
                href="/about"
                label="About"
                icon={<Info size={12} />}
              />
              <FooterLink
                href="/contact"
                label="Contact"
                icon={<Globe size={12} />}
              />
              <FooterLink
                href="/privacy-policy"
                label="Privacy"
                icon={<ShieldCheck size={12} />}
              />
            </nav>

            {/* Technical Footer Actions - Fixed Centering Fix Here */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-6 pt-6 border-t border-neutral-900/50 w-full md:min-w-[400px]">
              {/* CookieSettingsButton Trigger */}
              <div className="order-last md:order-first w-full md:w-auto flex justify-center md:block">
                <CookieSettingsButton />
              </div>

              <div className="hidden md:block h-4 w-px bg-neutral-900" />

              {/* Legal Secondary */}
              <div className="flex items-center gap-6">
                <Link
                  href="/terms-of-use"
                  className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-all"
                >
                  Terms_
                </Link>
                <Link
                  href="/cookie-policy"
                  className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-all"
                >
                  Cookies_
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Global Protocol Indicator */}
        <div className="mt-16 flex justify-center border-t border-neutral-900/30 pt-8">
          <p className="text-[9px] font-mono text-neutral-800 uppercase tracking-[0.5em] text-center">
            Encrypted_Data_Transmission_Verified // Protocol_{ENV.APP_VERSION}_
            {ENV.VERSION_TEST}
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-cyan-400 transition-all group"
  >
    <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-cyan-500">
      {icon}
    </span>
    {label}
  </Link>
);

export default Footer;
