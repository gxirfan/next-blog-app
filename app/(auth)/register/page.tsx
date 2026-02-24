"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Fingerprint,
  User,
  Globe,
  ChevronRight,
  XCircle,
  Lock,
  AlertTriangle,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";
import { getMinAgeDate } from "@/app/types/validators/min-age-custom.validator";

// DTO Interface for local use
interface UserResponseWithRecoveryCodesDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  bio: string;
  birthDate: string;
  avatar: string;
  cover: string;
  location: string;
  gender: string;
  isEmailVerified: boolean;
  isEmailPublic: boolean;
  role: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  recoveryCodes: string[];
  // ... other fields can be added if needed for UI
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    location: "",
    gender: "",
    bio: "",
    nickname: "",
  });

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [recoveryData, setRecoveryData] =
    useState<UserResponseWithRecoveryCodesDto | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleCopyCodes = () => {
    if (!recoveryData) return;
    navigator.clipboard.writeText(recoveryData.recoveryCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    if (!recoveryData) return;
    const blob = new Blob([recoveryData.recoveryCodes.join("\n")], {
      type: "text/plain",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RECOVERY_KEYS_${recoveryData.username.toUpperCase()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Protocol violation: You must accept terms of service.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const submissionData = {
        ...formData,
        birthDate: formData.birthDate
          ? new Date(formData.birthDate).toISOString()
          : null,
        gender: formData.gender === "" ? undefined : formData.gender,
      };

      const response = await api.post("/auth/register", submissionData);

      setRecoveryData(response.data.data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 transition-colors duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-cyan-500/5 rounded-full animate-ping duration-[3s]" />

            <div className="w-10 h-10 border-2 border-neutral-900 border-t-cyan-500 rounded-full animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
              Loading Profile
            </span>

            <div className="w-8 h-px bg-neutral-900 rounded-full overflow-hidden">
              <div className="w-full h-full bg-cyan-500/30 animate-[loading-slide_2s_infinite_ease-in-out]" />
            </div>
          </div>
        </div>
      </div>
    );

    /** * Note: Add this to tailwind.config.js for the smooth bar effect:
     * keyframes: {
     * 'loading-slide': {
     * '0%': { transform: 'translateX(-100%)' },
     * '100%': { transform: 'translateX(100%)' }
     * }
     * }
     */
  }

  const INPUT_STYLING =
    "w-full h-16 px-8 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-[15px] text-white font-semibold placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 appearance-none";

  const LABEL_STYLING =
    "text-[12px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-6 mb-2 block";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {!recoveryData ? (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="mb-14 text-center">
              <h1 className="text-5xl md:text-7xl text-white tracking-tighter font-black leading-none uppercase">
                Create <span className="text-neutral-800">Account</span>
              </h1>
              <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.3em] mt-6">
                Join the stream network today
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-12 bg-[#050505] border-2 border-neutral-900 p-8 md:p-16 rounded-[4rem]"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500">
                    <Fingerprint size={20} />
                  </div>
                  <h2 className="text-[13px] uppercase tracking-widest font-black text-white">
                    Security
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Username</label>
                    <input
                      name="username"
                      onKeyDown={handleUsernameKeyDown}
                      type="text"
                      placeholder="username"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="mail@example.com"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Password</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500">
                    <User size={20} />
                  </div>
                  <h2 className="text-[13px] uppercase tracking-widest font-black text-white">
                    Identity
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="John"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Birth Date</label>
                    <input
                      name="birthDate"
                      type="date"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                      max={getMinAgeDate()}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-500">
                    <Globe size={20} />
                  </div>
                  <h2 className="text-[13px] uppercase tracking-widest font-black text-white">
                    Context
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Location</label>
                    <input
                      name="location"
                      type="text"
                      placeholder="City, Country"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Gender</label>
                    <select
                      name="gender"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-neutral-950">
                        Select Gender
                      </option>
                      <option value="male" className="bg-neutral-950">
                        Male
                      </option>
                      <option value="female" className="bg-neutral-950">
                        Female
                      </option>
                      <option value="other" className="bg-neutral-950">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Biography</label>
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder="Tell your story..."
                    className={`${INPUT_STYLING} resize-none h-32 py-5`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-neutral-900 space-y-8">
                <div className="flex items-start gap-4 p-6 bg-neutral-900/30 border-2 border-neutral-900 rounded-[2.5rem] transition-all hover:border-neutral-800">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-6 h-6 rounded-full border-2 border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-[12px] text-neutral-500 font-bold leading-relaxed cursor-pointer select-none"
                  >
                    I AGREE TO THE{" "}
                    <Link
                      href="/terms"
                      className="text-white hover:text-cyan-500 underline underline-offset-4"
                    >
                      TERMS
                    </Link>{" "}
                    AND{" "}
                    <Link
                      href="/privacy"
                      className="text-white hover:text-cyan-500 underline underline-offset-4"
                    >
                      PRIVACY POLICY
                    </Link>
                    .
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-5 bg-red-500/10 border-2 border-red-500/20 rounded-full text-red-500 text-[11px] font-black uppercase tracking-tight animate-in fade-in slide-in-from-top-2">
                    <XCircle size={18} /> <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-[13px] font-black text-neutral-600 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Already have an account?{" "}
                    <span className="text-cyan-500 ml-1">Sign In</span>
                    <ChevronRight size={16} />
                  </Link>

                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className={`px-16 py-5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all active:scale-95
                      ${loading || !termsAccepted ? "bg-neutral-900 text-neutral-700 border-2 border-neutral-800" : "bg-cyan-500 text-black hover:bg-white"}
                    `}
                  >
                    {loading ? "Registering..." : "Create Account"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-700 max-w-2xl mx-auto">
            <div className="p-10 md:p-16 bg-[#050505] border-2 border-neutral-900 rounded-[4rem] text-center space-y-12">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 mx-auto border-2 border-cyan-500/20">
                <Lock size={40} />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                  Security Keys
                </h2>
                <div className="flex items-center justify-center gap-3 p-4 bg-red-500/10 border-2 border-red-500/20 rounded-4xl text-red-500">
                  <AlertTriangle size={18} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-center">
                    Store these safely. This is your only backup.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recoveryData.recoveryCodes.map(
                  (code: string, index: number) => (
                    <div
                      key={index}
                      className="py-5 bg-neutral-950 border-2 border-neutral-900 rounded-2xl font-mono text-cyan-500 text-[15px] font-black tracking-widest"
                    >
                      {code}
                    </div>
                  ),
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleDownloadCodes}
                  className="flex-1 py-5 bg-neutral-900 text-white rounded-full text-[12px] font-black uppercase tracking-widest border-2 border-neutral-800 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Save .txt
                </button>

                <button
                  onClick={handleCopyCodes}
                  className="flex-1 py-5 bg-neutral-800 text-neutral-300 rounded-full text-[12px] font-black uppercase tracking-widest border-2 border-neutral-700 hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                  {copied ? "Copied" : "Copy Codes"}
                </button>
              </div>

              <div className="pt-8 border-t border-neutral-900">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full flex items-center justify-center gap-4 px-10 py-5 rounded-full bg-cyan-500 text-black text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95"
                >
                  <span>I&apos;ve Secured My Keys</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
