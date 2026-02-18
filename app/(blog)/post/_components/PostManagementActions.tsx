"use client";

import { useState } from "react";
import { IPostResponse } from "@/app/types/post";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import PostEditModal from "./PostEditModal";
import { Eye, EyeOff, Pencil, AlertCircle, Loader2 } from "lucide-react";

interface PostManagementActionsProps {
  post: IPostResponse;
}

const PostManagementActions = ({ post }: PostManagementActionsProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage =
    user &&
    (post.userId === user.id ||
      user.role === "admin" ||
      user.role === "moderator");
  if (!canManage) return null;

  const isCurrentlyActive = post.status !== false;

  const handleToggleStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = !isCurrentlyActive;
      await api.patch(`/posts/${post.id}`, { status: newStatus });
      router.refresh();
    } catch (err) {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6 animate-in fade-in slide-in-from-right-2 duration-300">
      {/* Error Message: More subtle and elegant */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] uppercase tracking-widest text-red-500">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Toggle Visibility Button */}
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className={`
                    group flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-widest transition-all duration-300 cursor-pointer disabled:opacity-50
                    ${
                      isCurrentlyActive
                        ? "bg-neutral-900 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 border border-neutral-800 hover:border-red-500/30"
                        : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
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
          {loading ? "Wait..." : isCurrentlyActive ? "Hide" : "Publish"}
        </span>
      </button>

      {/* Edit Button: Matching the premium cyan theme */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="group flex items-center gap-2 px-5 py-2 bg-neutral-950 text-cyan-500 border border-cyan-500/20 rounded-full text-[11px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 cursor-pointer"
      >
        <Pencil
          size={14}
          className="group-hover:rotate-12 transition-transform"
        />
        <span>Edit</span>
      </button>

      {isModalOpen && (
        <PostEditModal post={post} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PostManagementActions;
