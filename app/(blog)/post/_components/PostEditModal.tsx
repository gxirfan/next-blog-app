"use client";

import React, { useState } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { IPostResponse } from "@/app/types/post";
import dynamic from "next/dynamic";
import { X, Save, AlertCircle, Loader2, Plus, PenBox } from "lucide-react";
import Image from "next/image";
import { prepareContentForImage } from "@/app/types/prepareContentForImage";
import { ENV } from "@/config/env.config";

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), {
  ssr: false,
});

interface PostEditModalProps {
  post: IPostResponse;
  onClose: () => void;
}

interface UpdatePostDto {
  title?: string;
  content?: string;
  mainImage?: string | null;
}

const PostEditModal = ({ post, onClose }: PostEditModalProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Başlangıçta mevcut görseli tam URL olarak alıyoruz
  const initialImage = post.mainImage
    ? `${ENV.API_IMAGE_URL}${post.mainImage}`
    : null;

  const [formData, setFormData] = useState<UpdatePostDto>({
    title: post.title,
    content: post.content,
    mainImage: initialImage,
  });

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          mainImage: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contentPlainText =
      formData.content?.replace(/<[^>]*>/g, "").trim() || "";

    if (!formData.title || contentPlainText.length < 1) {
      setError("Title and content cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      let finalMainImage = formData.mainImage;
      const apiUrl = ENV.API_IMAGE_URL || "";

      if (finalMainImage && finalMainImage.startsWith(apiUrl)) {
        finalMainImage = finalMainImage.replace(apiUrl, "");
      }

      const response = await api.patch(`/posts/${post.id}`, {
        title: formData.title,
        content: formData.content,
        mainImage: finalMainImage,
      });

      onClose();
      router.replace(`/post/${response.data.data.slug}`);
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Update failed.";
      setError(`Error: ${Array.isArray(msg) ? msg[0] : msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 flex items-center justify-between border-b border-neutral-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl text-cyan-500 border border-neutral-800">
              <PenBox size={22} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500 mb-1">
                Node_Configuration
              </p>
              <h2 className="text-xl text-white font-black uppercase tracking-tighter">
                Update Post Details
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-neutral-900 rounded-2xl text-neutral-500 hover:text-white transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleUpdateDetails}
          className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1"
        >
          {error && (
            <div className="flex items-center gap-2 p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-mono uppercase tracking-widest">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                  Featured_Media
                </label>

                {!showImageUpload && !formData.mainImage && (
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
                    <span>Change Cover</span>
                  </button>
                )}
              </div>

              {(showImageUpload || formData.mainImage) && (
                <div className="relative h-64 w-full bg-neutral-900/40 border border-neutral-800 rounded-4xl flex items-center justify-center overflow-hidden group/img animate-in zoom-in-95 duration-500">
                  {formData.mainImage ? (
                    <>
                      <Image
                        src={formData.mainImage}
                        alt="Preview"
                        fill
                        className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              mainImage: null,
                            }));
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
                            Select_Node_Resource
                          </span>
                          <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-medium">
                            JPG • PNG • WEBP
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
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 ml-4">
                Subject_Identifier
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="RE-IDENTIFY TITLE..."
                className="w-full px-6 py-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-white text-lg font-bold placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 ml-4">
                Content_Stream
              </label>
              <div className="bg-neutral-900/30 rounded-4xl border border-neutral-800 overflow-hidden focus-within:border-cyan-500/30 transition-all">
                <TiptapEditor
                  initialContent={prepareContentForImage(
                    formData.content || "",
                  )}
                  onUpdate={(content) =>
                    setFormData({
                      ...formData,
                      content: content,
                    })
                  }
                  showImageOption={true}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-12 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-full text-[10px] font-mono uppercase tracking-widest text-neutral-600 hover:text-white transition-all cursor-pointer"
            >
              Abort_Changes
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className={`
                flex items-center gap-3 px-10 py-4 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all
                ${
                  loading || !formData.title || !formData.content
                    ? "bg-neutral-900 text-neutral-700 cursor-not-allowed border border-neutral-800"
                    : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 cursor-pointer"
                }
              `}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Execute_Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditModal;
