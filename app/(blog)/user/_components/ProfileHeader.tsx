"use client";

import Image from "next/image";
import { IUserResponse } from "@/app/types/user-response.dto";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";

interface ProfileHeaderProps {
  user: IUserResponse;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const apiUrl = ENV.API_IMAGE_URL;

  const DEFAULT_COVER = apiUrl + "/images/user/covers/default-cover.png";
  const DEFAULT_AVATAR = apiUrl + "/images/user/avatars/default-avatar.png";

  const coverUrl = user.cover ? apiUrl + user.cover : DEFAULT_COVER;
  const avatarUrl = user.avatar ? apiUrl + user.avatar : DEFAULT_AVATAR;

  const getRoleColor = (role: string): string => {
    const r = role.toLowerCase();
    if (r === "admin") return "text-red-400";
    if (r === "moderator") return "text-yellow-400";
    return "text-neutral-500";
  };

  return (
    <div className="w-full bg-transparent flex flex-col">
      {/* 1. COVER IMAGE: Modern Rounded-3xl corners */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-[200px] md:h-[300px] bg-neutral-900 rounded-4xl overflow-hidden border border-neutral-800/30 select-none"
      >
        <Image
          src={coverUrl}
          alt="Cover"
          fill
          priority
          className="object-cover select-none"
          draggable={false}
        />
      </div>

      {/* 2. PROFILE SECTION */}
      <div className="px-6 md:px-10">
        <div className="flex flex-col items-start">
          {/* AVATAR: Circular cut-out effect */}
          <div className="relative -mt-16 md:-mt-24 mb-5 z-20">
            {/* We use 'aspect-square' and 'rounded-full' on the wrapper 
                to guarantee a perfect circle regardless of screen size.
            */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-neutral-950 bg-neutral-900 overflow-hidden aspect-square "
            >
              <Image
                src={avatarUrl}
                alt={user.nickname}
                fill
                className="object-cover rounded-full select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl text-white tracking-tight">
                {user.nickname || user.firstName}
              </h1>

              {user.role && user.role.toLowerCase() !== "user" && (
                <span
                  className={`px-3 py-1 rounded-full text-[11px] md:text-xs tracking-widest uppercase ${getRoleColor(
                    user.role,
                  )} bg-neutral-950 border border-neutral-800`}
                >
                  {user.role}
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-5">
              <span className="text-neutral-500 text-lg md:text-xl font-medium">
                @{user.username}
              </span>

              {/* Status Indicator Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-neutral-900/40 border border-neutral-800/50 rounded-2xl w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {/* <span className="text-neutral-300 text-[11px] md:text-xs font-semibold">
                  Last active:{" "}
                  {new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span> */}
                {(() => {
                  const lastLoginDate = new Date(user.lastLoginAt);
                  const now = new Date();
                  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                  const isInactive =
                    now.getTime() - lastLoginDate.getTime() > thirtyDaysInMs;

                  return (
                    <div className="flex items-center gap-2.5">
                      {/* Durum İkonu: Aktifse yeşil, 1 ayı geçmişse yanıp sönen kırmızı */}
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${isInactive ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                        <div
                          className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${
                            isInactive ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        />
                      </div>

                      <span
                        className={`text-[11px] md:text-xs font-semibold tracking-wide transition-colors duration-500 ${
                          isInactive ? "text-red-400" : "text-neutral-300"
                        }`}
                      >
                        Last active:{" "}
                        {getRelativeTime(lastLoginDate) || "Unknown"}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
