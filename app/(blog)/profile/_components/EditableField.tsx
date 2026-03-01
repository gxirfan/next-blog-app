"use client";

import { useState, useEffect, useMemo } from "react";
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
  Calendar,
  ChevronRight,
  Smile,
  Mars,
  Venus,
  Transgender,
  Loader2,
} from "lucide-react";

interface EditableFieldProps {
  label: string;
  fieldKey: keyof IUpdateMeDto;
  initialValue: string | null | undefined;
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
  const [value, setValue] = useState(initialValue ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const CurrentIcon = useMemo(() => {
    switch (type) {
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
  }, [type, selectOptions]);

  const handleSave = async () => {
    if (type === "email" && !/\S+@\S+\.\S+/.test(value as string)) {
      setError("Enter a valid email address.");
      return;
    }
    if (type === "password" && (value as string).length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const requiredFields = ["email", "username"];
    if (!value && requiredFields.includes(fieldKey as string)) {
      setError("Field cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload: IUpdateMeDto = { [fieldKey]: value === "" ? null : value };
      await api.patch("/user/update", payload);

      setIsSaving(false);
      setIsEditing(false);
      setIsSyncing(true);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setIsSaving(false);
      setIsSyncing(false);
    }
  };

  const displayValue = initialValue || "Not specified.";

  const inputBaseStyles =
    "w-full pl-4 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-[13px] text-white font-medium focus:outline-none focus:border-cyan-500/50 transition-all appearance-none";

  return (
    <div
      className={`rounded-2xl relative p-6 border transition-all duration-300 overflow-hidden ${isEditing ? "bg-neutral-900/20 border-neutral-700" : "bg-black border-neutral-900"}`}
    >
      {isSyncing && (
        <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
          <Loader2 size={20} className="text-cyan-500 animate-spin mb-2" />
          <span className="text-[10px] font-black font-jetbrains-mono tracking-widest text-neutral-400">
            SYNCING DATA
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 border rounded-md ${isEditing ? "border-cyan-500/30 text-cyan-500" : "border-neutral-800 text-neutral-600"}`}
          >
            <CurrentIcon size={14} />
          </div>
          <span className="text-xs font-black font-jetbrains-mono tracking-[0.25em] text-neutral-500">
            {label}
          </span>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-neutral-600 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded transition-all cursor-pointer"
          >
            <Edit size={14} />
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex items-center justify-between group">
          <div className="text-sm font-bold text-neutral-200 tracking-tight">
            {type === "password" ? (
              "••••••••"
            ) : fieldKey === "gender" ? (
              <span className="flex items-center gap-2">
                {displayValue === "male" && (
                  <Mars size={16} className="text-cyan-400" />
                )}
                {displayValue === "female" && (
                  <Venus size={16} className="text-pink-400" />
                )}
                {displayValue === "other" && (
                  <Transgender size={16} className="text-neutral-400" />
                )}
                <span className="capitalize">{displayValue as string}</span>
              </span>
            ) : (
              displayValue
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="relative">
            {selectOptions ? (
              <div className="relative">
                <select
                  value={value ?? ""}
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
              </div>
            ) : isTextArea ? (
              <textarea
                value={value ?? ""}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                className={`${inputBaseStyles} resize-none py-3 pl-4`}
                placeholder={`Enter your ${label.toLowerCase()}...`}
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
                value={value ?? ""}
                onChange={(e) => setValue(e.target.value)}
                className={inputBaseStyles}
                autoFocus
              />
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 px-1">
              <XCircle size={12} />{" "}
              <span className="tracking-tighter">{error}</span>
            </div>
          )}

          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue(initialValue ?? "");
                setIsEditing(false);
                setError("");
              }}
              className="px-3 py-2 text-[10px] font-black font-jetbrains-mono tracking-widest text-neutral-600 hover:text-white transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={
                isSaving || (value === initialValue && type !== "password")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded font-black text-[10px] font-jetbrains-mono tracking-widest hover:bg-cyan-500 transition-all disabled:opacity-20 active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}{" "}
              SAVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
