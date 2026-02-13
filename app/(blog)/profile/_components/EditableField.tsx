"use client";

import { useState } from "react";
import api from "@/api/axios";
import { IUpdateMeDto } from "@/app/types/update-me.dto";
import {
  Edit,
  Mail,
  User,
  Lock,
  Save,
  XCircle,
  Info,
  Hash,
  Calendar,
  ChevronRight,
  Smile,
  X,
} from "lucide-react";

interface EditableFieldProps {
  label: string;
  fieldKey: keyof IUpdateMeDto;
  initialValue: string;
  isTextArea?: boolean;
  type?: "text" | "email" | "password" | "username" | "date";
  selectOptions?: { value: string; label: string }[];
  onSuccess: () => void;
}

const EditableField = ({
  label,
  fieldKey,
  initialValue,
  isTextArea = false,
  type,
  selectOptions,
  onSuccess,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const getFieldIcon = (fieldType: string | undefined) => {
    switch (fieldType) {
      case "email":
        return Mail;
      case "username":
        return User;
      case "date":
        return Calendar;
      case "password":
        return Lock;
      default:
        return selectOptions ? Smile : Info;
    }
  };

  const CurrentIcon = getFieldIcon(type);

  const handleSave = async () => {
    // Basic validations
    if (type === "email" && !/\S+@\S+\.\S+/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    if (type === "password" && value.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!value && fieldKey !== "gender") {
      setError("Field cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload: IUpdateMeDto = { [fieldKey]: value };
      await api.patch("/user/update", payload);
      setIsEditing(false);
      onSuccess();
    } catch (err: unknown) {
      setError("Update failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayValue = initialValue || "Not specified.";

  // 🎨 Flat & Sharp Styling Tokens
  const inputBaseStyles =
    "w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-[13px] text-white font-bold placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none";

  return (
    <div
      className={`p-6 border rounded-[2rem] transition-all duration-300 ${
        isEditing
          ? "bg-neutral-900/30 border-neutral-700"
          : "bg-neutral-950 border-neutral-800"
      }`}
    >
      {/* Label & Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CurrentIcon size={14} className="text-cyan-500" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            {label}
          </span>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setError("");
            }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Edit size={12} />
            <span>Modify</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        /* Static View */
        <p className="text-sm font-bold text-white tracking-tight break-all">
          {type === "password" ? "••••••••" : displayValue}
        </p>
      ) : (
        /* Edit Mode */
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="relative group">
            <CurrentIcon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-cyan-500 transition-colors z-10"
            />

            {selectOptions ? (
              <>
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={inputBaseStyles}
                >
                  <option value="" disabled>
                    Select {label}
                  </option>
                  {selectOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-neutral-950"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  size={14}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-neutral-600 pointer-events-none"
                />
              </>
            ) : isTextArea ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                className={`${inputBaseStyles} resize-none py-4`}
              />
            ) : (
              <input
                type={
                  type === "date"
                    ? "date"
                    : type === "password"
                      ? "password"
                      : "text"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputBaseStyles}
              />
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-500 px-2">
              <XCircle size={12} /> <span>{error}</span>
            </div>
          )}

          {/* Action Buttons: Flat & Sharp */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              onClick={() => {
                setValue(initialValue);
                setIsEditing(false);
              }}
              className="px-4 py-2 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <X size={12} /> Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || value === initialValue}
              className="px-5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-[10px] uppercase tracking-widest text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all disabled:opacity-30 active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Hash size={12} className="animate-spin" /> Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={12} /> Commit Change
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
