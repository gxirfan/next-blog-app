"use client";

import { useState, useEffect } from "react";
import { Mail, Loader, CheckCircle, XCircle } from "lucide-react";
import api from "@/api/axios";

interface EmailPrivacyToggleProps {
  initialStatus: boolean;
  onUpdateSuccess: () => void;
}

const EmailPrivacyToggle = ({
  initialStatus,
  onUpdateSuccess,
}: EmailPrivacyToggleProps) => {
  const [isPublic, setIsPublic] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const ACCENT_COLOR = "text-cyan-400";
  const TEXT_SUCCESS = "text-green-400";
  const TEXT_DANGER = "text-red-400";

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    setStatusMessage("");

    const newValue = !isPublic;

    try {
      const payload = { isEmailPublic: newValue };

      await api.patch("/user/update", payload);

      setIsPublic(newValue);
      onUpdateSuccess();
      setStatusMessage(
        `Visibility successfully changed to ${newValue ? "PUBLIC" : "PRIVATE"}.`,
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Update failed. Check API path/method.";

      setIsPublic(isPublic);
      setStatusMessage(errorMessage.toString().substring(0, 80));
    } finally {
      setLoading(false);
    }
  };

  const statusText = isPublic ? "PUBLIC" : "PRIVATE";
  const statusColor = isPublic ? TEXT_SUCCESS : TEXT_DANGER;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail size={18} className={ACCENT_COLOR} />
          <span className="text-white font-medium">Email Visibility</span>

          {loading && (
            <Loader size={16} className={`${ACCENT_COLOR} animate-spin ml-2`} />
          )}
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={handleToggle}
            disabled={loading}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-neutral-700 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600`}
          ></div>
          <span className={`ml-3 text-sm font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </label>
      </div>

      {statusMessage && (
        <p
          className={`text-xs mt-2 font-medium flex items-center space-x-1 ${
            statusMessage.startsWith("Error") ||
            statusMessage.includes("failed")
              ? TEXT_DANGER
              : TEXT_SUCCESS
          }`}
        >
          {statusMessage.startsWith("Error") ||
          statusMessage.includes("failed") ? (
            <XCircle size={14} />
          ) : (
            <CheckCircle size={14} />
          )}
          <span>{statusMessage}</span>
        </p>
      )}

      <p className="text-xs text-neutral-500 mt-1">
        To change this setting, please check the Privacy Policy for associated
        risks.
      </p>
    </div>
  );
};

export default EmailPrivacyToggle;
