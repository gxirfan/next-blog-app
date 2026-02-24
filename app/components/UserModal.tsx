"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  X,
  BookOpen,
  ChevronRight,
  Shield,
} from "lucide-react";
import { ENV } from "@/config/env.config";

interface UserModalProps {
  onClose: () => void;
}

export const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 22) return "Good evening";
  return "Good night";
};

const UserModal = ({ onClose }: UserModalProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/login");
  };

  const avatarUrl =
    ENV.API_IMAGE_URL +
    (user.avatar ? user.avatar : "/images/user/avatars/default-avatar.png");

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/95 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] bg-neutral-950 border border-neutral-900 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-3 flex justify-end items-center">
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-white transition-colors cursor-pointer border border-neutral-800 rounded-full p-2 hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* IDENTITY SECTION */}
        <div className="p-8 pb-4 flex flex-col items-center">
          <div className="relative w-30 h-30 rounded-full border border-neutral-800 p-1 mb-6 bg-neutral-900/50">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={avatarUrl}
                fill
                className="object-cover"
                alt="Identity avatar"
              />
            </div>
            {/* Role Badge: Clean and floating */}
            <div className="absolute -bottom-1 -right-1 bg-neutral-950 border border-neutral-800 p-1.5 rounded-xl">
              <Shield
                size={20}
                className={
                  user.role === "admin"
                    ? "adminColor"
                    : user.role === "moderator"
                      ? "moderatorColor"
                      : user.role === "writer"
                        ? "writerColor"
                        : "userColor"
                }
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 mb-2">
              {getGreetingTime()}
            </p>
            <h2 className="text-2xl font-black text-white tracking-tighter  leading-none mb-1">
              {user.nickname}
            </h2>
            <span className="text-neutral-500 text-[10px] font-mono">
              @{user.username}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 flex items-center justify-center">
          <span
            className={`flex items-center px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              user.role === "admin"
                ? "adminColor"
                : user.role === "moderator"
                  ? "moderatorColor"
                  : user.role === "writer"
                    ? "writerColor"
                    : "userColor"
            }`}
          >
            <Shield size={20} className="mr-2" /> {user.role}
          </span>
        </div>

        <div className="px-4 pb-8 flex flex-col gap-1">
          <MenuLink
            href="/profile"
            icon={<Settings size={20} />}
            label="Profile Settings"
            onClick={onClose}
          />

          <MenuLink
            href="/library"
            icon={<BookOpen size={20} />}
            label="Personal Library"
            onClick={onClose}
          />

          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-red-500/30 transition-all group"
            >
              <div className="flex items-center gap-4 adminColor">
                <LayoutDashboard size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Admin Panel
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-neutral-700 group-hover:text-red-500"
              />
            </Link>
          )}

          {user.role === "moderator" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-yellow-500/30 transition-all group"
            >
              <div className="flex items-center gap-4 moderatorColor">
                <Shield size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Moderator Panel
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-neutral-700 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all"
              />
            </Link>
          )}

          <div className="h-px bg-neutral-900 my-4 mx-4" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-neutral-600 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Terminate Session
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Sub-component for clarity
const MenuLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex items-center justify-between px-6 py-4 rounded-3xl bg-neutral-950 border border-transparent hover:border-neutral-800 hover:bg-neutral-900/50 transition-all"
  >
    <div className="flex items-center gap-4 text-neutral-500 group-hover:text-white transition-colors">
      <span className="text-neutral-700 group-hover:text-cyan-500 transition-colors">
        {icon}
      </span>
      <span className="text-[11px] uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight
      size={20}
      className="text-neutral-800 group-hover:text-white group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default UserModal;
