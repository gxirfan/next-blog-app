"use client";

import { useState } from "react";
import api from "@/api/axios";
import {
  X,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import React from "react";

interface PasswordModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const MIN_LENGTH = 6;

const LABEL_STYLING =
  "text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3 block font-black";
const INPUT_STYLING =
  "w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white font-bold placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all";

const PasswordModal = ({ onClose, onSuccess }: PasswordModalProps) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword.length < MIN_LENGTH) {
      setError(`New password must be at least ${MIN_LENGTH} characters.`);
      setLoading(false);
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };

      await api.patch("/user/update-password", payload);

      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Update failed.";
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-xl bg-neutral-950 border-2 border-neutral-900 rounded-[3.5rem] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-10 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-neutral-900 rounded-3xl flex items-center justify-center text-cyan-500 border border-neutral-800">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                Security
              </h3>
              <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest mt-1">
                Update your password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-neutral-900 text-neutral-600 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 pt-4">
          {success ? (
            <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto border-2 border-green-500/20">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                  Updated
                </h3>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
                  Your credentials are now secure.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-12 py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-cyan-500 transition-all active:scale-95"
              >
                Back to Settings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className={LABEL_STYLING}>Current Password</label>
                <input
                  name="oldPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={INPUT_STYLING}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    placeholder="MIN 6 CHARS"
                    className={INPUT_STYLING}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className={LABEL_STYLING}>Confirm</label>
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

              <div className="flex items-center gap-3 px-2 text-neutral-600">
                <ShieldCheck size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Use a complex password for maximum safety.
                </p>
              </div>

              {error && (
                <div className="p-5 rounded-full bg-red-500/10 border-2 border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-tight flex items-center gap-3 animate-in fade-in">
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-10 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[12px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3 ${
                    loading
                      ? "bg-neutral-900 text-neutral-700"
                      : "bg-cyan-500 text-black hover:bg-white"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Update <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
