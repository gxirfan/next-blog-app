"use client";
import { ShieldAlert, X, Copy, CheckCircle2 } from "lucide-react";

interface RecoveryCodesModalProps {
  codes: string[];
  onClose: () => void;
}

const RecoveryCodesModal = ({ codes, onClose }: RecoveryCodesModalProps) => {
  // Logic for copying to clipboard (Added to improve UX)
  const copyToClipboard = () => {
    const text = codes.join("\n");
    navigator.clipboard.writeText(text);
    // You could add a toast notification here if you have one
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-110 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-neutral-950 border border-red-900/50 rounded-[2.5rem] p-8 md:p-10 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon - Sharp and simple */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-neutral-600 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header: Critical Warning Style */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <ShieldAlert size={28} strokeWidth={1.5} />
            <div className="h-px w-12 bg-red-900/30" />
          </div>
          <h2 className="text-3xl text-white tracking-tighter uppercase leading-tight">
            New Recovery Grid
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-red-500/70">
            Security Protocol In Effect
          </p>
        </div>

        <p className="text-sm font-medium text-neutral-400 mb-8 leading-relaxed">
          The following codes are your{" "}
          <span className="text-white font-bold">final backup</span>. Store them
          in a physical or offline vault. These will not be displayed again.
        </p>

        {/* Codes Display: Terminal / Matrix Style */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 mb-8 relative group">
          <ul className="grid grid-cols-2 gap-y-4 gap-x-8 text-[13px] text-neutral-100 font-mono tracking-widest">
            {codes.map((code, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-[10px] text-neutral-700  select-none">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="font-bold">{code}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions: Stark Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-700 transition-all cursor-pointer"
          >
            <Copy size={14} />
            Copy All
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-[10px] uppercase tracking-widest text-cyan-500 hover:border-cyan-500/50 hover:bg-neutral-900 transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} />I have saved them
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryCodesModal;
