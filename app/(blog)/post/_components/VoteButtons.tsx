"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, ArrowBigDown, X, Loader2 } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";

interface VoteButtonProps {
  postId: string;
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

  if (!user) return null;

  const handleVote = async (newDirection: 1 | -1) => {
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
      {error && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-[10px] uppercase tracking-widest rounded-full animate-in slide-in-from-bottom-2 duration-300 z-50">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={10} />
          </button>
        </div>
      )}

      {/* 2. MAIN VOTE PILL: A single integrated unit */}
      <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1">
        {/* Upvote */}
        <button
          onClick={() => handleVote(1)}
          disabled={loading || isPending}
          className={`group relative p-2 rounded-full transition-all duration-300 cursor-pointer ${
            isUp
              ? "bg-cyan-500 text-black"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          <ArrowBigUp
            size={20}
            className={`${
              isUp
                ? "fill-current"
                : "group-hover:scale-110 transition-transform"
            }`}
          />
        </button>

        {/* Score Display */}
        <div className="px-3 min-w-[40px] text-center">
          {loading ? (
            <Loader2
              size={14}
              className="animate-spin text-neutral-600 mx-auto"
            />
          ) : (
            <span
              className={`text-sm tracking-tighter ${
                isUp
                  ? "text-cyan-400"
                  : isDown
                    ? "text-red-400"
                    : "text-neutral-400"
              }`}
            >
              {optimisticScore === 0
                ? "0"
                : optimisticScore > 0
                  ? `+${optimisticScore}`
                  : optimisticScore}
            </span>
          )}
        </div>

        {/* Downvote */}
        <button
          onClick={() => handleVote(-1)}
          disabled={loading || isPending}
          className={`group relative p-2 rounded-full transition-all duration-300 cursor-pointer ${
            isDown
              ? "bg-red-500 text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          <ArrowBigDown
            size={20}
            className={`${
              isDown
                ? "fill-current"
                : "group-hover:scale-110 transition-transform"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default VoteButtons;
