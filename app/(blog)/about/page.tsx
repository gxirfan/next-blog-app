"use client";
import { Code2, Server, User, ArrowRight, Layers, Github } from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const GITHUB_NEST = "https://github.com/gxirfan/nest-blog-app";
  const GITHUB_NEXT = "https://github.com/gxirfan/next-blog-app";

  return (
    <div className="max-w-4xl mx-auto py-16 space-y-20 animate-in fade-in duration-1000 px-6">
      {/* 1. INTRO SECTION */}
      <section className="space-y-8 border-b border-neutral-900 pb-16 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 text-[11px] font-black tracking-[0.4em] text-neutral-500">
          <User size={14} className="text-neutral-700" />
          <span>Origin Story</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl text-white tracking-tighter font-black leading-none">
            Hi! I'm <span className="text-neutral-500">Irfan.</span>
          </h1>
          <p className="text-xl md:text-3xl text-neutral-400 leading-relaxed font-bold tracking-tight max-w-2xl">
            Grepground is one of the countless projects I've written to improve
            myself. It represents a journey of constant learning and
            architectural exploration.
          </p>
        </div>
      </section>

      {/* 2. ARCHITECTURE / GITHUB SECTION */}
      <section className="space-y-12">
        <div className="flex items-center gap-3 text-[11px] font-black tracking-[0.4em] text-neutral-500">
          <Layers size={14} className="text-neutral-700" />
          <span>The Stack & Source</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NestJS Backend Card */}
          <Link
            href={GITHUB_NEST}
            target="_blank"
            className="group relative bg-neutral-950 border-2 border-neutral-900 p-8 rounded-[2.5rem] hover:border-white transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-neutral-900 rounded-2xl text-white group-hover:scale-110 transition-transform">
                <Server size={32} />
              </div>
              <Github
                size={20}
                className="text-neutral-800 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-white font-black mb-2">
              Backend Architecture
            </h3>
            <p className="text-neutral-500 text-sm font-bold mb-6">
              Built with NestJS, focused on scalable micro-services and clean
              API logic.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-neutral-400">
              View Repository <ArrowRight size={12} />
            </div>
          </Link>

          {/* Next.js Frontend Card */}
          <Link
            href={GITHUB_NEXT}
            target="_blank"
            className="group relative bg-neutral-950 border-2 border-neutral-900 p-8 rounded-[2.5rem] hover:border-white transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-neutral-900 rounded-2xl text-white group-hover:scale-110 transition-transform">
                <Code2 size={32} />
              </div>
              <Github
                size={20}
                className="text-neutral-800 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-white font-black mb-2">
              Frontend Interface
            </h3>
            <p className="text-neutral-500 text-sm font-bold mb-6">
              A high-performance UI crafted with Next.js, Tailwind, and a focus
              on matte aesthetics.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-neutral-400">
              View Repository <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. CORE VALUES FOOTER */}
      <footer className="pt-10 border-t-2 border-neutral-950 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black tracking-[0.5em] text-neutral-800">
          Open Source Development
        </p>
        <div className="text-[11px] font-black text-neutral-600 tracking-widest">
          Continuous Improvement © 2026
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
