"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Lock,
  AlertCircle,
  User,
  ArrowRight,
} from "lucide-react";
import api from "@/api/axios";

export default function RecoveryPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    recoveryCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.post("/auth/recover-password", {
        username: formData.username,
        recoveryCode: formData.recoveryCode,
        newPassword: formData.newPassword,
      });

      setStatus({
        type: "success",
        msg: "IDENTITY_RESTORED: Redirecting to login...",
      });

      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      const message = err.response?.data?.message || "Protocol Failure.";
      setStatus({
        type: "error",
        msg: Array.isArray(message) ? message[0] : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLING =
    "w-full h-16 pl-16 pr-6 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-[15px] text-white font-semibold placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 appearance-none";

  const LABEL_STYLING =
    "text-[13px] font-black text-neutral-400 tracking-[0.15em] ml-6 mb-2 block uppercase";

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-[#050505] border-2 border-neutral-900 p-10 md:p-16 rounded-[4rem]">
          <div className="flex flex-col items-center gap-6 mb-14">
            <div className="w-20 h-20 flex items-center justify-center bg-neutral-900 border-2 border-neutral-800 rounded-full text-cyan-500">
              <KeyRound size={36} strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                Recover
              </h1>
              <p className="text-xs font-bold text-neutral-500 tracking-[0.3em] uppercase">
                Account Restoration Protocol
              </p>
            </div>
          </div>

          {status && (
            <div
              className={`mb-8 p-5 border-2 rounded-[2.5rem] flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                status.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="text-xs font-black tracking-tight">
                {status.msg}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={LABEL_STYLING}>Username</label>
              <div className="relative group">
                <User
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="username"
                  type="text"
                  placeholder="Your handle"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_STYLING}>Recovery Code</label>
              <div className="relative group">
                <Lock
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="recoveryCode"
                  type="text"
                  placeholder="8-digit key"
                  value={formData.recoveryCode}
                  onChange={handleChange}
                  required
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_STYLING}>New Password</label>
              <div className="relative group">
                <Lock
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_STYLING}>Confirm</label>
              <div className="relative group">
                <Lock
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors"
                />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={INPUT_STYLING}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full pt-4 outline-none group"
            >
              <div
                className={`flex items-center justify-center gap-4 h-16 rounded-full text-sm font-black tracking-[0.2em] transition-all duration-300 active:scale-95 uppercase ${
                  loading
                    ? "bg-neutral-900 text-neutral-700 border-2 border-neutral-800"
                    : "bg-cyan-500 text-black hover:bg-white cursor-pointer"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Execute Reset</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-14 text-center">
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-neutral-900">
              <Link
                href="/login"
                className="text-sm font-black tracking-[0.2em] text-neutral-700 hover:text-white transition-colors flex items-center gap-2 group uppercase"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Abort & Return
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
