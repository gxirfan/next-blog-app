"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
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
  User,
} from "lucide-react";
import EmailPrivacyToggle from "./_components/EmailPrivacyToggle";
import ProfileMediaPreview from "./_components/ProfileMediaPreview";
import { getRelativeTime } from "@/app/utils/date";
import { ENV } from "@/config/env.config";

export default function ProfilePage() {
  const { user, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  const handleRefresh = useCallback(async () => {
    if (typeof checkAuthStatus === "function") {
      await checkAuthStatus();
    }

    setRefreshKey(Date.now());
  }, [checkAuthStatus]);

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
    ? `${apiUrl}${user.avatar}?v=${refreshKey}`
    : `${apiUrl}/images/user/avatars/default-avatar.png`;

  const coverUrl = user.cover
    ? `${apiUrl}${user.cover}?v=${refreshKey}`
    : `${apiUrl}/images/user/covers/default-cover.png`;

  return (
    <div className="relative min-h-screen w-full">
      {user.cover && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            key={`bg-${refreshKey}`}
            src={coverUrl}
            alt="Background Cover"
            fill
            priority
            className="object-cover opacity-15 transition-opacity duration-1000"
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
                key={`preview-${refreshKey}`}
                avatarUrl={avatarUrl}
                coverUrl={coverUrl}
                username={user.username}
                onUploadSuccess={handleRefresh}
              />
              <div className="p-8 border-t border-white/5">
                <EmailPrivacyToggle
                  initialStatus={user.isEmailPublic}
                  onUpdateSuccess={handleRefresh}
                />
              </div>
            </div>
          </section>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <Activity size={18} className="text-cyan-500" />
                <h2 className="text-sm font-bold tracking-wide text-neutral-300">
                  Account Information
                </h2>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="p-8 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:bg-neutral-900/60">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-neutral-600 tracking-[0.2em]">
                      Username
                    </p>
                    <div className="flex items-center text-white font-bold text-2xl tracking-tight">
                      <span className="opacity-40">@</span>
                      {user.username}
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-full border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                    <UserCheck size={20} className="text-cyan-500" />
                  </div>
                </div>

                <EditableField
                  label="Email Address"
                  fieldKey="email"
                  initialValue={user.email}
                  type="email"
                  onSuccess={handleRefresh}
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <User size={18} className="text-cyan-500" />
                <h2 className="text-sm font-bold tracking-wide text-neutral-300">
                  Personal Details
                </h2>
              </div>

              <div className="flex flex-col space-y-4">
                <EditableField
                  label="Nickname"
                  fieldKey="nickname"
                  initialValue={user.nickname}
                  onSuccess={handleRefresh}
                />
                <EditableField
                  label="First Name"
                  fieldKey="firstName"
                  initialValue={user.firstName}
                  onSuccess={handleRefresh}
                />
                <EditableField
                  label="Last Name"
                  fieldKey="lastName"
                  initialValue={user.lastName}
                  onSuccess={handleRefresh}
                />
                <EditableField
                  label="Birth Date"
                  fieldKey="birthDate"
                  initialValue={userBirthDate}
                  onSuccess={handleRefresh}
                  type="date"
                />
                <EditableField
                  label="Current Location"
                  fieldKey="location"
                  initialValue={user.location || ""}
                  onSuccess={handleRefresh}
                />
                <EditableField
                  label="Gender Identity"
                  fieldKey="gender"
                  initialValue={user.gender || ""}
                  selectOptions={GENDER_OPTIONS}
                  onSuccess={handleRefresh}
                />
                <EditableField
                  label="Biography"
                  fieldKey="bio"
                  initialValue={user.bio || ""}
                  isTextArea
                  onSuccess={handleRefresh}
                />
              </div>
            </section>

            <footer className="pt-12 border-t border-white/5 flex flex-col space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-12 bg-neutral-900/30 p-6 rounded-4xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-black tracking-widest text-neutral-600">
                      Access Level
                    </p>
                    <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs">
                      <Shield size={14} className="text-cyan-500/50" />
                      {user.role === "user" ? "Standard Member" : user.role}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="space-y-1">
                    <p className="text-sm font-black tracking-widest text-neutral-600">
                      Member Since
                    </p>
                    <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs">
                      <Calendar size={14} className="text-neutral-500" />
                      {getRelativeTime(user.createdAt)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-10 py-5 bg-white text-black text-sm font-black tracking-widest rounded-full hover:bg-cyan-500 transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Key size={16} />
                    Change Password
                  </div>
                </button>
              </div>
              <div className="pt-4">
                <RecoveryCard />
              </div>
            </footer>
          </div>

          {isModalOpen && (
            <PasswordModal
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}
