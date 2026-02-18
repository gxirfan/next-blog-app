"use client";

import React, { useState } from "react";
import { ITagResponse } from "@/app/types/tag";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import TagEditModal from "./TagEditModal";
import { Eye, EyeOff, Pencil, Loader2, AlertCircle } from "lucide-react";

interface TagManagementActionsProps {
  tag: ITagResponse;
}

const TagManagementActions = ({ tag }: TagManagementActionsProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage =
    user &&
    (tag.userId === user.id ||
      user.role === "admin" ||
      user.role === "moderator");
  if (!canManage) return null;

  const isCurrentlyActive = tag.status !== false;

  const handleToggleStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = !isCurrentlyActive;
      await api.patch(`/tags/${tag.id}`, { status: newStatus });
      router.refresh();
    } catch (err) {
      setError("Update failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6 animate-in fade-in slide-in-from-right-2 duration-300">
      {/* Error Message Badge */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] uppercase tracking-widest text-red-500">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Status Toggle Button */}
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className={`
                    group flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-widest transition-all duration-300 cursor-pointer disabled:opacity-50
                    ${
                      isCurrentlyActive
                        ? "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                        : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                    }
                `}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isCurrentlyActive ? (
          <EyeOff
            size={14}
            className="group-hover:scale-110 transition-transform"
          />
        ) : (
          <Eye size={14} />
        )}
        <span>
          {loading ? "Wait" : isCurrentlyActive ? "Hide Tag" : "Activate"}
        </span>
      </button>

      {/* Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="group flex items-center gap-2 px-5 py-2 bg-neutral-950 text-cyan-500 border border-cyan-500/20 rounded-full text-[11px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 cursor-pointer"
      >
        <Pencil
          size={14}
          className="group-hover:rotate-12 transition-transform"
        />
        <span>Edit Details</span>
      </button>

      {isModalOpen && (
        <TagEditModal tag={tag} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default TagManagementActions;
