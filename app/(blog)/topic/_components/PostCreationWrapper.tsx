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
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { ENV } from "@/config/env.config";

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
      setStatus({
        type: "success",
        msg: `${ENV.POST_TYPE} successfully published!`,
      });
      setFormData({ title: "", contentHTML: "<p></p>" });

      // setTimeout(() => {
      //   handleClose();
      //   router.refresh();
      // }, 1000);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : `Failed to create ${ENV.POST_TYPE}.`;
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
        {/* --- Main Action Button: Bold Capsule --- */}
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-4 px-10 py-5 rounded-full bg-cyan-500 text-black hover:bg-white transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="text-[13px] font-black uppercase tracking-[0.2em]">
            {buttonLabel}
          </span>
        </button>

        {/* --- Status Notification --- */}
        {status && (
          <div
            className={`mt-8 p-5 rounded-full border-2 flex items-center gap-4 animate-in slide-in-from-top-2 ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <Sparkles size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">
              {status.msg}
            </span>
          </div>
        )}

        {/* --- Modal Window --- */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] h-screen flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl"
              onClick={handleClose}
            />

            <div className="relative w-full max-w-4xl bg-[#050505] border-2 border-neutral-900 rounded-[4rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-10 border-b border-neutral-900 bg-neutral-950">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center text-cyan-500">
                    {parentId ? (
                      <CornerDownRight size={24} />
                    ) : (
                      <MessageSquare size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {parentId ? "Reply" : `New ${ENV.POST_TYPE}`}
                    </h3>
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                      Share your thoughts with the network
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-12 h-12 rounded-full border-2 border-transparent hover:border-neutral-800 hover:bg-neutral-900 text-neutral-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                {!loading && (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Media Section */}
                    <div className="space-y-4">
                      <label className="text-[12px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-6 block">
                        Cover Image
                      </label>

                      {showImageUpload || mainImage ? (
                        <div className="relative h-72 w-full bg-neutral-900/40 border-2 border-neutral-800 rounded-[3rem] flex items-center justify-center overflow-hidden group animate-in zoom-in-95 duration-500">
                          {mainImage ? (
                            <>
                              <Image
                                src={mainImage}
                                alt="Cover"
                                width={800}
                                height={400}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMainImage(null);
                                    setShowImageUpload(false);
                                  }}
                                  className="px-8 py-3 bg-red-500 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                                >
                                  Remove Image
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-5 group transition-colors">
                                <div className="w-16 h-16 bg-neutral-950 rounded-full border-2 border-neutral-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-500">
                                  <Plus size={28} className="text-cyan-500" />
                                </div>
                                <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                                  Select Image
                                </span>
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
                                className="absolute top-8 right-8 text-neutral-600 hover:text-white transition-colors"
                              >
                                <X size={24} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowImageUpload(true)}
                          className="w-full py-8 border-2 border-dashed border-neutral-800 rounded-[2.5rem] flex items-center justify-center gap-4 text-neutral-500 hover:border-cyan-500/30 hover:text-cyan-500 transition-all group"
                        >
                          <ImageIcon size={20} />
                          <span className="text-[12px] font-black uppercase tracking-widest">
                            Add Media
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Subject Input */}
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-6 block">
                        Subject
                      </label>
                      <input
                        name="title"
                        type="text"
                        placeholder="Enter a descriptive title..."
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        value={formData.title}
                        required
                        className="w-full h-16 px-8 bg-neutral-900/40 border-2 border-neutral-800 rounded-full text-white font-bold placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 focus:bg-neutral-900 transition-all"
                      />
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-3">
                      <label className="text-[12px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-6 block">
                        Content
                      </label>
                      <div className="bg-neutral-900/20 rounded-[3rem] border-2 border-neutral-800 overflow-hidden p-2 focus-within:border-cyan-500/30 transition-all">
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
                  <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in">
                    <div className="w-20 h-20 bg-cyan-500/10 border-2 border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-500">
                      <Loader2 size={40} className="animate-spin" />
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                        Posting...
                      </h3>
                      <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                        Synchronizing with network
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-neutral-900 bg-neutral-950 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Character Progress */}
                <div className="flex items-center gap-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                      Title
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${formData.title.length > 90 ? "bg-red-500" : "bg-cyan-500"}`}
                          style={{
                            width: `${(formData.title.length / MAX_LENGTH) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-bold ${formData.title.length > 90 ? "text-red-500" : "text-neutral-500"}`}
                      >
                        {formData.title.length}/{MAX_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l-2 border-neutral-900 pl-10">
                    <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                      Body
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{
                            width: `${Math.min((getContentCharCount() / CONTENT_LIMIT) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-neutral-500">
                        {getContentCharCount()}/{CONTENT_LIMIT}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-widest text-neutral-500 hover:text-red-500 transition-all active:scale-95"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      formData.title.trim().length === 0 ||
                      getContentCharCount() < 1
                    }
                    className={`flex-1 md:flex-none flex items-center justify-center gap-4 px-16 py-5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all ${
                      loading ||
                      formData.title.trim().length === 0 ||
                      getContentCharCount() < 1
                        ? "bg-neutral-900 text-neutral-700 border-2 border-neutral-800"
                        : "bg-cyan-500 text-black hover:bg-white active:scale-95"
                    }`}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Post Now</span>
                        <Send size={18} />
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
