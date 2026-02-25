"use client";
import { useState } from "react";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Tag, Plus, Loader2, ShieldCheck, Sparkles, X } from "lucide-react";

const MIN_LENGTH = 3;

const CreateTagCard = () => {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Modal State
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Renamed to submissionStatus to avoid deprecated conflict
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const router = useRouter();

  const isAuthorized =
    user && (user.role === "admin" || user.role === "moderator");

  if (isLoading || !isAuthorized) return null;

  const handleClose = () => {
    setIsOpen(false);

    // setFormData({ title: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);

    if (
      formData.title.length < MIN_LENGTH ||
      formData.description.length < MIN_LENGTH
    ) {
      setSubmissionStatus({
        type: "error",
        msg: `Min. ${MIN_LENGTH} characters required.`,
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/tags", formData);
      setSubmissionStatus({
        type: "success",
        msg: `Tag ${formData.title} Created!`,
      });
      setFormData({ title: "", description: "" });

      setTimeout(() => {
        handleClose();
        router.refresh();
      }, 1500);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Creation failed.";
      setSubmissionStatus({
        type: "error",
        msg: Array.isArray(errMsg) ? errMsg[0] : errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return ((user && user.role === "admin") ||
    (user && user.role === "moderator")) &&
    !isLoading ? (
    <>
      {/* 1. Industrial Trigger Button */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-end animate-in fade-in slide-in-from-top-4 duration-500">
        <button
          onClick={() => setIsOpen(true)}
          className="
            group relative flex items-center gap-4 px-10 py-4 rounded-2xl 
            bg-neutral-200 text-neutral-900 border border-neutral-300
            hover:bg-white hover:text-black transition-all duration-500 
            cursor-pointer text-[11px] font-black tracking-[0.25em]
            active:scale-[0.97]
          "
        >
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-600/40 rounded-r-full group-hover:bg-cyan-600 transition-all duration-500" />
          <div className="flex items-center justify-center">
            <ShieldCheck
              size={18}
              strokeWidth={3}
              className="text-neutral-900 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="relative z-10">Generate Tag</span>
        </button>
      </div>

      {/* 2. Feedback Banner (Persistent after modal close) */}
      {submissionStatus && (
        <div className="max-w-7xl mx-auto mb-8 px-4">
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
              submissionStatus.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <Sparkles size={18} />
            <span className="font-mono text-[10px] tracking-widest">
              {submissionStatus.msg}
            </span>
          </div>
        </div>
      )}

      {/* 3. Modal Architecture */}
      {isOpen && (
        <div className="fixed inset-0 z-250 h-screen flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            onClick={handleClose}
          />

          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-[3rem] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-neutral-900 bg-neutral-950">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-900 rounded-2xl text-cyan-500">
                  <Tag size={22} />
                </div>
                <div>
                  <h3 className="font-urbanist text-xl text-white tracking-tighter font-black">
                    Tag Architect
                  </h3>
                  <p className="font-mono text-[9px] text-neutral-600 tracking-widest mt-1">
                    Node: Administrative_Control
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-3 rounded-2xl hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 md:p-10">
              {!loading ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 ml-4">
                      Tag Identifier
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700">
                        <Tag size={18} />
                      </div>
                      <input
                        name="title"
                        type="text"
                        placeholder="TAG_TITLE"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        value={formData.title}
                        required
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl pl-14 pr-6 py-5 text-white font-bold placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 ml-4">
                      Tag Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter a brief definition for this tag node..."
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      value={formData.description}
                      required
                      rows={3}
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-5 text-white font-medium placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-6 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-[10px] tracking-[0.2em] text-neutral-600 hover:text-white transition-colors cursor-pointer"
                    >
                      Abort_Action
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        flex items-center gap-3 px-12 py-4 rounded-2xl 
                        bg-cyan-500 text-black font-black text-[10px] tracking-[0.3em]
                        hover:bg-cyan-400 active:scale-95 transition-all
                        cursor-pointer
                      "
                    >
                      <Plus size={16} strokeWidth={3} />
                      <span>Create_Tag</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Loading State */
                <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
                  <div className="p-5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500">
                    <Loader2 size={40} className="animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-white tracking-[0.3em]">
                      Transmitting_Data
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 tracking-widest">
                      Mapping new tag to database...
                    </p>
                  </div>
                  <div className="w-64 h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-1/3 animate-[progress_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default CreateTagCard;
