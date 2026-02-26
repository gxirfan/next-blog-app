"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  ChevronDown,
  Calendar,
  Mail,
  Fingerprint,
  Activity,
  User,
} from "lucide-react";
import { IUserResponse } from "@/app/types/user-response.dto";

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
  authUser: IUserResponse;
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
    "w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-6 py-4 text-[11px] font-black text-white focus:outline-none focus:border-white appearance-none cursor-pointer transition-all tracking-[0.2em]";
  const INPUT_STYLE =
    "w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-6 py-4 text-sm text-white font-black placeholder-neutral-800 focus:outline-none focus:border-white transition-all tracking-widest";
  const LABEL_STYLE =
    "text-[10px] font-black text-neutral-600 tracking-[0.3em] mb-3 block ml-2";

  const authUserRole = authUser.role;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-neutral-950 border-2 border-neutral-900 w-full max-w-3xl rounded-[3rem] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="px-12 py-10 border-b-2 border-neutral-900 flex justify-between items-center bg-neutral-950">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-neutral-900 border-2 border-neutral-800 text-white rounded-[1.5rem]">
              <Shield size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
                Identity Override
              </h3>
              <p className="text-[10px] text-neutral-700 font-black tracking-[0.4em]">
                Modifying Node:{" "}
                <span className="text-white">{user.username}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-neutral-800 hover:text-white transition-colors bg-neutral-900 rounded-full border border-neutral-800"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-12 space-y-16 overflow-y-auto scrollbar-hide flex-1"
        >
          <div className="space-y-10">
            <header className="flex items-center gap-4 border-l-4 border-neutral-800 pl-6">
              <Activity size={16} className="text-neutral-700" />
              <h4 className="text-[11px] font-black tracking-[0.4em] text-neutral-500">
                Clearance & Status
              </h4>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  className="absolute right-6 bottom-4 text-neutral-600 pointer-events-none"
                  size={16}
                />
              </div>
              <div className="relative">
                <label className={LABEL_STYLE}>Connection Status</label>
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
                  className="absolute right-6 bottom-4 text-neutral-600 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <header className="flex items-center gap-4 border-l-4 border-neutral-800 pl-6">
              <Fingerprint size={16} className="text-neutral-700" />
              <h4 className="text-[11px] font-black tracking-[0.4em] text-neutral-500">
                Network Identifiers
              </h4>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* <div className="space-y-3">
                <label className={LABEL_STYLE}>Username Handle</label>
                <div className="relative">
                  <AtSign
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800"
                    size={16}
                  />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-14`}
                  />
                </div>
              </div> */}
              <div className="space-y-3">
                <label className={LABEL_STYLE}>Nickname</label>
                <div className="relative">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800"
                    size={16}
                  />
                  <input
                    name="nickname"
                    type="text"
                    value={formData.nickname}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-14`}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className={LABEL_STYLE}>Registry Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800"
                    size={16}
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-14`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <header className="flex items-center gap-4 border-l-4 border-neutral-800 pl-6">
              <Shield size={16} className="text-neutral-700" />
              <h4 className="text-[11px] font-black tracking-[0.4em] text-neutral-500">
                Metadata Profile
              </h4>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className={LABEL_STYLE}>First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div className="space-y-3">
                <label className={LABEL_STYLE}>Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                />
              </div>
              <div className="space-y-3">
                <label className={LABEL_STYLE}>Birth Epoch</label>
                <div className="relative">
                  <Calendar
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-800"
                    size={16}
                  />
                  <input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`${INPUT_STYLE} pl-14`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className={LABEL_STYLE}>Location Node</label>
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className={INPUT_STYLE}
                  placeholder="CITY, REGION"
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
                  className="absolute right-6 bottom-4 text-neutral-600 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className={LABEL_STYLE}>Biography Fragment</label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={`${INPUT_STYLE} h-32 resize-none pt-6 leading-relaxed`}
                placeholder="RECORDS NOT INITIALIZED..."
              />
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-between p-8 bg-neutral-900 border-2 border-neutral-800 rounded-[2rem] hover:border-neutral-700 transition-all group">
              <div className="space-y-2">
                <p className="text-[11px] font-black text-white tracking-widest">
                  Public Email Protocol
                </p>
                <p className="text-[10px] text-neutral-600 font-bold tracking-tighter">
                  Broadcast identity to network nodes
                </p>
              </div>
              <input
                type="checkbox"
                name="isEmailPublic"
                checked={formData.isEmailPublic}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg border-2 border-neutral-800 bg-neutral-950 text-white focus:ring-0 cursor-pointer transition-all checked:bg-white"
              />
            </div>
          </div>
        </form>

        <div className="px-12 py-10 border-t-2 border-neutral-900 bg-neutral-950 flex justify-end items-center gap-10">
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-black tracking-[0.4em] text-neutral-700 hover:text-white transition-all"
          >
            Abort_Changes
          </button>
          <button
            disabled={!isDirty}
            onClick={() => onSave(user.id, formData)}
            className="px-16 py-5 bg-white text-black rounded-full text-[11px] font-black tracking-[0.4em] hover:bg-neutral-200 active:scale-95 disabled:opacity-10 transition-all"
          >
            Commit_Override
          </button>
        </div>
      </div>
    </div>
  );
}
