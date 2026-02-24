"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { useAuth } from "@/app/context/AuthContext";

interface FlowActionsProps {
  slug: string;
  initialContent: string;
  authorId: string;
}

export default function FlowActions({
  slug,
  initialContent,
  authorId,
}: FlowActionsProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"none" | "edit" | "delete">(
    "none",
  );
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const isOwner = user?.id === authorId;
  const isAdminOrMod = user?.role === "admin" || user?.role === "moderator";
  const canAction = isOwner || isAdminOrMod;

  if (!user || !canAction) return null;

  const handleUpdate = async () => {
    if (content.trim() === initialContent) return setModalMode("none");
    setLoading(true);
    try {
      const response = await api.patch(`/flow/${slug}`, { content });
      const updatedData = response.data.data;
      setModalMode("none");
      router.refresh();
      if (updatedData.slug !== slug) {
        router.push(`/stream/thread/${updatedData.slug}`);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.patch(`/flow/${slug}`, { isDeleted: true });
      router.push("/stream");
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-neutral-600 hover:text-white rounded-full hover:bg-neutral-900/50 transition-all cursor-pointer"
      >
        <MoreHorizontal size={20} />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-52 bg-neutral-950 border border-neutral-800 rounded-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {isOwner && (
              <button
                onClick={() => {
                  setModalMode("edit");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center px-5 py-3 text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer group"
              >
                <Pencil
                  size={14}
                  className="mr-3 text-neutral-600 group-hover:text-cyan-500 transition-colors"
                />{" "}
                Edit Entry
              </button>
            )}
            <button
              onClick={() => {
                setModalMode("delete");
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center px-5 py-3 text-[11px] uppercase tracking-widest text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer group"
            >
              <Trash2
                size={14}
                className="mr-3 text-red-900/50 group-hover:text-red-500 transition-colors"
              />{" "}
              Delete Entry
            </button>
          </div>
        </>
      )}

      {modalMode !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          {modalMode === "delete" && (
            <div className="bg-neutral-950 border border-red-900/30 w-full max-w-sm rounded-[2.5rem] p-8 md:p-10 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-red-500 mb-6">
                <ShieldAlert size={28} strokeWidth={1.5} />
                <div className="h-px w-8 bg-red-900/20" />
              </div>
              <h3 className="text-2xl text-white tracking-tighter uppercase mb-2">
                Terminate?
              </h3>
              <p className="text-neutral-500 text-xs font-medium leading-relaxed mb-8">
                This stream entry will be permanently de-indexed from the
                digital grid. This action is irreversible.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full py-4 bg-red-600/10 border border-red-600/20 hover:bg-red-600 text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Confirm Termination"
                  )}
                </button>
                <button
                  onClick={() => setModalMode("none")}
                  className="w-full py-4 bg-transparent text-neutral-600 hover:text-white text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  Aborted
                </button>
              </div>
            </div>
          )}

          {modalMode === "edit" && (
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8 border-b border-neutral-900 pb-6">
                <div className="flex items-center gap-3">
                  <Pencil size={20} className="text-cyan-500" />
                  <h3 className="text-2xl text-white tracking-tighter uppercase">
                    Edit Stream
                  </h3>
                </div>
                <button
                  onClick={() => setModalMode("none")}
                  className="p-2 hover:bg-neutral-900 rounded-full text-neutral-600 hover:text-white transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <textarea
                className="w-full bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 text-white text-lg font-bold placeholder-neutral-700 focus:outline-none focus:border-cyan-500/40 min-h-[180px] resize-none transition-all"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                autoFocus
              />

              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-6">
                <div className="flex flex-col w-24">
                  <span className="text-[9px] tracking-widest uppercase text-neutral-600 mb-1.5">
                    {content.length} / 500
                  </span>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${(content.length / 500) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setModalMode("none")}
                    className="flex-1 sm:flex-none px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={loading || content.trim() === initialContent}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <span>Commit Sync</span>
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
