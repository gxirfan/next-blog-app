"use client";

import { useState } from "react";
import {
  Info,
  Globe,
  MapPin,
  Shield,
  User,
  Calendar,
  UserPlus,
  UserCheck,
  Users,
  UserMinus,
  Loader,
} from "lucide-react";
import { IProfileResponse } from "@/app/types/user-response.dto";
import { getRelativeTime } from "@/app/utils/date";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ENV } from "@/config/env.config";

interface ProfileInfoCardProps {
  user: IProfileResponse;
  currentUserId?: number;
}

const ProfileInfoCard = ({ user, currentUserId }: ProfileInfoCardProps) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followerCount, setFollowerCount] = useState(user.followers);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!currentUserId) {
        router.push("/login?redirect=" + encodeURIComponent(pathname || ""));
        return;
      }
      const response = await fetch(`${ENV.API_URL}/user/toggle-follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: user.id }),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const newStatus = result.data;

        setIsFollowing(newStatus);
        setFollowerCount((prev) => (newStatus ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="mx-auto w-full animate-in fade-in duration-1000 px-4 md:px-8 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
          <div className="space-y-6 flex flex-col">
            {!isOwnProfile && (
              <button
                onClick={handleToggleFollow}
                disabled={isLoading}
                className={`group w-full h-12 flex items-center justify-center gap-2.5 rounded-xl font-semibold text-xs tracking-widest transition-all duration-300 active:scale-[0.97] outline-none ${
                  isFollowing
                    ? "bg-transparent border border-neutral-800 text-neutral-400 hover:border-red-800 hover:bg-red-950/20 hover:text-red-400"
                    : "bg-cyan-500 text-black hover:bg-white"
                }`}
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck size={16} className="group-hover:hidden" />
                    <UserMinus size={16} className="hidden group-hover:block" />
                    <span className="group-hover:hidden tracking-[0.2em]">
                      Following
                    </span>
                    <span className="hidden group-hover:block tracking-[0.2em]">
                      Unfollow
                    </span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span className="tracking-[0.2em]">Follow</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center w-full py-4 border-y border-neutral-900/50">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                    {followerCount}
                  </span>
                </div>
                <span className="text-xs font-black text-neutral-600 tracking-[0.3em] mt-1">
                  Followers
                </span>
              </div>

              <div className="h-8 w-px bg-neutral-700" />

              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                    {user.following}
                  </span>
                </div>
                <span className="text-xs font-black text-neutral-600 tracking-[0.3em] mt-1">
                  Following
                </span>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-[11px] font-bold tracking-widest text-neutral-500 border-b border-neutral-900 pb-3 flex items-center gap-2">
              <User size={14} />
              Personal Info
            </h2>

            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-600 font-bold tracking-wider">
                  Email Address
                </p>
                {user.isEmailPublic ? (
                  <a
                    href={`mailto:${user.email}`}
                    className="text-neutral-200 font-medium text-base hover:text-cyan-400 transition-colors"
                  >
                    {user.email}
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500 text-sm">
                    <Shield size={12} />
                    <span>Private</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <Calendar size={16} className="text-neutral-700" />
                  <span>Joined {getRelativeTime(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-12 order-1 lg:order-2">
          <section className="space-y-6">
            <h2 className="text-[11px] font-bold tracking-widest text-neutral-500 border-b border-neutral-900 pb-3 flex items-center gap-2">
              <Info size={14} />
              About Me
            </h2>

            <p className="text-xl md:text-3xl text-white leading-snug font-black tracking-tight">
              {user.bio || "No information shared yet."}
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            {user.location && (
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-xl border border-neutral-800">
                <MapPin size={14} className="text-neutral-600" />
                <span className="text-xs font-bold text-neutral-300 tracking-wider">
                  {user.location}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-xl border border-neutral-800">
              <Globe size={14} className="text-neutral-600" />
              <span className="text-xs font-bold text-neutral-300 tracking-wider">
                Public Profile
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
