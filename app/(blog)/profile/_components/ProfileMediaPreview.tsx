"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  Upload,
  XCircle,
  Loader,
  Image as ImageIcon,
} from "lucide-react";
import api from "@/api/axios";

interface MediaPreviewProps {
  avatarUrl: string;
  coverUrl: string;
  username: string;
  onUploadSuccess: () => void;
}

const ProfileMediaPreview: React.FC<MediaPreviewProps> = ({
  avatarUrl,
  coverUrl,
  username,
  onUploadSuccess,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState({
    avatar: avatarUrl,
    cover: coverUrl,
  });
  const [isParentRefreshing, setIsParentRefreshing] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_COVER =
    process.env.NEXT_PUBLIC_API_IMAGE_URL +
    "/images/user/covers/default-cover.png";
  const DEFAULT_AVATAR =
    process.env.NEXT_PUBLIC_API_IMAGE_URL +
    "/images/user/avatars/default-avatar.png";

  const finalCoverUrl = selectedCover
    ? URL.createObjectURL(selectedCover)
    : previewUrls.cover || DEFAULT_COVER;
  const finalAvatarUrl = selectedAvatar
    ? URL.createObjectURL(selectedAvatar)
    : previewUrls.avatar || DEFAULT_AVATAR;

  useEffect(() => {
    if (avatarUrl !== previewUrls.avatar || coverUrl !== previewUrls.cover) {
      setPreviewUrls({ avatar: avatarUrl, cover: coverUrl });
      setIsParentRefreshing(false);
    }
  }, [avatarUrl, coverUrl]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setError(null);
    if (file) {
      type === "avatar" ? setSelectedAvatar(file) : setSelectedCover(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedAvatar && !selectedCover) {
      setError("Please select an image first.");
      return;
    }
    const formData = new FormData();
    if (selectedAvatar) formData.append("avatar", selectedAvatar);
    if (selectedCover) formData.append("cover", selectedCover);

    setLoading(true);
    setError(null);

    try {
      const response = await api.patch("/user/me/media", formData, {
        withCredentials: true,
      });
      setPreviewUrls({
        avatar: response.data.avatarUrl,
        cover: response.data.coverUrl,
      });
      setSelectedAvatar(null);
      setSelectedCover(null);
      setIsParentRefreshing(true);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed.");
      setIsParentRefreshing(false);
    } finally {
      setLoading(false);
    }
  };

  const isImageUpdating = loading || isParentRefreshing;

  return (
    <div className="w-full bg-transparent space-y-6">
      <input
        type="file"
        ref={coverInputRef}
        onChange={(e) => handleFileChange(e, "cover")}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarInputRef}
        onChange={(e) => handleFileChange(e, "avatar")}
        accept="image/*"
        className="hidden"
      />

      {/* 1. COVER PREVIEW: Large border-radius to match profile page */}
      <div className="relative w-full h-48 md:h-64 bg-neutral-900 rounded-2rem overflow-hidden group border border-neutral-800/50">
        <Image
          src={finalCoverUrl}
          alt="Cover preview"
          fill
          className={`object-cover transition-all duration-500 ${
            isImageUpdating
              ? "blur-sm opacity-50"
              : "opacity-80 group-hover:opacity-100"
          }`}
        />

        {/* Overlay Action */}
        <div
          onClick={() => !isImageUpdating && coverInputRef.current?.click()}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isImageUpdating
              ? "bg-black/20"
              : "bg-black/0 group-hover:bg-black/40 cursor-pointer"
          }`}
        >
          {!isImageUpdating && (
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <Camera size={24} className="text-white" />
            </div>
          )}
          {isImageUpdating && (
            <Loader className="animate-spin text-cyan-400" size={32} />
          )}
        </div>
      </div>

      {/* 2. AVATAR & ACTIONS SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-6">
        <div className="flex items-end space-x-6">
          {/* Circular Avatar Preview */}
          <div className="relative -mt-12 md:-mt-16 z-10">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-neutral-950 bg-neutral-900 overflow-hidden relative group">
              <Image
                src={finalAvatarUrl}
                alt="Avatar preview"
                fill
                className={`object-cover transition-opacity ${
                  isImageUpdating ? "opacity-30" : "opacity-100"
                }`}
              />
              <div
                onClick={() =>
                  !isImageUpdating && avatarInputRef.current?.click()
                }
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
              >
                <Camera
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100"
                />
              </div>
              {isImageUpdating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="animate-spin text-cyan-400" size={20} />
                </div>
              )}
            </div>
          </div>

          <div className="pb-2">
            <h3 className="text-white font-bold text-lg">Media Assets</h3>
            <p className="text-neutral-500 text-xs">
              Update your visual identity
            </p>
          </div>
        </div>

        {/* 3. UPLOAD ACTIONS: Minimalist Pill Buttons */}
        <div className="flex items-center gap-4 pb-2">
          {error && (
            <span className="text-red-400 text-xs flex items-center gap-1 animate-pulse">
              <XCircle size={14} /> {error}
            </span>
          )}

          <button
            onClick={handleUpload}
            disabled={(!selectedAvatar && !selectedCover) || isImageUpdating}
            className={`px-6 py-2.5 rounded-2xl text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2
              ${
                (selectedAvatar || selectedCover) && !isImageUpdating
                  ? "bg-white text-black hover:scale-105 active:scale-95"
                  : "bg-neutral-900 text-neutral-600 border border-neutral-800"
              }`}
          >
            {isImageUpdating ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isImageUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMediaPreview;
