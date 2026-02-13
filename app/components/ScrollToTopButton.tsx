"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const SCROLL_THRESHOLD = 300;

  const BASE_CLASS =
    "fixed bottom-6 right-6 z-40 p-3 rounded-full cursor-pointer transition-all duration-300";
  const ACCENT_CLASS =
    "bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-800";

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${BASE_CLASS} ${ACCENT_CLASS} ${
        isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
