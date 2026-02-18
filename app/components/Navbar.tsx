"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import UserModal from "./UserModal";
import { getGreetingTime } from "./UserModal";
import {
  User,
  LogIn,
  Loader,
  MessageSquare,
  Layers,
  Menu,
  X,
  ChevronDown,
  Tag,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { ENV } from "@/config/env.config";

const Navbar = () => {
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStaticMenuOpen, setIsStaticMenuOpen] = useState(false);

  // Scroll Logic - Kesintisiz ve akıcı geçiş
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

  if (isLoading) {
    return (
      <header className="fixed top-0 w-full z-50 p-4">
        <div className="max-w-7xl mx-auto h-16 bg-[#0a0a0a]/50 backdrop-blur-2xl border border-neutral-800/40 rounded-full flex items-center justify-center">
          <Loader size={20} className="animate-spin text-cyan-500" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 p-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <nav className="max-w-7xl mx-auto h-16 bg-neutral-950/80 backdrop-blur-2xl border border-white/5 rounded-full px-6 flex justify-between items-center">
        {/* LEFT SECTION: Menu & Logo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsStaticMenuOpen(!isStaticMenuOpen)}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isStaticMenuOpen
                  ? "bg-cyan-500 text-black"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              {isStaticMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Static Menu Dropdown */}
            {isStaticMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsStaticMenuOpen(false)}
                />
                <div className="absolute left-0 mt-4 w-60 bg-neutral-950/95 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-3 z-20 animate-in fade-in zoom-in-95 duration-300">
                  <div className="space-y-1">
                    <MenuLink
                      href="/topic/all"
                      icon={<Layers size={18} />}
                      label="Topics"
                      onClick={() => setIsStaticMenuOpen(false)}
                    />
                    <MenuLink
                      href="/post/all"
                      icon={<MessageSquare size={18} />}
                      label="Posts"
                      onClick={() => setIsStaticMenuOpen(false)}
                    />
                    <MenuLink
                      href="/tag/all"
                      icon={<Tag size={18} />}
                      label="Tags"
                      onClick={() => setIsStaticMenuOpen(false)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/" className="group flex items-center">
            <span className="text-xl font-black tracking-tighter text-cyan-500 group-hover:text-cyan-400 transition-all duration-300 flex">
              {ENV.PROJECT_NAME}
              {ENV.VERSION === "alpha" && (
                <span className="text-sm font-extrabold text-red-500 flex items-start justify-end">
                  Alpha
                </span>
              )}
              {ENV.VERSION === "beta" && (
                <span className="text-sm font-extrabold text-yellow-500 flex items-start justify-end">
                  Beta
                </span>
              )}
            </span>
          </Link>
        </div>

        {/* RIGHT SECTION: User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {" "}
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end leading-none">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1 font-bold">
                  {getGreetingTime()}
                </p>
                <p className="text-xs font-medium text-neutral-400 tracking-tight">
                  @{user.username}
                </p>
              </div>

              <div className="h-8 w-px bg-neutral-800/50 mx-1 hidden md:block" />

              <NotificationDropdown />

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 pl-1.5 pr-1.5 md:pl-2 md:pr-4 py-1.5 bg-neutral-900/40 border border-white/5 rounded-full hover:border-cyan-500/30 transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-8 h-8 bg-linear-to-tr from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center transition-all">
                  <User size={15} className="text-black font-bold" />
                </div>
                <span className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors hidden md:block">
                  {user.nickname}
                </span>
                <ChevronDown
                  size={14}
                  className="text-neutral-600 group-hover:text-cyan-400 transition-transform group-hover:translate-y-0.5 hidden sm:block"
                />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-black rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
            >
              <LogIn size={14} />
              <span className="hidden xs:block">Sign In</span>
            </Link>
          )}
        </div>
      </nav>
      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} />}
    </header>
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
    className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded-[1.5rem] transition-all group"
  >
    <span className="text-neutral-600 group-hover:text-cyan-400 transition-colors">
      {icon}
    </span>
    {label}
  </Link>
);

export default Navbar;
