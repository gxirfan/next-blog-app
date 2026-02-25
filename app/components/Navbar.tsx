"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import UserModal from "./UserModal";
import { getGreetingTime } from "./UserModal";
import {
  Loader,
  MessageSquare,
  Layers,
  X,
  Tag,
  Shield,
  LogInIcon,
  Search,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { ENV } from "@/config/env.config";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStaticMenuOpen, setIsStaticMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <header className="fixed top-0 w-full z-50 p-4">
        <div className="max-w-7xl mx-auto h-16 bg-neutral-950/50 backdrop-blur-2xl border border-neutral-800/40 rounded-full flex items-center justify-center">
          <Loader size={20} className="animate-spin text-cyan-500" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 p-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <nav className="relative max-w-6xl mx-auto h-14 bg-neutral-950 border border-neutral-900 rounded-full px-2 flex justify-between items-center">
          {/* search bar */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-30">
            <form
              onSubmit={handleSearch}
              className={`absolute inset-0 bg-neutral-950 pointer-events-auto flex items-center px-4 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isSearchOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              <Search size={18} className="text-cyan-500 ml-2" />
              <input
                ref={searchInputRef}
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the stream..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-jetbrains-mono text-white px-4 placeholder:text-neutral-700"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-neutral-900 rounded-full text-neutral-500 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </form>
          </div>
          {/* LEFT SECTION: Context & Branding */}
          <div
            className={`flex items-center gap-2 ${isSearchOpen ? "opacity-0 invisible sm:opacity-100 sm:visible" : "opacity-100 visible"}`}
          >
            <div className="relative">
              <button
                onClick={() => setIsStaticMenuOpen(!isStaticMenuOpen)}
                className={`
              relative w-10 h-10 rounded-full flex items-center justify-center 
              transition-all duration-300 ease-in-out cursor-pointer active:scale-90
              ${
                isStaticMenuOpen
                  ? "bg-cyan-500 text-black"
                  : "text-neutral-500 hover:bg-neutral-900 hover:text-white border border-transparent hover:border-neutral-800"
              }
            `}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  {/* Upper Line */}
                  <span
                    className={`absolute h-0.5 bg-current transition-all duration-300 ease-out rounded-full ${
                      isStaticMenuOpen
                        ? "w-5 rotate-45 translate-y-0"
                        : "w-5 -translate-y-1.5"
                    }`}
                  />

                  {/* Middle Line (Fades out when open) */}
                  <span
                    className={`absolute h-0.5 bg-current transition-all duration-200 rounded-full ${
                      isStaticMenuOpen ? "w-0 opacity-0" : "w-4 opacity-100"
                    }`}
                  />

                  {/* Lower Line */}
                  <span
                    className={`absolute h-0.5 bg-current transition-all duration-300 ease-out rounded-full ${
                      isStaticMenuOpen
                        ? "w-5 -rotate-45 translate-y-0"
                        : "w-5 translate-y-1.5"
                    }`}
                  />
                </div>
              </button>

              {isStaticMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStaticMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-3 w-56 bg-neutral-950 border border-neutral-900 rounded-3xl p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-0.5">
                      {/* <MenuLink
                        href="#"
                        icon={<Search size={16} />}
                        label="Search"
                        onClick={() => {
                          setIsSearchOpen(true);
                          setIsStaticMenuOpen(false);
                        }}
                      ></MenuLink> */}
                      <MenuLink
                        href="/post/all"
                        icon={<MessageSquare size={16} />}
                        label={`${ENV.POST_TYPE}s`}
                        onClick={() => setIsStaticMenuOpen(false)}
                      />
                      <MenuLink
                        href="/topic/all"
                        icon={<Layers size={16} />}
                        label="Topics"
                        onClick={() => setIsStaticMenuOpen(false)}
                      />
                      <MenuLink
                        href="/tag/all"
                        icon={<Tag size={16} />}
                        label="Tags"
                        onClick={() => setIsStaticMenuOpen(false)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href="/" className="px-2 flex items-center gap-2.5 group">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[18px] font-black tracking-tighter text-cyan-500 border-b-2 border-transparent hover:border-cyan-500 transition-colors">
                {ENV.PROJECT_NAME}
              </span>
              {ENV.VERSION_TEST && (
                <span
                  className={`text-[8px] uppercase px-1.5 py-0.5 rounded border font-black ${
                    ENV.VERSION_TEST === "alpha"
                      ? "border-red-900 text-red-500"
                      : "border-yellow-900 text-yellow-500"
                  }`}
                >
                  {ENV.VERSION_TEST}
                </span>
              )}
            </Link>
            {/* GREETING */}
            <div className="hidden md:flex flex-col items-end pr-3 border-r border-neutral-900 mr-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                {getGreetingTime()}
              </span>
            </div>
          </div>

          {/* RIGHT SECTION: Intelligence & Profile */}
          <div className="flex items-center gap-2">
            {/* SEARCH TRIGGER BUTTON */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all active:scale-90 cursor-pointer"
            >
              <Search size={18} />
            </button>
            {user ? (
              <>
                <NotificationDropdown />

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-3.5 p-1 bg-neutral-900/50 border border-neutral-800 rounded-full hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer group active:scale-[0.98] transition-all duration-100 ease-[cubic-bezier(0.23,1,0.32,1)]"
                >
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-800 bg-neutral-950">
                      <Image
                        src={
                          user.avatar
                            ? `${ENV.API_IMAGE_URL}${user.avatar}`
                            : `${ENV.API_IMAGE_URL}/images/user/avatars/default-avatar.png`
                        }
                        alt={user.nickname}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 pt-0.5">
                    {/* Nickname */}
                    <span className="text-[14px] font-black text-neutral-200 tracking-tighter leading-none">
                      {user.nickname}
                    </span>

                    {/* Vertical Separator */}
                    <div className="h-3 w-px bg-neutral-800" />

                    {/* Role: Pure Text-Based */}
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none pr-2 ${
                        user.role === "admin"
                          ? "adminColor"
                          : user.role === "moderator"
                            ? "moderatorColor"
                            : user.role === "writer"
                              ? "writerColor"
                              : "userColor"
                      }`}
                    >
                      <Shield size={20} />
                    </span>
                  </div>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors flex items-center gap-1"
              >
                <LogInIcon size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

const MenuLink = ({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-neutral-400 tracking-wider capitalize hover:text-white hover:bg-white/3 rounded-3xl transition-all group"
  >
    <span className="text-neutral-600 group-hover:text-cyan-400 transition-colors">
      {icon}
    </span>
    {label}
  </Link>
);

export default Navbar;
