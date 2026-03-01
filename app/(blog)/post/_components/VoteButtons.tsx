"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";

interface VoteButtonProps {
  postId: number;
  score: number;
  userCurrentVoteDirection: number | null;
}

const VoteButtons = ({
  postId,
  score,
  userCurrentVoteDirection,
}: VoteButtonProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const [optimisticScore, setOptimisticScore] = useState(score);
  const [userVote, setUserVote] = useState(userCurrentVoteDirection ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOptimisticScore(score);
    setUserVote(userCurrentVoteDirection ?? 0);
  }, [score, userCurrentVoteDirection]);

  const handleVote = async (newDirection: 1 | -1) => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (isPending || loading) return;
    setError(null);

    const oldScore = optimisticScore;
    const oldVote = userVote;
    const targetDirection = oldVote === newDirection ? 0 : newDirection;
    const diff = targetDirection - oldVote;

    setOptimisticScore(oldScore + diff);
    setUserVote(targetDirection);
    setLoading(true);

    try {
      await api.post("/vote", {
        postId,
        type: "post",
        direction: targetDirection,
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setOptimisticScore(oldScore);
      setUserVote(oldVote);
      setError(err.response?.data?.message || "Signal lost.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isUp = userVote === 1;
  const isDown = userVote === -1;

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1">
        <button
          onClick={() => handleVote(1)}
          className={`group relative p-2 rounded-full transition-all duration-300 cursor-pointer ${
            isUp
              ? "bg-green-500 text-black"
              : "text-neutral-500 hover:text-white"
          } ${!user ? "opacity-60 cursor-pointer" : ""}`}
        >
          <ArrowBigUp
            size={20}
            className={isUp ? "fill-current" : "group-hover:scale-110"}
          />
        </button>

        <div className="px-3 min-w-[40px] text-center">
          <span
            className={`text-sm tracking-tighter font-black ${
              isUp
                ? "text-green-400"
                : isDown
                  ? "text-red-400"
                  : "text-neutral-400"
            }`}
          >
            {optimisticScore > 0 ? `+${optimisticScore}` : optimisticScore}
          </span>
        </div>

        <button
          onClick={() => handleVote(-1)}
          className={`group relative p-2 rounded-full transition-all duration-300 cursor-pointer ${
            isDown
              ? "bg-red-600 text-white"
              : "text-neutral-500 hover:text-white"
          } ${!user ? "opacity-60 cursor-pointer" : ""}`}
        >
          <ArrowBigDown
            size={20}
            className={isDown ? "fill-current" : "group-hover:scale-110"}
          />
        </button>
      </div>
    </div>
  );
};

export default VoteButtons;
