"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Fingerprint,
  User,
  Globe,
  ChevronRight,
  XCircle,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";

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

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State to hold the recovery codes after success
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

      const response = await api.post<UserResponseWithRecoveryCodesDto>(
        "/auth/register",
        submissionData,
      );

      // Instead of direct redirect, show recovery codes
      setRecoveryData(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-600 text-[10px] uppercase tracking-[0.3em]">
        <Loader2 className="animate-spin mr-3 text-cyan-500" size={18} />
        Synchronizing_Registry...
      </div>
    );
  }

  const INPUT_STYLING =
    "w-full px-6 py-4 bg-[#0d0d0d] border border-neutral-800 rounded-2xl text-[13px] text-white font-medium placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none";
  const LABEL_STYLING =
    "text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-3 block font-black";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-24 px-6 relative overflow-hidden">
      <div className="w-full max-w-4xl">
        {!recoveryData ? (
          /* --- STAGE 1: IDENTITY INITIALIZATION FORM --- */
          <div className="animate-in fade-in duration-700">
            <div className="mb-16 border-b border-neutral-900 pb-10">
              <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                <ShieldCheck size={14} />
                System Entry Point
              </div>
              <h1 className="text-5xl text-white tracking-tighter uppercase font-black leading-none">
                Initialize{" "}
                <span className="text-neutral-400 font-light">Identity</span>
              </h1>
              <p className="text-neutral-700 text-[9px] uppercase tracking-[0.5em] mt-4">
                Establishing New Node in Global Grid
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Section: Access Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="col-span-full flex items-center gap-3 text-neutral-500 border-l-2 border-cyan-500/30 pl-4">
                  <Fingerprint size={16} />
                  <h2 className="text-[11px] uppercase tracking-widest font-bold">
                    Security Keys
                  </h2>
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="handle"
                    className={INPUT_STYLING}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Network Mail</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="identity@node.com"
                    className={INPUT_STYLING}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Access Pin</label>
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

              {/* Section: Core Identity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-full flex items-center gap-3 text-neutral-500 border-l-2 border-cyan-500/30 pl-4">
                  <User size={16} />
                  <h2 className="text-[11px] uppercase tracking-widest font-bold">
                    Identity Data
                  </h2>
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>First Name</label>
                  <input
                    name="firstName"
                    type="text"
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
                    className={INPUT_STYLING}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Birth Epoch</label>
                  <input
                    name="birthDate"
                    type="date"
                    className={`${INPUT_STYLING} uppercase text-[10px]`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section: Environment */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-neutral-500 border-l-2 border-cyan-500/30 pl-4">
                  <Globe size={16} />
                  <h2 className="text-[11px] uppercase tracking-widest font-bold">
                    Contextual Data
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Node Location</label>
                    <input
                      name="location"
                      type="text"
                      placeholder="City, Country"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL_STYLING}>Gender Assignment</label>
                    <select
                      name="gender"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-black">
                        UNSPECIFIED
                      </option>
                      <option value="male" className="bg-black">
                        MALE
                      </option>
                      <option value="female" className="bg-black">
                        FEMALE
                      </option>
                      <option value="other" className="bg-black">
                        OTHER
                      </option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Biography Fragment</label>
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder="System narrative..."
                    className={`${INPUT_STYLING} resize-none pt-5 h-24`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-neutral-900/20 border border-neutral-900 rounded-2xl group transition-all hover:border-neutral-800">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-md border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed cursor-pointer select-none"
                >
                  I acknowledge the{" "}
                  <Link href="/terms" className="text-cyan-500 hover:underline">
                    Terms of Use
                  </Link>{" "}
                  and the{" "}
                  <Link
                    href="/privacy"
                    className="text-cyan-500 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . Data synchronization is final.
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                  <XCircle size={16} /> <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-12 border-t border-neutral-900">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-700 hover:text-white transition-all group font-black"
                >
                  Existing Identity?{" "}
                  <span className="text-cyan-500">Log_In</span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all
                    ${loading || !termsAccepted ? "bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800" : "bg-white text-black hover:bg-cyan-400 active:scale-95 border border-white"}
                  `}
                >
                  {loading ? "Establishing..." : "Register Node"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* --- STAGE 2: RECOVERY CODE SHIELD PROTOCOL --- */
          <div className="animate-in zoom-in-95 fade-in duration-700">
            <div className="p-10 bg-neutral-900/10 border border-cyan-500/20 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />

              <div className="relative z-10 space-y-10">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl text-cyan-500 border border-cyan-500/20 mb-2">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    Security{" "}
                    <span className="text-neutral-500 font-light">
                      Handover
                    </span>
                  </h2>
                  <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.4em]">
                    {/* Node_Identifier: {recoveryData.id} */}
                  </p>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Critical_Security_Notice
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed uppercase tracking-widest font-medium">
                    Account initialization is complete. If you lose access to
                    your <span className="text-white">Network Mail</span> and
                    these <span className="text-white">Recovery Codes</span>,
                    {process.env.NEXT_PUBLIC_PROJECT_NAME} cannot restore your
                    node.{" "}
                    <span className="text-red-500 font-bold underline">
                      This is your only backup.
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {recoveryData.recoveryCodes.map((code, index) => (
                    <div
                      key={index}
                      className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[12px] text-cyan-400 text-center tracking-widest font-black hover:border-cyan-500/50 transition-colors"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <button
                    onClick={handleDownloadCodes}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all active:scale-95"
                  >
                    <Download size={16} /> Save_As_Fragment.txt
                  </button>

                  <button
                    onClick={handleCopyCodes}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-neutral-900 text-neutral-300 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 border border-neutral-800 transition-all active:scale-95"
                  >
                    {copied ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copied ? "Copied_to_Buffer" : "Copy_Fragments"}
                  </button>
                </div>

                <div className="pt-8 border-t border-neutral-900">
                  <button
                    onClick={() => router.push("/login")}
                    className="
      w-full relative group flex items-center justify-center gap-4 px-10 py-5 rounded-2xl 
      bg-neutral-100 text-neutral-900 border border-white
      hover:bg-cyan-400 hover:text-black hover:border-cyan-300
      transition-all duration-500 cursor-pointer 
      text-[11px] font-black uppercase tracking-[0.3em]
      active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.05)]
      hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]
    "
                  >
                    {/* Side Accent Line */}
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-cyan-600 rounded-r-full" />

                    <span className="relative z-10">
                      I have secured my access keys
                    </span>

                    <ChevronRight
                      size={16}
                      strokeWidth={3}
                      className="group-hover:translate-x-2 transition-transform duration-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
