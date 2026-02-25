"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { RefObject } from "react";

interface ScrollProgressProps {
  targetRef?: RefObject<HTMLElement | null>;
}

export default function ScrollProgress({ targetRef }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-100"
      style={{ scaleX }}
    />
  );
}
