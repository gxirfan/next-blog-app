"use client";

import React, { useState } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { ITopicResponse } from "@/app/types/topic";
import TiptapEditor from "@/app/components/TiptapEditor";
import { X, Save, AlertCircle, Loader2 } from "lucide-react";

interface TopicEditModalProps {
  topic: ITopicResponse;
  onClose: () => void;
}

const TopicEditModal = ({ topic, onClose }: TopicEditModalProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: topic.title,
    contentHTML: topic.content,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contentPlainText = formData.contentHTML
      .replace(/<[^>]+>/g, "")
      .trim();

    try {
      if (!formData.title.trim() || !contentPlainText) {
        setError("Title and content cannot be empty.");
        setLoading(false);
        return;
      }

      const response = await api.patch(`/topics/${topic.id}`, {
        title: formData.title,
        content: formData.contentHTML,
      });

      onClose();
      router.replace(`/topic/${response.data.data.slug}`);
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Update failed.";
      setError(Array.isArray(msg) ? msg[0] : msg);
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
        className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-neutral-900">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 mb-1">
              Management Suite
            </p>
            <h2 className="text-xl text-white tracking-tight uppercase">
              Edit Topic
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdateDetails} className="p-8 pt-6">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Title Input Area */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-700 ml-4">
                Topic Subject
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a new title..."
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white font-bold placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Editor Area */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-700 ml-4">
                Main Discussion Content
              </label>
              <div className="bg-neutral-900/30 rounded-4xl border border-neutral-800 overflow-hidden">
                <TiptapEditor
                  initialContent={formData.contentHTML}
                  onUpdate={(contentHtml: string) => {
                    setFormData({ ...formData, contentHTML: contentHtml });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-6 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center gap-2 px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer
                ${
                  loading
                    ? "bg-neutral-900 text-neutral-700 border border-neutral-800"
                    : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95"
                }
              `}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Topic</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicEditModal;
