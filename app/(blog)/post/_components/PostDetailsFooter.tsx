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

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right pr-4">
            <p className="text-[9px] text-neutral-600 font-mono uppercase leading-tight tracking-widest">
              Global Access Point
              <br />
              Verified_Source_OK
            </p>
          </div>
          <CopyPermalink />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-neutral-900 gap-4 opacity-50">
        <div className="text-[10px] text-neutral-600 font-medium uppercase tracking-[0.4em]">
          {ENV.PROJECT_NAME} Protocol v2.6
        </div>
      </div>
    </div>
  );
}
