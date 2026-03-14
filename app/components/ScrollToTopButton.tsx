"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const SCROLL_THRESHOLD = 300;

  const BASE_CLASS =
    "fixed bottom-22 right-6 z-40 p-3 rounded-xl cursor-pointer transition-all duration-300 border-2";

  const THEME_CLASS =
    "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-cyan-500 hover:border-cyan-500/50";

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
