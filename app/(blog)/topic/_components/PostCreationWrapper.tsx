"use client";

import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ICreatePostDto } from "@/app/types/post";
import dynamic from "next/dynamic";
import {
  Plus,
  X,
  MessageSquare,
  Loader2,
  CornerDownRight,
  Sparkles,
  Send,
} from "lucide-react";
import Image from "next/image";

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), {
  ssr: false,
});

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

interface PostCreationWrapperProps {
  topicId: string;
  parentId: string | null;
  onClose?: () => void;
  buttonLabel: string;
}

const PostCreationWrapper = ({
  topicId,
  parentId,
  onClose,
  buttonLabel,
}: PostCreationWrapperProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    contentHTML: "<p></p>",
  });

  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!user) return null;

  const handleClose = () => {
    setIsOpen(false);
    setMainImage(null);
    if (onClose) onClose();
  };

  const handleEditorUpdate = (contentHtml: string) => {
    setFormData((prev) => ({ ...prev, contentHTML: contentHtml }));
    setStatus(null);
  };

  const getContentCharCount = () => {
    return formData.contentHTML.replace(/<[^>]*>/g, "").length;
  };

  const CONTENT_LIMIT = 5000000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const contentPlainText = formData.contentHTML
      .replace(/<[^>]*>/g, "")
      .trim();

    if (
      contentPlainText.length < MIN_LENGTH ||
      formData.title.trim().length < MIN_LENGTH
    ) {
      setStatus({ type: "error", msg: "Title and content cannot be empty." });
      setLoading(false);
      return;
    }

    try {
      const payload: ICreatePostDto = {
        title: formData.title,
        content: formData.contentHTML,
        topicId,
        parentId,
        mainImage,
      };

      await api.post("/posts", payload);
      setStatus({ type: "success", msg: "Post successfully published!" });
      setFormData({ title: "", contentHTML: "<p></p>" });

      // setTimeout(() => {
      //   handleClose();
      //   router.refresh();
      // }, 1000);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to create post.";
      setStatus({
        type: "error",
        msg: Array.isArray(errMsg) ? errMsg[0] : errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    (user.role === "writer" ||
      user.role === "moderator" ||
      user.role === "admin") && (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="
            group relative flex items-center gap-4 px-10 py-4 rounded-2xl 
            bg-neutral-200 text-neutral-900 border border-neutral-300
            hover:bg-white hover:text-black transition-all duration-500 
            cursor-pointer text-[11px] font-black uppercase tracking-[0.25em]
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

          <span className="relative z-10">{buttonLabel}</span>
        </button>

        {status && (
          <div
            className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <Sparkles size={18} />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {status.msg}
            </span>
          </div>
        )}

        {isOpen && (
          <div className="fixed inset-0 z-100 h-screen flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
              onClick={handleClose}
            />

            <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between p-8 border-b border-neutral-900 bg-neutral-950">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-900 rounded-2xl text-cyan-500">
                    {parentId ? (
                      <CornerDownRight size={22} />
                    ) : (
                      <MessageSquare size={22} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-urbanist text-xl text-white uppercase tracking-tighter font-black">
                      {parentId ? "Compose Reply" : "Initialize New Post"}
                    </h3>
                    <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mt-1">
                      Node: {topicId.substring(0, 8)}...
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

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                {!loading && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                          Featured_Media
                        </label>

                        {!showImageUpload && !mainImage && (
                          <button
                            type="button"
                            onClick={() => setShowImageUpload(true)}
                            className="
                            flex items-center gap-2 px-5 py-2.5 
                            bg-neutral-200 text-black border border-neutral-300
                            rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] 
                            hover:bg-white transition-all duration-300 cursor-pointer
                          "
                          >
                            <Plus size={14} strokeWidth={3} />
                            <span>Add Cover</span>
                          </button>
                        )}
                      </div>

                      {(showImageUpload || mainImage) && (
                        <div className="relative h-72 w-full bg-neutral-900/40 border border-neutral-800 rounded-4xl flex items-center justify-center overflow-hidden group animate-in zoom-in-95 duration-500">
                          {mainImage ? (
                            <>
                              <Image
                                src={mainImage}
                                alt="Cover Preview"
                                width={800}
                                height={400}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMainImage(null);
                                    setShowImageUpload(false);
                                  }}
                                  className="
                                  flex items-center gap-2 px-6 py-3 bg-neutral-950 text-red-400 
                                  border border-red-900/30 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]
                                  hover:bg-red-500/10 hover:border-red-500/50 transition-all cursor-pointer
                                "
                                >
                                  <X size={16} />
                                  <span>Remove_Media</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-5 group/label transition-colors">
                                <div className="w-16 h-16 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center group-hover/label:border-cyan-500/50 transition-all duration-500">
                                  <Plus size={24} className="text-cyan-500" />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                  <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-400 group-hover/label:text-white transition-colors">
                                    Link_Source_File
                                  </span>
                                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-medium">
                                    Standard Node Formats Supported
                                  </span>
                                </div>

                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleMainImageChange}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => setShowImageUpload(false)}
                                className="absolute top-6 right-6 p-2 text-neutral-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 ml-4">
                        Subject Identifier
                      </label>
                      <input
                        name="title"
                        type="text"
                        placeholder="ENTER TITLE..."
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        value={formData.title}
                        required
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-5 text-white font-bold placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 ml-4">
                        Content Stream
                      </label>
                      <div className="bg-neutral-900/30 rounded-4xl border border-neutral-800 overflow-hidden">
                        <TiptapEditor
                          initialContent={formData.contentHTML}
                          onUpdate={handleEditorUpdate}
                          showImageOption={true}
                        />
                      </div>
                    </div>
                  </form>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
                    <div className="p-5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500">
                      <Loader2 size={40} className="animate-spin" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">
                        Transmitting_Signal
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        Syncing with central database...
                      </p>
                    </div>
                    {/* Visual Terminal Bar */}
                    <div className="w-64 h-1 bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-neutral-900 bg-neutral-950 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-8 items-center">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-600">
                      Title Buffer
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1 w-12 rounded-full ${
                          formData.title.length > 90
                            ? "bg-red-500"
                            : "bg-neutral-800"
                        }`}
                      >
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{
                            width: `${
                              (formData.title.length / MAX_LENGTH) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span
                        className={`font-mono text-[10px] tracking-[0.2em] ${
                          formData.title.length > 90
                            ? "text-red-500"
                            : "text-neutral-400"
                        }`}
                      >
                        {formData.title.length}/{MAX_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-l border-neutral-800 pl-8">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-600">
                      Content Stream
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 rounded-full bg-neutral-800">
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{
                            width: `${Math.min(
                              (getContentCharCount() / CONTENT_LIMIT) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400">
                        {getContentCharCount()}/{CONTENT_LIMIT}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-10">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="
                      order-2 md:order-1 w-full md:w-auto px-8 py-4 rounded-2xl
                      text-neutral-500 border border-transparent
                      hover:border-red-900/30 hover:bg-red-500/5 hover:text-red-400
                      text-[11px] font-bold uppercase tracking-[0.2em] 
                      transition-all duration-300 cursor-pointer
                    "
                  >
                    Abort
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      formData.title.trim().length === 0 ||
                      getContentCharCount() < 1
                    }
                    className={`
                    order-1 md:order-2 flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 rounded-2xl 
                    font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer
                    ${
                      loading ||
                      formData.title.trim().length === 0 ||
                      getContentCharCount() < 1
                        ? "bg-neutral-900 text-neutral-700 border border-neutral-800 cursor-not-allowed"
                        : "bg-neutral-200 text-black hover:bg-white active:scale-[0.98]"
                    }
                  `}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={14} strokeWidth={2.5} />
                        <span>Deploy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default PostCreationWrapper;
