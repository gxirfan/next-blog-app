"use client";

import { Calendar, Info, Globe, MapPin, User, Shield } from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";
import { getRelativeTime } from "@/app/utils/date";

interface ProfileInfoCardProps {
  user: IUserResponse;
}

const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => {
  return (
    <div className="mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 md:px-0 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* LEFT COLUMN: Identity & Meta (Sidebar) 
            Now positioned on the left for better visual flow under the avatar.
        */}
        <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
          <section className="space-y-8">
            <h2 className="text-[12px] tracking-[0.3em] text-neutral-500 flex items-center gap-2">
              <User size={14} className="text-cyan-500" />
              Information
            </h2>

            <div className="space-y-8">
              {/* Username Item */}
              <div className="group">
                <p className="text-[12px] text-neutral-600 font-bold mb-2 tracking-tighter">
                  Handle
                </p>
                <p className="text-white font-bold text-lg flex items-center gap-1.5">
                  <span className="text-cyan-500/50">@</span>
                  {user.username}
                </p>
              </div>

              {/* Email Item */}
              <div className="group">
                <p className="text-[12px] text-neutral-600 font-bold mb-2 tracking-tighter">
                  Contact
                </p>
                <div className="flex items-center gap-2">
                  {user.isEmailPublic ? (
                    <a
                      href={`mailto:${user.email}`}
                      className="text-neutral-300 font-medium hover:text-cyan-400 transition-colors border-b border-neutral-800 pb-0.5"
                    >
                      {user.email}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-500 bg-neutral-900/50 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Shield size={12} />
                      <span className="text-[12px] font-bold tracking-widest">
                        Encrypted
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Joined Date */}
              <div className="group">
                <p className="text-[12px] text-neutral-600 font-bold mb-2 tracking-tighter">
                  Joined
                </p>
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <Calendar size={16} className="text-neutral-500" />
                  <span>{getRelativeTime(user.createdAt) || "Unknown"}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Biography (Main Content)
            Takes more space and acts as the "hero" text area.
        */}
        <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
          <section>
            <h2 className="text-[12px] tracking-[0.3em] text-neutral-500 mb-6 flex items-center gap-2">
              <Info size={14} className="text-cyan-500" />
              About Me
            </h2>
            <div className="max-w-none">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-bold tracking-tight">
                {user.bio ||
                  `This user stays quiet for now. No biography has been written yet.`}
              </p>
            </div>
          </section>

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-900">
            {user.location && (
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl text-xs text-neutral-400">
                <MapPin size={14} className="text-cyan-500" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl text-xs text-neutral-400">
              <Globe size={14} className="text-cyan-500" />
              <span>Personal Space</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
