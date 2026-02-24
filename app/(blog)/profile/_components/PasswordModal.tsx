"use client";

import { useState } from "react";
import api from "@/api/axios";
import {
  Key,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import React from "react";

interface PasswordModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const MIN_LENGTH = 6;

// Tasarım diline uygun input ve label stilleri
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
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-[3rem] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-neutral-900 bg-neutral-950">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-cyan-500">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-urbanist text-xl text-white uppercase tracking-tighter font-black">
                Security Core
              </h3>
              <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1">
                Protocol: Credential_Update
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {success ? (
            <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="inline-flex p-5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500">
                <CheckCircle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">
                  Sync_Complete
                </h3>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Your identity keys have been updated.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all cursor-pointer"
              >
                Close_Terminal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <label className={LABEL_STYLING}>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    placeholder="MIN_6_CHARS"
                    className={INPUT_STYLING}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className={LABEL_STYLING}>Confirm New Password</label>
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

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] uppercase tracking-widest flex items-center gap-3 animate-in shake duration-300">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-6 pt-6 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-colors cursor-pointer"
                >
                  Abort_Change
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    group relative flex items-center gap-3 px-10 py-4 rounded-2xl 
                    transition-all duration-500 cursor-pointer text-[10px] font-black uppercase tracking-[0.3em]
                    ${
                      loading
                        ? "bg-neutral-900 text-neutral-700 border border-neutral-800 cursor-wait"
                        : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95"
                    }
                  `}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Key size={16} />
                      <span>Execute_Update</span>
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
