"use client";

import { useRef } from "react";
import ScrollProgress from "@/app/components/ScrollProgress";

interface PostContentForScrollProgressProps {
  children: React.ReactNode;
}

export default function PostContentForScrollProgress({
  children,
}: PostContentForScrollProgressProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollProgress targetRef={contentRef} />

      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </>
  );
}
