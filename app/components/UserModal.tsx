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
        className="relative w-full max-w-[400px] bg-neutral-950 border-2 border-neutral-900 rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b-2 border-neutral-900">
          <span className="text-[12px] font-black tracking-[0.4em] text-neutral-600">
            Account Menu
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-neutral-900 border-2 border-neutral-800 rounded-full text-neutral-500 hover:text-white hover:border-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-10 flex flex-col items-center">
          <div className="relative w-28 h-28 mb-6">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-neutral-800 p-1 bg-neutral-900">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  fill
                  className="object-cover"
                  alt="Identity avatar"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-neutral-950 border-2 border-neutral-900 p-2 rounded-2xl">
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
            <p className="text-[14px] font-black tracking-[0.3em] text-neutral-700 mb-2">
              {getGreetingTime()}
            </p>
            <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">
              {user.nickname}
            </h2>
            <span className="text-neutral-500 text-[11px] font-black tracking-widest bg-neutral-900 px-4 py-1 rounded-full border border-neutral-800">
              @{user.username}
            </span>
          </div>
        </div>

        <div className="px-10 pb-6 flex items-center justify-center">
          <span
            className={`flex items-center px-4 py-2 bg-neutral-900 border-2 border-neutral-800 rounded-xl text-[10px] uppercase font-black tracking-widest ${
              user.role === "admin"
                ? "adminColor"
                : user.role === "moderator"
                  ? "moderatorColor"
                  : user.role === "writer"
                    ? "writerColor"
                    : "userColor"
            }`}
          >
            <Shield size={16} className="mr-2" /> {user.role}
          </span>
        </div>

        <div className="px-4 pb-8 flex flex-col gap-2">
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
              className="flex items-center justify-between px-8 py-6 rounded-4xl bg-neutral-950 border-2 border-neutral-900 hover:border-red-500 transition-all group"
            >
              <div className="flex items-center gap-4 adminColor">
                <LayoutDashboard size={20} />
                <span className="text-[12px] font-black tracking-widest">
                  Admin Panel
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-neutral-800 group-hover:text-red-500 group-hover:translate-x-1 transition-all"
              />
            </Link>
          )}

          {user.role === "moderator" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between px-8 py-6 rounded-4xl bg-neutral-950 border-2 border-neutral-900 hover:border-yellow-500 transition-all group"
            >
              <div className="flex items-center gap-4 moderatorColor">
                <Shield size={20} />
                <span className="text-[12px] font-black tracking-widest">
                  Moderator Panel
                </span>
              </div>
              <ChevronRight
                size={20}
                className="text-neutral-800 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all"
              />
            </Link>
          )}

          <div className="h-px bg-neutral-900 my-4 mx-6" />

          <button
            onClick={handleLogout}
            className="flex items-center justify-between px-8 py-6 rounded-4xl text-neutral-600 hover:text-white hover:bg-red-600/10 transition-all group"
          >
            <div className="flex items-center gap-4">
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[12px] font-black tracking-widest">
                Sign Out
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
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
    className="group flex items-center justify-between px-8 py-6 rounded-4xl bg-neutral-950 border-2 border-neutral-900 hover:border-white transition-all"
  >
    <div className="flex items-center gap-4 text-neutral-500 group-hover:text-white transition-colors">
      <span className="text-neutral-800 group-hover:text-cyan-500 transition-colors">
        {icon}
      </span>
      <span className="text-[12px] font-black tracking-[0.2em]">{label}</span>
    </div>
    <ChevronRight
      size={20}
      className="text-neutral-900 group-hover:text-white group-hover:translate-x-1 transition-all"
    />
  </Link>
);

export default UserModal;
