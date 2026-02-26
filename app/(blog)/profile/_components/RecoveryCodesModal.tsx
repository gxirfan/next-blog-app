"use client";
import { useState } from "react";
import {
  ShieldAlert,
  X,
  Copy,
  CheckCircle2,
  Download,
  ArrowRight,
} from "lucide-react";

interface RecoveryCodesModalProps {
  codes: string[];
  onClose: () => void;
}

const RecoveryCodesModal = ({ codes, onClose }: RecoveryCodesModalProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = codes.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([codes.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery-codes.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex justify-center items-center z-300 px-6">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="w-full max-w-2xl bg-neutral-950 border-2 border-neutral-900 rounded-[3.5rem] p-10 md:p-14 relative animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-neutral-600 hover:text-white transition-all cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
            Backup <span className="text-neutral-800">Keys</span>
          </h2>
          <p className="text-[11px] font-black tracking-[0.3em] text-red-500 mt-6">
            Critical: Save these now
          </p>
        </div>

        <p className="text-[15px] font-bold text-neutral-400 mb-10 leading-relaxed tracking-tight">
          These are your <span className="text-white">final access keys</span>.
          If you lose access to your account, these codes are the only way back.
          They will never be shown again.
        </p>

        {/* Codes Display */}
        <div className="bg-neutral-950 border-2 border-neutral-900 rounded-[2.5rem] p-8 mb-10">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            {codes.map((code, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-[10px] font-black text-neutral-700 select-none w-4">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-lg font-black text-cyan-500 tracking-[0.2em]">
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={downloadAsText}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-neutral-900 border-2 border-neutral-800 rounded-full text-xs font-black tracking-widest text-white hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Download size={18} />
            Save .txt
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-neutral-800 border-2 border-neutral-700 rounded-full text-xs font-black tracking-widest text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            {copied ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <Copy size={18} />
            )}
            {copied ? "Copied" : "Copy Codes"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-8 py-6 bg-cyan-500 text-black rounded-full text-[13px] font-black tracking-[0.2em] hover:bg-white transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3"
        >
          I&apos;ve secured my keys <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default RecoveryCodesModal;
