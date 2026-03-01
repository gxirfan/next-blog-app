"use client";

import Image from "next/image";
import { IUserResponse } from "@/app/types/user-response.dto";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";
import { Shield, Calendar } from "lucide-react";

interface ProfileHeaderProps {
  user: IUserResponse;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const apiUrl = ENV.API_IMAGE_URL;

  const DEFAULT_COVER = apiUrl + "/images/user/covers/default-cover.png";
  const DEFAULT_AVATAR = apiUrl + "/images/user/avatars/default-avatar.png";

  const coverUrl = user.cover ? apiUrl + user.cover : DEFAULT_COVER;
  const avatarUrl = user.avatar ? apiUrl + user.avatar : DEFAULT_AVATAR;

  const getRoleClass = (role: string): string => {
    const r = role.toLowerCase();
    if (r === "admin") return "adminColor";
    if (r === "moderator") return "moderatorColor";
    if (r === "writer") return "writerColor";
    return "userColor";
  };

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* 1. COVER ARCHIVE */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-[220px] md:h-[350px] bg-neutral-900 rounded-[3rem] overflow-hidden border-2 border-neutral-900 select-none"
      >
        <Image
          src={coverUrl}
          alt="Profile Cover"
          fill
          priority
          className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
          draggable={false}
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* 2. IDENTITY BLOCK */}
      <div className="px-4 md:px-8 relative">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
          {/* AVATAR */}
          <div className="relative -mt-24 md:-mt-32 z-20 shrink-0">
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[8px] border-neutral-950 bg-neutral-900 overflow-hidden"
            >
              <Image
                src={avatarUrl}
                alt={user.nickname}
                fill
                className="object-cover select-none rounded-full"
                draggable={false}
              />
            </div>
            {/* Floating Role Icon */}
            <div
              className={`absolute bottom-2 right-2 p-2.5 bg-neutral-950 border-2 border-neutral-900 rounded-2xl ${getRoleClass(user.role)}`}
            >
              <Shield size={20} />
            </div>
          </div>

          {/* MAIN INFO */}
          <div className="flex-1 space-y-4 pb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {user.nickname || user.firstName}
              </h1>

              {user.role && user.role.toLowerCase() !== "user" && (
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl bg-neutral-900 border-2 border-neutral-800 ${getRoleClass(user.role)}`}
                >
                  <span className="text-[10px] font-black tracking-[0.2em]">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <span className="text-neutral-500 text-lg md:text-xl font-bold font-mono">
                @{user.username}
              </span>

              {/* VITAL STATUS */}
              {(() => {
                const lastLoginDate = new Date(user.lastLoginAt);
                const now = new Date();
                const isInactive =
                  now.getTime() - lastLoginDate.getTime() >
                  30 * 24 * 60 * 60 * 1000;

                return (
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-neutral-950 border-2 border-neutral-900 rounded-2xl">
                    <div className="relative flex h-2.5 w-2.5">
                      <div
                        className={`absolute inset-0 rounded-full animate-ping opacity-40 ${isInactive ? "bg-red-500" : "bg-emerald-500"}`}
                      />
                      <div
                        className={`relative rounded-full h-full w-full ${isInactive ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar size={14} className="text-neutral-700" />
                      <span className="text-[11px] font-black tracking-widest leading-none">
                        Active {getRelativeTime(lastLoginDate)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
