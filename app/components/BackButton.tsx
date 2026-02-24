"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/stream") {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="group flex items-center gap-6 px-10 py-5 rounded-full bg-neutral-900/40 border-2 border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-900 transition-all duration-300 active:scale-95 cursor-pointer"
    >
      <ArrowLeft
        size={20}
        strokeWidth={3}
        className="text-cyan-500 group-hover:-translate-x-2 transition-transform duration-300"
      />

      <span className="text-[13px] font-black uppercase tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
        Go Back
      </span>
    </button>
  );
};

export default BackButton;
