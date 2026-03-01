"use client";

import { useState } from "react";
import api from "@/api/axios";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Check,
  ArrowRight,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";

const MIN_PASSWORD_LENGTH = 6;

export default function ForgotPasswordPage() {
  const [loginField, setLoginField] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const handleCodeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api.post("/auth/forgot-password", { loginField });
      setStatus("✅ Email sent successfully! Please check your inbox.");
      setIsSuccess(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "User not found.";
      setStatus(msg);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setStatus(
        `❌ Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("❌ New passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setStatus("✅ Password reset successfully! Redirecting...");
      setPasswordResetSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Password reset failed.";
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLING =
    "w-full h-16 pl-16 pr-6 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-[15px] text-white font-semibold placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 appearance-none";

  const LABEL_STYLING =
    "text-[13px] font-black text-neutral-400 tracking-[0.15em] ml-6 mb-2 block";

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-[#050505] border-2 border-neutral-900 p-10 md:p-16 rounded-[4rem]">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-6 mb-14">
            <div className="w-20 h-20 flex items-center justify-center bg-neutral-900 border-2 border-neutral-800 rounded-full text-cyan-500">
              {isSuccess ? (
                <ShieldCheck size={36} strokeWidth={1.5} />
              ) : (
                <KeyRound size={36} strokeWidth={1.5} />
              )}
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                {isSuccess ? "Reset" : "Forgot"}
              </h1>
              <p className="text-xs font-bold text-neutral-500 tracking-[0.3em]">
                {isSuccess ? "Set new password" : "Recover account"}
              </p>
            </div>
          </div>

          <form
            onSubmit={isSuccess ? handlePasswordReset : handleCodeRequest}
            className="space-y-8"
          >
            {/* Step 1: Login Field */}
            <div className="space-y-2">
              <label className={LABEL_STYLING}>Identity Info</label>
              <div className="relative group">
                <Mail
                  size={20}
                  className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isSuccess ? "text-neutral-800" : "text-neutral-600 group-focus-within:text-cyan-500"}`}
                />
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  disabled={isSuccess || loading}
                  required
                  className={`${INPUT_STYLING} ${isSuccess ? "opacity-40 cursor-not-allowed border-neutral-900" : ""}`}
                />
              </div>
            </div>

            {/* Step 2: Verification & Password Fields */}
            {isSuccess && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Security Code</label>
                  <input
                    type="text"
                    placeholder="6-DIGIT CODE"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    maxLength={6}
                    className={`${INPUT_STYLING} text-center tracking-[0.5em] font-mono pl-6`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={LABEL_STYLING}>New Password</label>
                  <div className="relative group">
                    <Lock
                      size={20}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500"
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className={INPUT_STYLING}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Confirm Password</label>
                  <div className="relative group">
                    <Lock
                      size={20}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500"
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={INPUT_STYLING}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div
                className={`flex items-center gap-3 p-5 border-2 rounded-[2.5rem] text-xs font-black tracking-tight animate-in zoom-in-95 duration-200 ${
                  status.startsWith("✅")
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                }`}
              >
                {status.startsWith("✅") ? (
                  <Check size={18} className="shrink-0" />
                ) : (
                  <AlertCircle size={18} className="shrink-0" />
                )}
                <span>{status}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading || passwordResetSuccess}
              className="w-full pt-4 outline-none group"
            >
              <div
                className={`
                flex items-center justify-center gap-4 h-16 rounded-full text-sm font-black tracking-[0.2em] transition-all duration-300 active:scale-95
                ${
                  loading || passwordResetSuccess
                    ? "bg-neutral-900 text-neutral-700 border-2 border-neutral-800"
                    : "bg-cyan-500 text-black hover:bg-white cursor-pointer"
                }
              `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : passwordResetSuccess ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <>
                    <span>{isSuccess ? "Update Access" : "Send Code"}</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-14 space-y-8 text-center">
            <div className="flex flex-col items-center gap-6 pt-6 border-t border-neutral-900">
              <Link
                href="/login"
                className="text-sm font-black tracking-[0.2em] text-neutral-700 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
