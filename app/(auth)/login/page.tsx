"use client";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserProfile } from "@/app/context/AuthContext";
import Link from "next/link";
import {
  User,
  Lock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  useEffect(() => {
    const redirectPath = searchParams.get("redirect");
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
  }, [user, isLoading, router, searchParams]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 font-mono text-neutral-600 text-[10px] uppercase tracking-[0.4em]">
        <Loader2 className="animate-spin mr-3 text-cyan-500" size={18} />
        Synchronizing Identity...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.data as UserProfile);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-neutral-950 relative overflow-hidden">
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in duration-700">
        {/* Main Card - No Shadow, Sharp Borders */}
        <div className="bg-[#0d0d0d] border border-neutral-900 p-10 md:p-12 rounded-[2.5rem]">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-[1.8rem] text-cyan-400">
              <ShieldCheck size={36} strokeWidth={2.5} />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Identity
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-4 bg-neutral-800" />
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
                  {process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog"} Protocol
                </p>
                <div className="h-px w-4 bg-neutral-800" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username Field */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 ml-4 font-black">
                Identifier Node
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-400 transition-colors"
                />
                <input
                  name="username"
                  type="text"
                  placeholder="USERNAME / EMAIL"
                  onChange={handleChange}
                  required
                  autoFocus
                  className="h-16 w-full pl-14 pr-6 bg-[#0a0a0a] border border-neutral-800 rounded-2xl text-white font-bold text-[13px] placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-black">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  tabIndex={-1}
                  className="text-[11px] px-2 py-1 bg-neutral-900 border border-neutral-800 uppercase tracking-widest text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-bold"
                >
                  [ RECOVER ]
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-400 transition-colors"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="h-16 w-full pl-14 pr-6 bg-[#0a0a0a] border border-neutral-800 rounded-2xl text-white font-bold text-[13px] placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] uppercase tracking-widest font-bold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Button - High Contrast, No Shadow */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group pt-4 outline-none"
            >
              <div
                className={`
                  relative flex items-center justify-center gap-4 h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300
                  ${
                    loading
                      ? "bg-neutral-900 text-neutral-700 border border-neutral-800"
                      : "bg-white text-black hover:bg-cyan-400 active:scale-[0.98] border border-white"
                  }
                `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Authorize Access</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={3}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer - Upright & Flat */}
          <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col gap-6 text-center">
            <Link
              href="/register"
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all font-medium"
            >
              No account detected?{" "}
              <span className="text-cyan-400 font-black underline underline-offset-4">
                Create NEW
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-neutral-400 transition-all font-bold"
            >
              Resume Guest Protocol <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
