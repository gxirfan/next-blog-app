"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditableField from "./_components/EditableField";
import PasswordModal from "./_components/PasswordModal";
import RecoveryCard from "./_components/RecoveryCard";
import {
  Settings,
  Key,
  Calendar,
  UserCheck,
  Shield,
  Activity,
} from "lucide-react";
import EmailPrivacyToggle from "./_components/EmailPrivacyToggle";
import ProfileMediaPreview from "./_components/ProfileMediaPreview";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";

export default function ProfilePage() {
  const { user, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other / Prefer not to specify" },
  ];

  const userBirthDate = user.birthDate
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(user.birthDate))
    : "";

  const apiUrl = ENV.API_IMAGE_URL;
  const avatarUrl = user.avatar
    ? apiUrl + user.avatar
    : apiUrl + "/images/user/avatars/default-avatar.png";
  const coverUrl = user.cover
    ? apiUrl + user.cover
    : apiUrl + "/images/user/covers/default-cover.png";

  return (
    <div className="relative min-h-screen w-full">
      {coverUrl && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={coverUrl}
            alt="Background Cover"
            fill
            priority
            className="object-cover opacity-15"
          />
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-12 pb-20 pt-8 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-cyan-500 mb-2">
              <Settings size={24} strokeWidth={1.5} />
              <div className="h-px w-8 bg-neutral-800" />
            </div>
            <h1 className="text-5xl text-white tracking-tighter leading-none">
              Settings
            </h1>
            <p className="text-neutral-500 text-[11px] tracking-[0.4em]">
              Manage your account and profile
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={16} className="text-cyan-500/50" />
              <h2 className="text-[11px] tracking-[0.3em] text-neutral-400">
                Profile Media
              </h2>
            </div>

            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
              <ProfileMediaPreview
                avatarUrl={avatarUrl}
                coverUrl={coverUrl}
                username={user.username}
                onUploadSuccess={checkAuthStatus}
              />
              <div className="p-8 border-t border-white/5">
                <EmailPrivacyToggle
                  initialStatus={user.isEmailPublic}
                  onUpdateSuccess={checkAuthStatus}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={16} className="text-cyan-500/50" />
              <h2 className="text-[12px] tracking-[0.3em] text-neutral-400">
                Account Info
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-neutral-950/40 backdrop-blur-xl border border-white/5 rounded-4xl flex flex-col justify-center">
                <p className="text-[12px] tracking-[0.2em] text-neutral-600 mb-4 ml-1 font-black">
                  Username
                </p>
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                  <UserCheck size={20} className="text-cyan-500" />
                  <span className="tracking-tight">@{user.username}</span>
                </div>
              </div>

              <EditableField
                label="Email Address"
                fieldKey="email"
                initialValue={user.email}
                type="email"
                onSuccess={checkAuthStatus}
              />
            </div>

            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField
                  label="Nickname"
                  fieldKey="nickname"
                  initialValue={user.nickname}
                  onSuccess={checkAuthStatus}
                />
                <EditableField
                  label="First Name"
                  fieldKey="firstName"
                  initialValue={user.firstName}
                  onSuccess={checkAuthStatus}
                />
                <EditableField
                  label="Last Name"
                  fieldKey="lastName"
                  initialValue={user.lastName}
                  onSuccess={checkAuthStatus}
                />
                <EditableField
                  label="Birth Date"
                  fieldKey="birthDate"
                  initialValue={userBirthDate}
                  onSuccess={checkAuthStatus}
                  type="date"
                />
                <EditableField
                  label="Location"
                  fieldKey="location"
                  initialValue={user.location || ""}
                  onSuccess={checkAuthStatus}
                />
                <EditableField
                  label="Gender Identity"
                  fieldKey="gender"
                  initialValue={user.gender || ""}
                  selectOptions={GENDER_OPTIONS}
                  onSuccess={checkAuthStatus}
                />
              </div>

              <EditableField
                label="Biography"
                fieldKey="bio"
                initialValue={user.bio || ""}
                isTextArea
                onSuccess={checkAuthStatus}
              />
            </div>
          </section>

          {/* 4. Security & Metadata Footer */}
          <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="flex flex-wrap items-center gap-8">
              <div className="space-y-1">
                <p className="text-[9px] tracking-widest text-neutral-700">
                  Access Level
                </p>
                <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-tight">
                  <Shield size={14} className="text-cyan-500/50" />
                  {user.role === "user" ? "Standard Identity" : user.role}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] tracking-widest text-neutral-700">
                  Registry Date
                </p>
                <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs">
                  <Calendar size={14} className="text-neutral-500" />
                  {getRelativeTime(user.createdAt) || "Unknown"}
                </div>
              </div>
            </div>

            <button
              className="
              flex-1 lg:flex-none 
              flex items-center justify-center gap-4 
              px-12 py-6 
              bg-neutral-900 border-2 border-neutral-800 
              rounded-full 
              text-[12px] font-black tracking-[0.2em] text-neutral-400 
              hover:border-white hover:text-white 
              transition-all duration-300 cursor-pointer 
              active:scale-95
            "
              onClick={() => setIsModalOpen(true)}
            >
              <Key size={18} />
              <span>Change Password</span>
            </button>
          </div>

          <RecoveryCard />
        </div>

        {isModalOpen && (
          <PasswordModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={checkAuthStatus}
          />
        )}
      </div>
    </div>
  );
}
