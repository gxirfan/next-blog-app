"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const SCROLL_THRESHOLD = 400;

  const BASE_CLASS =
    "fixed bottom-24 right-8 z-40 p-2.5 rounded-xl cursor-pointer transition-all duration-300 shadow-2xl";

  const THEME_CLASS =
    "bg-neutral-950 border-2 border-neutral-800 text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-500";

  const handleScroll = () => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${BASE_CLASS} ${THEME_CLASS} ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-75 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} strokeWidth={3} />
    </button>
  );
};

export default ScrollToTopButton;
