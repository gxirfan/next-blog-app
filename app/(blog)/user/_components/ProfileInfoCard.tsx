"use client";

import { Info, Globe, MapPin, Shield, User, Calendar } from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";
import { getRelativeTime } from "@/app/utils/date";

interface ProfileInfoCardProps {
  user: IUserResponse;
}

const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => {
  return (
    <div className="mx-auto w-full animate-in fade-in duration-1000 px-4 md:px-8 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: BASIC INFO */}
        <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
          <section className="space-y-6">
            <h2 className="text-[11px] font-bold tracking-widest text-neutral-500 border-b border-neutral-900 pb-3 flex items-center gap-2">
              <User size={14} />
              Personal Info
            </h2>

            <div className="space-y-6">
              {/* Contact Item */}
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-600 font-bold tracking-wider">
                  Email Address
                </p>
                {user.isEmailPublic ? (
                  <a
                    href={`mailto:${user.email}`}
                    className="text-neutral-200 font-medium text-base hover:text-white transition-colors"
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

              {/* Dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <Calendar size={16} className="text-neutral-700" />
                  <span>Joined {getRelativeTime(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: BIOGRAPHY */}
        <div className="lg:col-span-8 space-y-12 order-1 lg:order-2">
          <section className="space-y-6">
            <h2 className="text-[11px] font-bold tracking-widest text-neutral-500 border-b border-neutral-900 pb-3 flex items-center gap-2">
              <Info size={14} />
              About Me
            </h2>

            <p className="text-xl md:text-3xl text-white leading-snug font-bold tracking-tight">
              {user.bio || "No information shared yet."}
            </p>
          </section>

          {/* Location & Global Badges */}
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
