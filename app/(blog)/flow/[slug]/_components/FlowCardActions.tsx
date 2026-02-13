// app/flow/_components/FlowCardActions.tsx
"use client";

import { MessageCircle } from "lucide-react";

interface FlowCardActionsProps {
  replyCount?: number;
  onClick: () => void;
}

export default function FlowCardActions({
  replyCount,
  onClick,
}: FlowCardActionsProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Link'in çalışmasını engelle
        e.stopPropagation(); // Kart tıklamasını engelle (varsa)
        onClick();
      }}
      className="text-neutral-500 hover:text-cyan-400 transition-colors flex items-center text-xs group cursor-pointer"
    >
      <div className="p-1.5 rounded-full group-hover:bg-cyan-500/10 mr-1">
        <MessageCircle size={16} />
      </div>
      <span>Reply {replyCount ? `(${replyCount})` : ""}</span>
    </button>
  );
}
