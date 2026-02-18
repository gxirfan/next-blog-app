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

  const avatarUrl = user.avatar
    ? ENV.API_IMAGE_URL + user.avatar
    : "http://localhost:3000/images/user/avatars/default-avatar.png";

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/90 backdrop-blur-md z-9999 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] bg-neutral-950 border border-neutral-800 rounded-4xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button: Sharp and visible */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2.5 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-500 hover:text-white hover:border-neutral-700 transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Profile Identity Area */}
        <div className="p-10 pb-6 flex flex-col items-center text-center">
          <div className="relative w-28 h-28 rounded-[2.5rem] border-2 border-neutral-800 p-1 mb-6">
            <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden">
              <Image
                src={avatarUrl}
                fill
                className="object-cover"
                alt="Identity"
              />
            </div>
            {/* Role Badge Attached to Avatar */}
            <div className="absolute -bottom-2 -right-2 bg-neutral-950 border border-neutral-800 p-2 rounded-xl">
              <Shield
                size={14}
                className={
                  user.role === "admin"
                    ? "text-cyan-500"
                    : user.role === "moderator"
                      ? "text-yellow-500"
                      : user.role === "user"
                        ? "text-neutral-500"
                        : user.role === "writer"
                          ? "text-green-500"
                          : "text-neutral-700"
                }
              />
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 mb-2">
            {getGreetingTime()}
          </p>
          <h2 className="text-3xl text-white tracking-tighter uppercase leading-none mb-1">
            {user.nickname}
          </h2>
          <span className="text-neutral-500 text-xs font-bold tracking-tight">
            @{user.username}
          </span>
        </div>

        <div className="px-6 pb-6 flex items-center justify-center select-none">
          <span
            className={`flex px-2 py-1 bg-neutral-950 border border-neutral-800 rounded-lg uppercase text-sm font-bold tracking-tight ${user.role === "admin" ? "adminColor" : user.role === "moderator" ? "moderatorColor" : user.role === "user" ? "userColor" : user.role === "writer" ? "writerColor" : "text-neutral-700"}`}
          >
            <Shield size={18} className="mr-1" /> {user.role}
          </span>
        </div>

        {/* Action Grid */}
        <div className="px-6 pb-10 flex flex-col gap-2">
          <MenuLink
            href="/profile"
            icon={<Settings size={18} />}
            label="Profile Settings"
            onClick={onClose}
          />

          <MenuLink
            href="/library"
            icon={<BookOpen size={18} />}
            label="Personal Library"
            onClick={onClose}
          />

          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-4 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 transition-all group"
            >
              <div className="flex items-center gap-4 text-cyan-500">
                <LayoutDashboard size={18} />
                <span className="text-[11px] uppercase tracking-widest">
                  System Admin
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-cyan-900 group-hover:text-cyan-500 transition-colors"
              />
            </Link>
          )}

          {user.role === "moderator" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-6 py-4 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 transition-all group"
            >
              <div className="flex items-center gap-4 text-yellow-500">
                <Shield size={18} />
                <span className="text-[11px] uppercase tracking-widest">
                  Moderator Panel
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-yellow-900 group-hover:text-yellow-500 transition-colors"
              />
            </Link>
          )}

          <div className="h-px bg-neutral-900/50 my-2 mx-6" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-3xl text-neutral-600 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer group"
          >
            <LogOut
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-[11px] uppercase tracking-widest">
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
      size={14}
      className="text-neutral-800 group-hover:text-white group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default UserModal;
