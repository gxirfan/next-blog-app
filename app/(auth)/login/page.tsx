"use client";

import { useState, useEffect, use } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import {
  User,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const resolvedSearchParams = use(searchParams);
  const redirectPath = resolvedSearchParams.redirect;

  useEffect(() => {
    if (user && !isLoading) {
      if (user.status !== "active") {
        router.push("/restricted");
        return;
      }
      if (
        redirectPath &&
        !["/login", "/", "/register", "/forgot-password"].includes(redirectPath)
      )
        router.push(redirectPath);
      else router.push("/");
    }
  }, [user, isLoading, router, redirectPath]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 transition-all duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-cyan-500/5 rounded-full animate-ping duration-[3s]" />

            <div className="w-10 h-10 border-2 border-neutral-900 border-t-cyan-500 rounded-full animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              Loading Profile
            </span>
            <div className="w-12 h-[1px] bg-neutral-900 rounded-full overflow-hidden">
              <div className="w-full h-full bg-cyan-500/40 animate-[loading-bar_2s_infinite_ease-in-out]" />
            </div>
          </div>
        </div>
      </div>
    );

    // Note: Add this to tailwind.config.js or a global CSS file for the progress bar:
    // keyframes: {
    //   'loading-bar': {
    //     '0%': { transform: 'translateX(-100%)' },
    //     '100%': { transform: 'translateX(100%)' }
    //   }
    // }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.data as IUserResponse);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLING =
    "w-full h-16 pl-16 pr-6 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-[15px] text-white font-semibold placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 appearance-none";

  const LABEL_STYLING =
    "text-[12px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-6 mb-2 block";

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-[#050505] border-2 border-neutral-900 p-10 md:p-16 rounded-[4rem]">
          <div className="flex flex-col items-center gap-6 mb-14">
            <div className="w-20 h-20 flex items-center justify-center bg-neutral-900 border-2 border-neutral-800 rounded-full text-cyan-500">
              <User size={36} strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Welcome
              </h1>
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.3em]">
                Sign in to your account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className={LABEL_STYLING}>Username or Email</label>
              <div className="relative group">
                <Mail
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="username"
                  type="text"
                  placeholder="Your username or email"
                  onChange={handleChange}
                  required
                  autoFocus
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_STYLING}>Password</label>
              <div className="relative group">
                <Lock
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-red-500 text-[11px] font-black uppercase tracking-tight">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full pt-4 outline-none group"
            >
              <div
                className={`
                flex items-center justify-center gap-4 h-16 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95
                ${
                  loading
                    ? "bg-neutral-900 text-neutral-700 border-2 border-neutral-800"
                    : "bg-cyan-500 text-black hover:bg-white cursor-pointer"
                }
              `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-14 space-y-8 text-center">
            <Link
              href="/register"
              className="block text-[13px] text-neutral-500 hover:text-white transition-all font-bold uppercase tracking-widest"
            >
              New here? <span className="text-cyan-500">Create account</span>
            </Link>

            <div className="flex items-center justify-center gap-6 pt-6 border-t border-neutral-900">
              <Link
                href="/forgot-password"
                className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-700 hover:text-cyan-500 transition-colors"
              >
                Recover
              </Link>
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <Link
                href="/"
                className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-700 hover:text-neutral-400 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
