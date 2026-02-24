"use client";
import { useState } from "react";
import FlowInput from "./FlowInput";
import FlowCard from "./FlowCard";
import { IFlow } from "@/app/types/flow";
import FlowCardActions from "../thread/[slug]/_components/FlowCardActions";
import { Wind } from "lucide-react";
import useSWR from "swr";
import { ENV } from "@/config/env.config";
import { useSearchParams } from "next/navigation";
import ScrollProgress from "@/app/components/ScrollProgress";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stream");
  const result = await res.json();
  return result.data.data;
};

interface FlowFeedProps {
  initialFlows: IFlow[];
  isDetailsPage?: boolean;
}

export default function FlowFeed({
  initialFlows,
  isDetailsPage = false,
}: FlowFeedProps) {
  const [replyingTo, setReplyingTo] = useState<IFlow | null>(null);

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "50";

  const { data: flows, isValidating } = useSWR<IFlow[]>(
    `${ENV.API_URL}/flow?page=${page}&limit=${limit}`,
    fetcher,
    {
      fallbackData: initialFlows,
      refreshInterval: 5000,
      revalidateOnFocus: true,
      dedupingInterval: 4000,
    },
  );

  const handleReply = (flow: IFlow) => {
    setReplyingTo(flow);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="w-full mx-auto">
      <ScrollProgress />
      {!isDetailsPage && (
        <div className="px-4 md:px-0 mb-8">
          <FlowInput
            replyingTo={replyingTo}
            onCancelReply={handleCancelReply}
          />
        </div>
      )}

      <div className="flex flex-col min-h-[400px]">
        {flows && flows.length === 0 ? (
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
          <div className="divide-y divide-transparent">
            {flows &&
              flows.map((flow) => {
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
