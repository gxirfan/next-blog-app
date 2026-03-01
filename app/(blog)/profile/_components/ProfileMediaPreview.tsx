"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, XCircle, Loader } from "lucide-react";
import api from "@/api/axios";
import { ENV } from "@/config/env.config";

interface MediaPreviewProps {
  avatarUrl: string;
  coverUrl: string;
  username: string;
  onUploadSuccess: () => void;
}

const ProfileMediaPreview = ({
  avatarUrl,
  coverUrl,
  username,
  onUploadSuccess,
}: MediaPreviewProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_COVER =
    ENV.API_IMAGE_URL + "/images/user/covers/default-cover.png";
  const DEFAULT_AVATAR =
    ENV.API_IMAGE_URL + "/images/user/avatars/default-avatar.png";

  const displayAvatar = selectedAvatar
    ? URL.createObjectURL(selectedAvatar)
    : avatarUrl || DEFAULT_AVATAR;
  const displayCover = selectedCover
    ? URL.createObjectURL(selectedCover)
    : coverUrl || DEFAULT_COVER;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (type === "avatar") setSelectedAvatar(file);
      else setSelectedCover(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedAvatar && !selectedCover) return;

    const formData = new FormData();
    if (selectedAvatar) formData.append("avatar", selectedAvatar);
    if (selectedCover) formData.append("cover", selectedCover);

    setLoading(true);
    try {
      await api.patch("/user/me/media", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedAvatar(null);
      setSelectedCover(null);

      await onUploadSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const isUpdating = loading;

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

      <div className="relative w-full h-48 md:h-64 bg-neutral-900 rounded-2rem overflow-hidden group border border-neutral-800/50">
        <Image
          key={displayCover}
          src={displayCover}
          alt="Cover preview"
          fill
          className={`object-cover transition-all duration-500 ${
            isUpdating
              ? "blur-sm opacity-50"
              : "opacity-80 group-hover:opacity-100"
          }`}
        />
        <div
          onClick={() => !isUpdating && coverInputRef.current?.click()}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isUpdating
              ? "bg-black/20"
              : "bg-black/0 group-hover:bg-black/40 cursor-pointer"
          }`}
        >
          {!isUpdating && (
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <Camera size={24} className="text-white" />
            </div>
          )}
          {isUpdating && (
            <Loader className="animate-spin text-cyan-400" size={32} />
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-6">
        <div className="flex items-end space-x-6">
          <div className="relative -mt-12 md:-mt-16 z-10">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-neutral-950 bg-neutral-900 overflow-hidden relative group">
              <Image
                key={displayAvatar}
                src={displayAvatar}
                alt="Avatar preview"
                fill
                className={`object-cover transition-opacity ${
                  isUpdating ? "opacity-30" : "opacity-100"
                }`}
              />
              <div
                onClick={() => !isUpdating && avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
              >
                <Camera
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100"
                />
              </div>
              {isUpdating && (
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

        <div className="flex items-center gap-4 pb-2">
          {error && (
            <span className="text-red-400 text-xs flex items-center gap-1 animate-pulse">
              <XCircle size={14} /> {error}
            </span>
          )}
          <button
            onClick={handleUpload}
            disabled={(!selectedAvatar && !selectedCover) || isUpdating}
            className={`px-6 py-2.5 rounded-2xl text-xs tracking-widest transition-all duration-300 flex items-center gap-2
              ${
                (selectedAvatar || selectedCover) && !isUpdating
                  ? "bg-white text-black hover:scale-105 active:scale-95"
                  : "bg-neutral-900 text-neutral-600 border border-neutral-800"
              }`}
          >
            {isUpdating ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMediaPreview;
