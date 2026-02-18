"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/flow") {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="group flex items-center gap-4 px-6 py-3.5 rounded-3xl bg-neutral-900 border-2 border-neutral-800 hover:border-cyan-500 hover:bg-neutral-950 transition-all duration-300 active:scale-95 cursor-pointer"
    >
      <ArrowLeft
        size={18}
        strokeWidth={2.5}
        className="text-cyan-500 group-hover:-translate-x-1.5 transition-transform duration-300"
      />

      <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-200 group-hover:text-cyan-400 transition-colors">
        Return
      </span>
    </button>
  );
};

export default BackButton;
