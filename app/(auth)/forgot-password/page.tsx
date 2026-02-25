"use client";
import { useState } from "react";
import api from "@/api/axios";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Check,
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

  // Design tokens aligned with your shared layout components
  const inputStyles =
    "w-full px-6 py-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 font-medium";

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

  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 px-4">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative">
        <div className="bg-neutral-950 border border-neutral-800/50 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl">
          {/* Header Section */}
          <div className="mb-10">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
              {isSuccess ? (
                <ShieldCheck className="text-cyan-400" size={24} />
              ) : (
                <KeyRound className="text-cyan-400" size={24} />
              )}
            </div>
            <h1 className="text-3xl text-white tracking-tighter leading-tight mb-2">
              {isSuccess ? "Reset Password" : "Forgot Password"}
            </h1>
            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
              {isSuccess
                ? "Enter the 6-digit code sent to your email and choose a new secure password."
                : "No worries, it happens. Enter your details and we'll send you a recovery code."}
            </p>
          </div>

          <form
            onSubmit={isSuccess ? handlePasswordReset : handleCodeRequest}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] text-neutral-600 ml-2">
                Identity Information
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Email or username"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  required
                  className={`${inputStyles} ${
                    isSuccess
                      ? "opacity-50 cursor-not-allowed bg-neutral-950"
                      : ""
                  }`}
                  disabled={loading || isSuccess}
                />
                {!isSuccess && (
                  <Mail
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-cyan-500/50 transition-colors"
                    size={18}
                  />
                )}
              </div>
            </div>

            {isSuccess && (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-neutral-600 ml-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className={`${inputStyles} text-center tracking-[0.5em] font-mono text-cyan-400`}
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-neutral-600 ml-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={inputStyles}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-neutral-600 ml-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputStyles}
                  />
                </div>
              </div>
            )}

            {/* Dynamic Status Message */}
            {status && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold tracking-tight border animate-in zoom-in-95 duration-200 ${
                  status.startsWith("✅")
                    ? "bg-green-500/5 border-green-500/20 text-green-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                }`}
              >
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || passwordResetSuccess}
              className="relative w-full group overflow-hidden cursor-pointer"
            >
              {/* Outer Container with Glow effect on hover */}
              <div
                className="relative flex items-center justify-center gap-2 px-6 py-4 
    bg-neutral-900 border border-neutral-800 
    text-white tracking-widest text-[12px] 
    rounded-2xl transition-all duration-300
    group-hover:border-cyan-500/50 group-hover:bg-neutral-900/80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="text-neutral-500">Processing...</span>
                  </div>
                ) : passwordResetSuccess ? (
                  <div className="flex items-center gap-3 text-cyan-500 animate-in fade-in zoom-in duration-300">
                    <Check size={14} strokeWidth={3} />
                    <span className="font-bold tracking-widest text-[12px]">
                      Password Reset Successful
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="group-hover:text-cyan-400 transition-colors">
                      Send Recovery Code
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-neutral-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
                    />
                  </>
                )}
              </div>
            </button>

            <Link
              href="/recover-password"
              className="flex items-center justify-center text-[12px] tracking-[0.2em] text-neutral-500 hover:text-cyan-400 transition-colors pt-2 hover:underline cursor-pointer"
            >
              <span>Try another method</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[12px] tracking-[0.2em] text-neutral-500 hover:text-cyan-400 transition-colors pt-4 group"
            >
              <ArrowLeft
                size={12}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
