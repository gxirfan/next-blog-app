"use client";
import { ENV } from "@/config/env.config";
import { Code2, Server, User, ArrowRight, Layers, Github } from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const GITHUB_NEST = "https://github.com/gxirfan/nest-blog-app";
  const GITHUB_NEXT = "https://github.com/gxirfan/next-blog-app";

  return (
    <div className="mx-auto py-16 space-y-20 animate-in fade-in duration-1000">
      {/* 1. INTRO SECTION */}
      <section className="space-y-8 border-b border-neutral-900 pb-16 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 text-[11px] font-black tracking-[0.4em] text-neutral-500">
          <User size={14} className="text-neutral-700" />
          <span>Origin Story</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl text-white tracking-tighter font-black leading-none">
            Hi! I&apos;m <span className="text-neutral-500">Irfan.</span>
          </h1>
          <p className="text-xl md:text-3xl text-neutral-400 leading-relaxed font-bold tracking-tight">
            {ENV.PROJECT_NAME} is one of the countless projects I&apos;ve
            written to improve myself. It represents a journey of constant
            learning and architectural exploration.
          </p>
        </div>
      </section>

      <section className="space-y-12 border-b border-neutral-900 pb-16 text-center md:text-left">
        <div className="text-lg md:text-xl text-neutral-400 leading-relaxed tracking-tight">
          <h3>👋 Welcome to {ENV.PROJECT_NAME}</h3>
          <span>
            {ENV.PROJECT_NAME} is a digital hub for tech enthusiasts,
            deep-divers into gaming culture, and developers who live between
            lines of code. Named after the iconic {ENV.PROJECT_NAME.slice(0, 4)}{" "}
            command, we are all about filtering through the noise of the digital
            world to find the &quot;Signal&quot;—the information that actually
            matters.
          </span>
        </div>
        <div className="text-lg md:text-xl text-neutral-400 leading-relaxed tracking-tight flex flex-col gap-4">
          <h3>🌟 Not Just a Blog, An Experience</h3>
          <span>
            We believe that content should be the star. {ENV.PROJECT_NAME} is
            designed with a high-contrast, minimalist, and modern aesthetic to
            ensure your focus stays exactly where it belongs: on the insights.
          </span>
          <span>
            In-Depth Content: From the latest shifts in the gaming industry to
            deep technical analyses and guides for the developer community.
          </span>
          <span>
            The Stream: We go beyond static posts. Our Stream page is a
            real-time community hub where you can chat, exchange knowledge, and
            feel the pulse of the industry. Think of it as our digital lounge
            for meaningful tech talk.
          </span>
        </div>
        <div className="text-lg md:text-xl text-neutral-400 leading-relaxed tracking-tight flex flex-col gap-4">
          {" "}
          <h3>🔓 Proudly Open Source: Building in Public</h3>
          <span>
            {" "}
            Transparency is at our core. {ENV.PROJECT_NAME} is an open-source
            project. If you’re curious about the architecture, want to
            contribute, or just want to see how things work under the hood, the
            gates are always open.
          </span>
          <span>
            We are committed to sharing our journey. As we grow, we’ll be
            publishing Dev-logs—detailed blog posts covering every development
            stage, the challenges we face, and the solutions we build. It’s not
            just a platform; it’s a living case study and a shared learning
            experience.
          </span>
        </div>
        <div className="text-lg md:text-xl text-neutral-400 leading-relaxed tracking-tight flex flex-col gap-4">
          <h3>🚀 Join the Mission</h3>
          <span>
            We are building a community that doesn&apos;t just consume
            technology but discusses, develops, and evolves with it. Join the
            journey, share your wisdom, or just drop a &apos;hello&apos; on the
            Stream.
          </span>
          <span className="font-bold">
            {ENV.PROJECT_NAME}: Filter the noise, ground the signal.
          </span>
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
