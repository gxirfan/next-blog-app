"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Settings,
  X,
  BookOpen,
  ChevronRight,
  Shield,
  Users,
  UserPlus,
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
      className="fixed inset-0 w-screen h-screen bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] bg-neutral-950 border border-neutral-900 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-neutral-900">
          <span className="text-[9px] font-black tracking-[0.3em] text-neutral-600 pl-2"></span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 pb-4 flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <div className="relative w-full h-full rounded-full overflow-hidden border border-neutral-800 p-1 bg-neutral-900">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  fill
                  className="object-cover"
                  alt={user.nickname}
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-neutral-950 border border-neutral-900 p-1.5 rounded-xl">
              <Shield
                size={14}
                className={
                  user.role.toLowerCase() === "admin"
                    ? "text-red-500"
                    : "text-cyan-500"
                }
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black tracking-[0.2em] text-neutral-700 mb-1">
              {getGreetingTime()}
            </p>
            <h2 className="text-2xl font-black text-white tracking-tighter leading-none mb-1">
              {user.nickname}
            </h2>
            <span className="text-neutral-500 text-[10px] font-bold">
              @{user.username}
            </span>
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 divide-x divide-neutral-900 bg-neutral-900/30 border border-neutral-900 rounded-2xl overflow-hidden">
            <Link
              href={"/profile/?tab=followers"}
              onClick={onClose}
              className="flex flex-col items-center py-3 hover:bg-neutral-900 transition-colors"
            >
              <span className="text-lg font-black text-white">
                {user.followers || 0}
              </span>
              <span className="text-[8px] font-black text-neutral-600 tracking-widest">
                Followers
              </span>
            </Link>
            <Link
              href={"/profile/?tab=following"}
              onClick={onClose}
              className="flex flex-col items-center py-3 hover:bg-neutral-900 transition-colors"
            >
              <span className="text-lg font-black text-white">
                {user.following || 0}
              </span>
              <span className="text-[8px] font-black text-neutral-600 tracking-widest">
                Following
              </span>
            </Link>
          </div>
        </div>

        <div className="px-3 pb-6 flex flex-col gap-1.5">
          <MenuLink
            href={"/profile"}
            icon={<Settings size={18} />}
            label="Account Settings"
            onClick={onClose}
          />

          <MenuLink
            href="/library"
            icon={<BookOpen size={18} />}
            label="Personal Library"
            onClick={onClose}
          />

          {(user.role.toLowerCase() === "admin" ||
            user.role.toLowerCase() === "moderator") && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-4 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-red-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Shield
                  size={18}
                  className={
                    user.role.toLowerCase() === "admin"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                />
                <span className="text-xs font-black tracking-widest text-neutral-400 group-hover:text-white">
                  {user.role} Panel
                </span>
              </div>
              <ChevronRight
                size={16}
                className="text-neutral-800 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </Link>
          )}

          <div className="h-px bg-neutral-900 my-2 mx-4" />

          <button
            onClick={handleLogout}
            className="flex items-center justify-between px-6 py-4 rounded-2xl text-neutral-600 hover:text-red-500 hover:bg-red-500/5 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="text-xs font-black tracking-widest">
                Sign Out
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex items-center justify-between px-6 py-4 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-neutral-700 transition-all"
  >
    <div className="flex items-center gap-3 text-neutral-500 group-hover:text-white transition-colors">
      <span className="text-neutral-700 group-hover:text-cyan-500 transition-colors">
        {icon}
      </span>
      <span className="text-xs font-black tracking-widest">{label}</span>
    </div>
    <ChevronRight
      size={18}
      className="text-neutral-900 group-hover:text-white group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default UserModal;
