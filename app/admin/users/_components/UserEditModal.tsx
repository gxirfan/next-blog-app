"use client";

import React, { useState, useEffect } from "react";
import { X, Shield, ChevronDown, Calendar, Mail, AtSign } from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";
import { UserProfile } from "@/app/context/AuthContext";

enum UserStatus {
  Active = "active",
  Suspended = "suspended",
  Banned = "banned",
}
enum UserRole {
  Admin = "admin",
  User = "user",
  Moderator = "moderator",
  Writer = "writer",
}
enum UserGender {
  Male = "male",
  Female = "female",
  Other = "other",
  PreferNotToSay = "prefer_not_to_say",
}

export default function UserEditModal({
  user,
  authUser,
  isOpen,
  onClose,
  onSave,
}: {
  user: IUserResponse;
  authUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
}) {
  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    nickname: "",
    firstName: "",
    lastName: "",
    gender: UserGender.PreferNotToSay,
    birthDate: "",
    location: "",
    bio: "",
    isEmailPublic: false,
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        role: user.role,
        status: user.status,
        username: user.username || "",
        email: user.email || "",
        nickname: user.nickname || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || UserGender.PreferNotToSay,
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        location: user.location || "",
        bio: user.bio || "",
        isEmailPublic: user.isEmailPublic || false,
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: any = {};

    Object.keys(formData).forEach((key) => {
      const originalValue =
        key === "birthDate" && user[key]
          ? new Date(user[key]).toISOString().split("T")[0]
          : user[key as keyof IUserResponse];

      if (formData[key] !== originalValue) {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      onClose();
      return;
    }

    onSave(user.id, updatedFields);
  };

  const isDirty = Object.keys(formData).some((key) => {
    const original =
      key === "birthDate" && user[key]
        ? new Date(user[key]).toISOString().split("T")[0]
        : user[key as keyof IUserResponse];
    return formData[key] !== original;
  });

  const SELECT_STYLE =
    "w-full bg-[#0d0d0d] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:border-cyan-500/40 focus:outline-none appearance-none cursor-pointer transition-all font-medium";
  const INPUT_STYLE =
    "w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-[13px] text-white font-medium placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all";
  const LABEL_STYLE =
    "text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2 block";
  const authUserRole = authUser.role;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#0d0d0d] border border-neutral-800 w-full max-w-3xl rounded-[2.5rem] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        {/* Header - Fixed */}
        <div className="px-10 py-8 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-neutral-900 border border-neutral-800 text-cyan-400 rounded-2xl">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                Identity Override
              </h3>
              <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.3em] mt-2">
                Modifying Node:{" "}
                <span className="text-cyan-500/80">{user.username}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-700 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-10 overflow-y-auto scrollbar-hide"
        >
          {/* Section: System Access */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-neutral-400 border-l-2 border-cyan-500/40 pl-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest">
                System Privileges
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={LABEL_STYLE}>Authorization Level</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={SELECT_STYLE}
                >
                  {Object.values(UserRole).map((r) =>
                    r === "admin" || r === "moderator" ? (
                      authUserRole === "moderator" ? null : (
                        <option key={r} value={r}>
                          {r.toUpperCase()}
                        </option>
                      )
                    ) : (
                      <option key={r} value={r}>
                        {r.toUpperCase()}
                      </option>
                    ),
                  )}
                </select>
                <ChevronDown
                  className="absolute right-4 bottom-3 text-neutral-600 pointer-events-none"
                  size={14}
                />
              </div>
              <div className="relative">
                <label className={LABEL_STYLE}>Node Connectivity</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={SELECT_STYLE}
                >
                  {Object.values(UserStatus).map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 bottom-3 text-neutral-600 pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* Section: Core Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-neutral-400 border-l-2 border-cyan-500/40 pl-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest">
                Network Identifiers
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={LABEL_STYLE}>Username Handle</label>
                <div className="relative">
                  <AtSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
                    size={14}
                  />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-10`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={LABEL_STYLE}>Registry Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
                    size={14}
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Personal Data */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-neutral-400 border-l-2 border-cyan-500/40 pl-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest">
                Biological & Social Data
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={LABEL_STYLE}>First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_STYLE}>Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_STYLE}>Birth Epoch</label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700"
                    size={14}
                  />
                  <input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-10 uppercase text-[11px]`}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={LABEL_STYLE}>Location String</label>
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                  placeholder="City, Node"
                />
              </div>
              <div className="relative">
                <label className={LABEL_STYLE}>Gender Assignment</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={SELECT_STYLE}
                >
                  {Object.values(UserGender).map((g) => (
                    <option key={g} value={g}>
                      {g.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 bottom-3 text-neutral-600 pointer-events-none"
                  size={14}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={LABEL_STYLE}>Biography Fragment</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className={`${INPUT_STYLE} h-24 resize-none pt-4`}
              />
            </div>
          </div>

          {/* Section: Protocols */}
          <div className="pt-4">
            <div className="flex items-center justify-between p-6 bg-neutral-900/20 border border-neutral-800 rounded-3xl group transition-all hover:border-neutral-700">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-white uppercase tracking-wider">
                  Public Email Protocol
                </p>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-tight">
                  Broadcast email to other network nodes
                </p>
              </div>
              <input
                type="checkbox"
                name="isEmailPublic"
                checked={formData.isEmailPublic}
                onChange={handleChange}
                className="w-5 h-5 rounded-md border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions - Fixed */}
        <div className="px-10 py-8 border-t border-neutral-900 bg-neutral-900/10 flex justify-end items-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 hover:text-white transition-all"
          >
            Abort_Changes
          </button>
          <button
            disabled={!isDirty}
            onClick={() => onSave(user.id, formData)}
            className="px-12 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 active:scale-95 transition-all"
          >
            Commit_Override
          </button>
        </div>
      </div>
    </div>
  );
}
