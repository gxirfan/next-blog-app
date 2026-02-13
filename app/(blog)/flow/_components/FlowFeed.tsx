"use client";
import { useState } from "react";
import FlowInput from "./FlowInput";
import FlowCard from "./FlowCard";
import { IFlow } from "@/app/types/flow";
import FlowCardActions from "../[slug]/_components/FlowCardActions";
import { Wind } from "lucide-react";

interface FlowFeedProps {
  initialFlows: IFlow[];
}

export default function FlowFeed({ initialFlows }: FlowFeedProps) {
  const [replyingTo, setReplyingTo] = useState<IFlow | null>(null);

  const handleReply = (flow: IFlow) => {
    setReplyingTo(flow);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="w-full mx-auto">
      {/* 1. INPUT AREA: Etrafında biraz boşluk bırakarak ana içerikten ayırıyoruz */}
      <div className="px-4 md:px-0 mb-8">
        <FlowInput replyingTo={replyingTo} onCancelReply={handleCancelReply} />
      </div>

      {/* 2. FEED LIST: space-y-4 yerine kesintisiz akış */}
      <div className="flex flex-col min-h-[400px]">
        {initialFlows.length === 0 ? (
          /* 🎯 Modern Empty State: Sadece yazı değil, görsel bir ikonla zenginleştirilmiş */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-800">
              <Wind size={28} className="text-neutral-700" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              Silence in the stream
            </h3>
            <p className="text-neutral-500 text-sm max-w-[250px] leading-relaxed">
              Nothing flowing yet. Be the first drop in the digital ocean! 💧
            </p>
          </div>
        ) : (
          /* Kartlar arası boşluğu kaldırdık (FlowCard içindeki border-b zaten ayırıyor) */
          <div className="divide-y divide-transparent">
            {initialFlows.map((flow) => {
              if (!flow || !flow.id) return null;
              return (
                <div
                  key={flow.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <FlowCard
                    flow={flow}
                    actionSlot={
                      <FlowCardActions
                        replyCount={flow.replyCount}
                        onClick={() => handleReply(flow)}
                      />
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
