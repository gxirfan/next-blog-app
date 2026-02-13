"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft } from "lucide-react";

const BackButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Ana akış sayfalarında butonu gizle
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
      {/* İkon: Border-2 ile uyumlu olması için kalınlığı artırıldı */}
      <ArrowLeft
        size={18}
        strokeWidth={2.5}
        className="text-cyan-500 group-hover:-translate-x-1.5 transition-transform duration-300"
      />

      {/* Yazı: Daha kalın ve yüksek kontrastlı (Neutral-200) */}
      <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-200 group-hover:text-cyan-400 transition-colors">
        Return
      </span>
    </button>
  );
};

export default BackButton;
