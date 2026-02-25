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
      <div className="bg-neutral-950 p-8 md:p-10 rounded-[2.5rem] border border-neutral-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-red-500/80">
                <ShieldAlert size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl text-white tracking-tighter">
                Account Recovery Codes
              </h3>
            </div>

            <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-xl">
              In case you lose access to your primary identity keys, these
              one-time codes allow emergency portal access.{" "}
              <span className="text-neutral-400">
                Generating new ones will immediately revoke all previous codes.
              </span>
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerateCodes}
              disabled={isLoading}
              className="group relative flex items-center gap-3 px-8 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-[10px] tracking-[0.2em] text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer active:scale-95 disabled:opacity-30"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-cyan-500" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Renew Recovery Grid</span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-[10px] tracking-widest animate-in fade-in zoom-in-95">
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
