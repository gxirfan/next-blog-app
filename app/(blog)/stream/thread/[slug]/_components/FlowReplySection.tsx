"use client";

import { useState } from "react";
import useSWR from "swr";
import { IFlow } from "@/app/types/flow";
import FlowInput from "../../../_components/FlowInput";
import FlowCard from "../../../_components/FlowCard";
import FlowCardActions from "./FlowCardActions";
import { ENV } from "@/config/env.config";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

interface FlowReplySectionProps {
  mainFlow: IFlow;
  initialReplies: IFlow[];
}

export default function FlowReplySection({
  mainFlow,
  initialReplies,
}: FlowReplySectionProps) {
  const [replyingTo, setReplyingTo] = useState<IFlow | null>(mainFlow);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { data: swrResponse } = useSWR(
    `${ENV.API_URL}/flow/${mainFlow.slug}/replies?page=${page}&limit=10`,
    fetcher,
    {
      fallbackData: { data: { data: initialReplies } },
      refreshInterval: 5000,
      revalidateOnFocus: true,
    },
  );

  const replies = swrResponse?.data?.data || initialReplies;
  const totalReplies = swrResponse?.data?.meta?.total ?? mainFlow.replyCount;

  const handleCancelReply = () => {
    setReplyingTo(mainFlow);
  };

  const handleReplyFromList = (flow: IFlow) => {
    setReplyingTo(flow);
    const inputElement = document.getElementById("flow-reply-input");
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const replyTargetUserNickname = replyingTo?.author?.nickname || "Unknown";

  return (
    <>
      <div
        id="flow-reply-input"
        className="pt-6 pb-6 border-b border-neutral-800"
      >
        <p className="text-neutral-500 text-sm mb-3 ml-1">
          Replying to{" "}
          <span className="text-cyan-400 font-medium">
            <Link
              href={`/user/${replyingTo?.author.username}`}
              className="hover:underline"
            >
              {replyTargetUserNickname}
            </Link>
          </span>
        </p>
        <FlowInput replyingTo={replyingTo} onCancelReply={handleCancelReply} />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2 mb-4">
          {totalReplies || 0} Replies
        </h3>

        {replies.length === 0 ? (
          <div className="text-center text-neutral-500 py-10">
            Be the first to reply!
          </div>
        ) : (
          replies.map((reply: IFlow) => (
            <FlowCard
              key={reply.id}
              flow={reply}
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
