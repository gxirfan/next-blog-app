"use client";
import { useState } from "react";
import api from "@/api/axios";
import RecoveryCodesModal from "./RecoveryCodesModal";
import {
  ShieldAlert,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const RecoveryCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);

  const handleGenerateCodes = async () => {
    setIsLoading(true);
    setError(null);
    setNewCodes(null);

    try {
      const response = await api.patch("/user/new-recovery-codes");
      const codes = response.data.data || response.data;

      if (Array.isArray(codes) && codes.length > 0) {
        setNewCodes(codes);
        setRecoveryModalOpen(true);
      } else {
        setError("Codes could not be generated, response was empty.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Request failed. Please try again.";
      setError(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-neutral-950 p-8 border border-neutral-900 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-neutral-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black border border-neutral-800 rounded-xl text-red-500">
                <ShieldAlert size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Account Recovery Keys
                </h3>
                <p className="text-[10px] font-black text-neutral-600 tracking-[0.2em] mt-0.5">
                  Emergency Access System
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-neutral-400 leading-relaxed max-w-2xl">
              If you lose access to your primary account, these one-time codes
              will be your only way to recover your profile.
              <span className="block mt-2 text-neutral-500 text-xs">
                Note: Generating new keys will permanently invalidate any
                existing ones.
              </span>
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerateCodes}
              disabled={isLoading}
              className="
              w-full md:w-auto
              flex items-center justify-center gap-4 
              px-10 py-5 
              bg-neutral-900 border border-neutral-800 
              rounded-xl 
              text-[11px] font-black tracking-widest text-neutral-300
              hover:bg-white hover:text-black hover:border-white
              transition-all duration-300 cursor-pointer 
              active:scale-95 disabled:opacity-20
            "
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-cyan-500" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Renew Recovery Keys</span>
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-lg text-red-400 text-[10px] font-bold tracking-widest animate-in slide-in-from-top-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {recoveryModalOpen && newCodes && (
        <RecoveryCodesModal
          codes={newCodes}
          onClose={() => setRecoveryModalOpen(false)}
        />
      )}
    </>
  );
};

export default RecoveryCard;
