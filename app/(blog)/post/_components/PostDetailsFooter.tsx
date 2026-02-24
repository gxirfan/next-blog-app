import { MessageSquare, Activity } from "lucide-react";
import { getRelativeTime } from "@/app/utils/date";
import { IPostResponse } from "@/app/types/post";
import CopyPermalink from "./CopyPermaLink";
import { ENV } from "@/config/env.config";

export default function PostDetailsFooter({
  postDetails,
}: {
  postDetails: IPostResponse;
}) {
  return (
    <div className="mt-24 pt-12 border-t border-neutral-800 flex flex-col gap-12 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
        <div className="flex items-center gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <MessageSquare size={14} /> Engagements
            </div>
            <p className="text-2xl font-black text-white tracking-tighter italic">
              {postDetails.postCount}
            </p>
          </div>
          <div className="w-px h-10 bg-neutral-800" />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Activity size={14} /> Last Activity
            </div>
            <p className="text-lg font-bold text-neutral-300 uppercase">
              {postDetails.lastPostAt
                ? getRelativeTime(postDetails.lastPostAt)
                : "PENDING"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 group/share py-4 px-6 bg-neutral-900/20 border border-white/5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30">
          <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="flex flex-col items-end">
              <p className="text-[14px] text-neutral-400 font-jetbrains-mono font-bold leading-tight tracking-[0.2em] group-hover/share:text-white transition-colors">
                SHARE
              </p>
            </div>

            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative overflow-hidden rounded-lg">
              <CopyPermalink />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-neutral-900 gap-4 opacity-50">
        <div className="text-[10px] text-neutral-600 font-medium tracking-[0.4em]">
          {ENV.PROJECT_NAME} Protocol v{ENV.APP_VERSION}
        </div>
      </div>
    </div>
  );
}
