"use client";

import { useState } from "react";
import { IFlow } from "@/app/types/flow";
import FlowInput from "../../_components/FlowInput";
import FlowCard from "../../_components/FlowCard";
import FlowCardActions from "./FlowCardActions"; // Buton bileşeni

interface FlowReplySectionProps {
  mainFlow: IFlow;
  initialReplies: IFlow[];
}

export default function FlowReplySection({
  mainFlow,
  initialReplies,
}: FlowReplySectionProps) {
  // State: Kime yanıt veriliyor?
  const [replyingTo, setReplyingTo] = useState<IFlow | null>(mainFlow);

  const handleCancelReply = () => {
    setReplyingTo(mainFlow);
  };

  // Listeden bir karta tıklanınca çalışır
  const handleReplyFromList = (flow: IFlow) => {
    setReplyingTo(flow);
    const inputElement = document.getElementById("flow-reply-input");
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Güvenli kullanıcı adı (Input üstündeki yazı için)
  const replyTargetUsername = replyingTo?.author?.username || "Unknown";

  return (
    <>
      {/* 4. REPLY INPUT AREA */}
      <div
        id="flow-reply-input"
        className="pt-6 pb-6 border-b border-neutral-800"
      >
        <p className="text-neutral-500 text-sm mb-3 ml-1">
          Replying to{" "}
          <span className="text-cyan-400 font-medium">
            @{replyTargetUsername}
          </span>
        </p>
        <FlowInput
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
          // onPostSuccess eklenirse burada refresh mantığı kurulabilir
        />
      </div>

      {/* 5. YANITLAR LİSTESİ (Server'dan gelen veri ile) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2 mb-4">
          {mainFlow.replyCount || 0} Replies
        </h3>

        {initialReplies.length === 0 ? (
          <div className="text-center text-neutral-500 py-10">
            Be the first to reply!
          </div>
        ) : (
          initialReplies.map((reply) => (
            <FlowCard
              key={reply.id}
              flow={reply}
              // 🎯 COMPOSITION PATTERN:
              // FlowCard Server Component'tir, içine Client Component (Buton) gönderiyoruz.
              actionSlot={
                <FlowCardActions
                  replyCount={reply.replyCount}
                  onClick={() => handleReplyFromList(reply)}
                />
              }
            />
          ))
        )}
      </div>
    </>
  );
}
