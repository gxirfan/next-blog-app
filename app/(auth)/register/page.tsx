"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Globe,
  Lock,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
  Check,
  Loader2,
  ArrowLeft,
  Mail,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";
import { getMinAgeDate } from "@/app/types/validators/min-age-custom.validator";

// DTO Interface (Preserved)
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
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Linear Step Logic: 1: Handle, 2: Email, 3: Identity, 4: Optional, 5: Security
  const [step, setStep] = useState(1);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [confirmPassword, setConfirmPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryData, setRecoveryData] =
    useState<UserResponseWithRecoveryCodesDto | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync state
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Username Check Logic
  useEffect(() => {
    if (formData.username.length < 3) {
      setIsUsernameValid(false);
      setUsernameMessage("");
      return;
    }
    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const { data } = await api.get(`/auth/check-username`, {
          params: { username: formData.username.toLowerCase().trim() },
        });
        const available = data.data.available === true;
        setIsUsernameValid(available);
        setUsernameMessage(
          available ? "Username is available" : "This handle is taken",
        );
      } catch (err) {
        setIsUsernameValid(false);
        setUsernameMessage("Server error");
      } finally {
        setIsChecking(false);
      }
    };
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading, router]);

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") e.preventDefault();
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
    a.download = `RECOVERY_KEYS_${recoveryData.username}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Please accept the terms to continue.");
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
            <span className="text-[13px] font-bold text-neutral-500 tracking-[0.2em]">
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

  // Global Styles
  const INPUT_STYLING =
    "w-full h-16 px-8 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-[15px] text-white font-semibold placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all duration-300 appearance-none";
  const LABEL_STYLING =
    "text-[12px] font-black text-neutral-500 tracking-[0.15em] ml-6 mb-2 block";
  const BUTTON_STYLING =
    "w-full h-16 bg-white text-black rounded-full text-[14px] font-black tracking-[0.2em] transition-all hover:bg-cyan-500 disabled:opacity-10 active:scale-95 flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {!recoveryData ? (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="mb-14 text-center">
              <h1 className="text-5xl md:text-7xl text-white tracking-tighter font-black leading-none">
                Step <span className="text-cyan-500">{step}</span>
              </h1>
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-500 ${step >= s ? "w-8 bg-cyan-500" : "w-4 bg-neutral-900"}`}
                  />
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-neutral-950 border-2 border-neutral-900 p-8 md:p-12 rounded-[4rem] min-h-[400px] flex flex-col justify-center"
            >
              {/* STEP 1: HANDLE */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center">
                  <User className="mx-auto text-cyan-500" size={48} />
                  <div className="space-y-4">
                    <label className={LABEL_STYLING}>
                      Pick your unique handle
                    </label>
                    <div className="relative group">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-600 font-black text-xl pointer-events-none transition-colors group-focus-within:text-cyan-500">
                        @
                      </span>

                      <input
                        name="username"
                        value={formData.username}
                        onKeyDown={handleUsernameKeyDown}
                        placeholder="username"
                        className={
                          INPUT_STYLING + " text-center pl-14 lowercase"
                        }
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />

                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {isChecking ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-neutral-600"
                          />
                        ) : isUsernameValid ? (
                          <Check size={18} className="text-green-500" />
                        ) : null}
                      </div>
                    </div>

                    {usernameMessage && (
                      <p
                        className={`text-[12px] font-black tracking-widest ${isUsernameValid ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isUsernameValid}
                    className={BUTTON_STYLING}
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: EMAIL */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center">
                  <Mail className="mx-auto text-cyan-500" size={48} />
                  <div className="space-y-4">
                    <label className={LABEL_STYLING}>
                      Where can we reach you?
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder="name@example.com"
                      className={INPUT_STYLING + " text-center"}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!emailRegex.test(formData.email)}
                      className={BUTTON_STYLING}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: IDENTITY */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <ShieldCheck className="mx-auto text-cyan-500" size={48} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={LABEL_STYLING}>First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
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
                        value={formData.lastName}
                        placeholder="Doe"
                        className={INPUT_STYLING}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      disabled={!formData.firstName || !formData.lastName}
                      className={BUTTON_STYLING}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: BIRTH DATE */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-center">
                  <Globe className="mx-auto text-cyan-500" size={48} />
                  <div className="space-y-4">
                    <label className={LABEL_STYLING}>When were you born?</label>
                    <input
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      className={INPUT_STYLING + " text-center"}
                      onChange={handleChange}
                      max={getMinAgeDate()}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      disabled={!formData.birthDate}
                      className={BUTTON_STYLING}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: OPTIONAL INFO */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <UserPlus className="mx-auto text-cyan-500" size={48} />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="location"
                      value={formData.location}
                      placeholder="Location"
                      className={INPUT_STYLING}
                      onChange={handleChange}
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      className={`${INPUT_STYLING} appearance-none bg-neutral-950 cursor-pointer ${
                        formData.gender === ""
                          ? "text-neutral-700"
                          : "text-white"
                      }`}
                      onChange={handleChange}
                    >
                      <option
                        value=""
                        disabled
                        className="bg-neutral-950 text-neutral-700"
                      >
                        Select Gender
                      </option>
                      <option
                        value="male"
                        className="bg-neutral-950 text-white"
                      >
                        Male
                      </option>
                      <option
                        value="female"
                        className="bg-neutral-950 text-white"
                      >
                        Female
                      </option>
                      <option
                        value="other"
                        className="bg-neutral-950 text-white"
                      >
                        Other
                      </option>
                    </select>
                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    placeholder="A short bio..."
                    className={INPUT_STYLING + " h-24 py-4 resize-none"}
                    onChange={handleChange}
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className={BUTTON_STYLING}
                    >
                      {!formData.location && !formData.bio
                        ? "Skip"
                        : "Continue"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: SECURITY & SUBMIT */}
              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <Lock className="mx-auto text-cyan-500" size={48} />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Password"
                        className={INPUT_STYLING}
                        onChange={handleChange}
                        required
                      />
                      <input
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        className={INPUT_STYLING}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {!formData.password && !confirmPassword ? (
                        <>
                          <div className="flex items-center gap-2 text-neutral-600 animate-in fade-in duration-500">
                            <ShieldCheck size={14} />
                            <p className="text-[12px] font-black tracking-widest">
                              Must be at least 6 characters.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600 animate-in fade-in duration-500">
                            <ShieldCheck size={14} />
                            <p className="text-[12px] font-black tracking-widest">
                              No strict rules, but a complex password is highly
                              recommended.
                            </p>
                          </div>
                        </>
                      ) : null}

                      {formData.password &&
                        confirmPassword &&
                        formData.password !== confirmPassword && (
                          <p className="text-red-500 text-[12px] font-black tracking-widest text-center animate-in zoom-in-95">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 border-2 border-neutral-900 rounded-[2rem] bg-neutral-950/50">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-6 h-6 rounded-full border-2 border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all"
                    />

                    {/* Legal Links Label */}
                    <label
                      htmlFor="terms"
                      className="text-[12px] font-black text-neutral-500 tracking-widest leading-relaxed cursor-pointer select-none"
                    >
                      I HAVE READ AND AGREE TO THE{" "}
                      <Link
                        href="/terms-of-use"
                        target="_blank"
                        className="text-white hover:text-cyan-500 transition-colors underline underline-offset-4"
                      >
                        TERMS OF USE
                      </Link>
                      ,{" "}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="text-white hover:text-cyan-500 transition-colors underline underline-offset-4"
                      >
                        PRIVACY POLICY
                      </Link>{" "}
                      AND{" "}
                      <Link
                        href="/cookie-policy"
                        target="_blank"
                        className="text-white hover:text-cyan-500 transition-colors underline underline-offset-4"
                      >
                        COOKIE POLICY
                      </Link>
                      .
                    </label>
                  </div>

                  {error && (
                    <div className="text-red-500 text-[12px] font-black tracking-widest text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !termsAccepted ||
                        !formData.password ||
                        formData.password !== confirmPassword
                      }
                      className={BUTTON_STYLING + " bg-cyan-500"}
                    >
                      {loading ? "Processing..." : "Finish"}
                    </button>
                  </div>
                </div>
              )}
            </form>
            {step === 1 && (
              <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-[14px] font-black text-neutral-600 tracking-[0.3em] mb-4">
                  Already have an account?
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-900 rounded-full text-[14px] font-black tracking-[0.2em] text-neutral-500 hover:text-white hover:border-neutral-700 transition-all active:scale-95"
                >
                  <ArrowLeft size={12} className="opacity-50" />
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* RECOVERY CODES VIEW */
          <div className="animate-in zoom-in-95 duration-700 bg-neutral-950 border-2 border-neutral-900 p-12 rounded-[4rem] text-center space-y-10">
            <Lock size={60} className="mx-auto text-cyan-500" />
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Secure Keys
              </h2>
              <p className="bg-red-500/10 text-red-500 text-[13px] font-black py-2 px-4 rounded-full border border-red-500/20 inline-block">
                Store these safely. Only backup.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recoveryData.recoveryCodes.map((code, i) => (
                <div
                  key={i}
                  className="py-4 bg-neutral-950 border-2 border-neutral-900 rounded-2xl font-mono text-cyan-500 text-sm font-black tracking-widest"
                >
                  {code}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadCodes}
                className="flex-1 h-14 bg-neutral-900 text-white rounded-2xl text-[13px] font-black tracking-[0.2em] border-2 border-neutral-800 hover:bg-neutral-800 flex items-center justify-center gap-2"
              >
                <Download size={16} /> Save
              </button>
              <button
                onClick={handleCopyCodes}
                className="flex-1 h-14 bg-neutral-800 text-neutral-300 rounded-2xl text-[13px] font-black tracking-[0.2em] border-2 border-neutral-700 hover:bg-neutral-700 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}{" "}
                Copy
              </button>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full h-16 bg-cyan-500 text-black rounded-full text-[13px] font-black tracking-[0.2em] hover:bg-white flex items-center justify-center gap-3"
            >
              I'm Secured <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
