"use client";

import React, { useState } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { ITagResponse } from "@/app/types/tag";
import { X, Save, AlertCircle, Loader2, Hash } from "lucide-react";

interface TagEditModalProps {
  tag: ITagResponse;
  onClose: () => void;
}

interface UpdateTagDto {
  title?: string;
  description?: string;
}

const TagEditModal = ({ tag, onClose }: TagEditModalProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateTagDto>({
    title: tag.title,
    description: tag.description,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.description) {
        setError("Title and description cannot be empty.");
        setLoading(false);
        return;
      }
      const response = await api.patch(`/tags/${tag.id}`, formData);

      onClose();
      router.replace(`/tag/${response.data.data.slug}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(`Error: ${Array.isArray(msg) ? msg[0] : msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-neutral-900">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-cyan-500 mb-1">
              Admin Suite
            </p>
            <h2 className="text-xl text-white tracking-tight">
              Edit Tag Details
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
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] tracking-widest">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest text-neutral-600 ml-4">
                Tag Label
              </label>
              <div className="relative">
                <Hash
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-700"
                  size={18}
                />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Tag Title"
                  className="w-full pl-12 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-white font-bold focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest text-neutral-600 ml-4">
                Tag Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="How would you describe this tag?"
                rows={3}
                className="w-full px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-white font-medium focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full text-[10px] tracking-[0.2em] text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-full text-[10px] tracking-[0.2em] transition-all cursor-pointer
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
                  <span>Update Tag</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagEditModal;
