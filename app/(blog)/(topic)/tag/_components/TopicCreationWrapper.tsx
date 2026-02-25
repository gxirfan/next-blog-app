"use client";

import React, { useState, useTransition } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import dynamic from "next/dynamic";
import { Plus, X, Loader2, Send, AlertCircle, Tag } from "lucide-react";

const TiptapEditor = dynamic(
  () => import("../../../../components/TiptapEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 bg-neutral-900/50 rounded-4xl text-neutral-600 text-[10px] tracking-widest text-center border border-neutral-800">
        Initializing Editor...
      </div>
    ),
  },
);

const MIN_TITLE = 5;
const MAX_TITLE = 100;
const MIN_CONTENT = 20;

interface TopicCreationWrapperProps {
  tagId: string;
  tagTitle: string;
}

const TopicCreationWrapper = ({
  tagId,
  tagTitle,
}: TopicCreationWrapperProps) => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", contentHTML: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthLoading || !user) return null;

  const handleEditorUpdate = (contentHtml: string) => {
    setFormData((prev) => ({ ...prev, contentHTML: contentHtml }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const contentPlainText = formData.contentHTML
      .replace(/<[^>]*>/g, "")
      .trim();

    if (formData.title.trim().length < MIN_TITLE) {
      setError(`Title is too short. Min ${MIN_TITLE} characters required.`);
      return;
    }

    if (formData.title.length > MAX_TITLE) {
      setError(`Title is too long. Max ${MAX_TITLE} characters.`);
      return;
    }

    if (contentPlainText.length < MIN_CONTENT) {
      setError(
        `Content is too brief. Please write at least ${MIN_CONTENT} characters.`,
      );
      return;
    }

    setLoading(true);
    try {
      await api.post("/topics", {
        title: formData.title.trim(),
        content: formData.contentHTML,
        tagId,
      });

      setIsModalOpen(false);
      setFormData({ title: "", contentHTML: "" });

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Something went wrong.";
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    ((user && user.role === "admin") ||
      (user && user.role === "moderator") ||
      (user && user.role === "writer")) && (
      <>
        <div className="flex justify-end mb-6">
          {/* <button
          onClick={() => {
            setIsModalOpen(true);
            setError(null);
            setLoading(false);
          }}
          className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-[11px] tracking-[0.2em] transition-all hover:bg-cyan-400 active:scale-95 cursor-pointer"
        >
          <Plus size={16} /> New Topic
        </button> */}

          <button
            onClick={() => {
              setIsModalOpen(true);
              setError(null);
              setLoading(false);
            }}
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
              <Plus
                size={18}
                strokeWidth={3}
                className="text-neutral-900 group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <span className="relative z-10">Create Topic</span>
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-4xl overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 pb-4 flex items-center justify-between border-b border-neutral-900">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-cyan-500 mb-1">
                    Topic Studio
                  </p>
                  <h3 className="text-xl text-white tracking-tight flex items-center gap-2">
                    <Tag className="inline-block" size={16} /> {tagTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 pt-6">
                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] tracking-widest flex items-center gap-3 animate-in shake duration-300">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-neutral-700 ml-4">
                      Subject Title
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Describe your topic..."
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                        if (error) setError(null);
                      }}
                      value={formData.title}
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white font-bold placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-neutral-700 ml-4">
                      Discussion Content
                    </label>
                    <div className="bg-neutral-900/30 rounded-4xl border border-neutral-800 overflow-hidden">
                      <TiptapEditor
                        initialContent={formData.contentHTML}
                        onUpdate={handleEditorUpdate}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-6 mt-10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-[10px] tracking-[0.2em] text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isPending}
                    className={`
                    flex items-center gap-2 px-10 py-4 rounded-full text-[10px] tracking-[0.2em] transition-all cursor-pointer
                    ${
                      loading || isPending
                        ? "bg-neutral-900 text-neutral-700 border border-neutral-800"
                        : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95"
                    }
                  `}
                  >
                    {loading || isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Publish Topic
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default TopicCreationWrapper;
