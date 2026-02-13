"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ShieldAlert,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  UserCircle2,
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
        msg: "IDENTITY_RESTORED: Your password has been updated. Redirecting to login...",
      });

      // Redirect to login after 2.5 seconds
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Protocol Failure: Invalid credentials.";
      setStatus({
        type: "error",
        msg: Array.isArray(message) ? message[0] : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLING =
    "w-full px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[13px] text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none";
  const LABEL_STYLING =
    "text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3 block font-black";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Protocol */}
        <div className="mb-12 text-center">
          <div className="inline-flex p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500 mb-6">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-4xl text-white font-black uppercase tracking-tighter leading-none mb-4">
            Recovery{" "}
            <span className="text-neutral-500 font-light">Protocol</span>
          </h1>
          <p className="text-neutral-600 text-[9px] font-mono uppercase tracking-[0.4em]">
            Emergency Identity Restoration Access
          </p>
        </div>

        <div className="bg-neutral-900/10 border border-neutral-900 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm relative">
          {status && (
            <div
              className={`mb-8 p-5 rounded-2xl border flex items-center gap-4 animate-in zoom-in-95 duration-300 ${
                status.type === "success"
                  ? "bg-green-500/5 border-green-500/20 text-green-400"
                  : "bg-red-500/5 border-red-500/20 text-red-500"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {status.msg}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={LABEL_STYLING}>User Handle</label>
                <div className="relative">
                  <UserCircle2
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700"
                    size={16}
                  />
                  <input
                    name="username"
                    type="text"
                    required
                    placeholder="USERNAME"
                    className={`${INPUT_STYLING} pl-14`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={LABEL_STYLING}>Recovery Fragment</label>
                <div className="relative">
                  <KeyRound
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700"
                    size={16}
                  />
                  <input
                    name="recoveryCode"
                    type="text"
                    required
                    placeholder="CODE_8_CHARS"
                    className={`${INPUT_STYLING} pl-14 font-mono tracking-widest`}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-900 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={LABEL_STYLING}>New Access Password</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={INPUT_STYLING}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className={LABEL_STYLING}>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={INPUT_STYLING}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || status?.type === "success"}
              className={`
                w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3
                ${
                  loading || status?.type === "success"
                    ? "bg-neutral-900 text-neutral-700 border border-neutral-800 cursor-not-allowed"
                    : "bg-white text-black hover:bg-cyan-400 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-pointer"
                }
              `}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : status?.type === "success" ? (
                "Redirecting..."
              ) : (
                <>
                  Execute_Reset <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700 hover:text-white transition-all group"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Abort & Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
