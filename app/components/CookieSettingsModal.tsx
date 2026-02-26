"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, CheckCircle } from "lucide-react";

interface CookieConsentProps {
  isExternalSettingsModalOpen: boolean;
  onCloseExternalSettingsModal: () => void;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  version: number;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: 1,
};

const LEGAL_PATHS = ["/terms-of-use", "/privacy-policy", "/cookie-policy"];

const COOKIE_CATEGORIES = [
  {
    key: "analytics",
    title: "Analytics and Performance Cookies",
    description:
      "Used to measure site performance and internal analysis and reporting for project development.",
    required: false,
  },
  {
    key: "marketing",
    title: "Marketing and Advertising Cookies",
    description:
      "Used to display relevant ads and support revenue generation for the project.",
    required: false,
  },
];

export const CookieSettingsModal = ({
  isExternalSettingsModalOpen,
  onCloseExternalSettingsModal,
}: CookieConsentProps) => {
  const [isBlockingModalVisible, setIsBlockingModalVisible] = useState(false);
  const [isInternalSettingsVisible, setIsInternalSettingsVisible] =
    useState(false);

  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const pathname = usePathname();

  const isSettingsModalActive =
    isExternalSettingsModalOpen || isInternalSettingsVisible;
  const currentModalVisible = isBlockingModalVisible || isSettingsModalActive;

  const ACCENT_COLOR_CLASS = "text-cyan-400";
  const PRIMARY_BUTTON_CLASS =
    "px-6 py-3 text-base font-semibold text-black bg-green-600 rounded-lg hover:bg-green-500 transition disabled:opacity-50 flex items-center space-x-2 justify-center cursor-pointer";
  const SECONDARY_BUTTON_CLASS =
    "px-6 py-2 text-sm font-semibold text-neutral-300 border border-neutral-600 rounded-lg hover:bg-neutral-800 transition cursor-pointer";
  const LINK_CLASS =
    "text-sm text-cyan-400 hover:text-cyan-300 underline transition";
  const BORDER_COLOR = "border-neutral-700";

  useEffect(() => {
    const savedPrefs = localStorage.getItem("cookiePreferences");
    let prefs: CookiePreferences;

    if (savedPrefs) {
      prefs = JSON.parse(savedPrefs);
      setPreferences(prefs);
    } else {
      prefs = DEFAULT_PREFERENCES;
    }

    const hasConsented = savedPrefs !== null;
    const shouldShowBlockingModal =
      !hasConsented && LEGAL_PATHS.every((path) => !pathname.startsWith(path));

    if (!isSettingsModalActive) {
      setIsBlockingModalVisible(shouldShowBlockingModal);
    }

    if (currentModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    pathname,
    isExternalSettingsModalOpen,
    isInternalSettingsVisible,
    currentModalVisible,
    isSettingsModalActive,
  ]);

  const handleToggle = (
    key: keyof Omit<CookiePreferences, "necessary" | "version">,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveAndClose = (finalPreferences?: CookiePreferences) => {
    const prefsToSave = finalPreferences || preferences;
    localStorage.setItem("cookiePreferences", JSON.stringify(prefsToSave));

    setIsBlockingModalVisible(false);
    setIsInternalSettingsVisible(false);

    if (isExternalSettingsModalOpen) {
      onCloseExternalSettingsModal();
    }

    document.body.style.overflow = "unset";
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      ...DEFAULT_PREFERENCES,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    handleSaveAndClose(allAccepted);
  };

  const handleDeclineAll = () => {
    const allDeclined = {
      ...DEFAULT_PREFERENCES,
      analytics: false,
      marketing: false,
    };
    setPreferences(allDeclined);
    handleSaveAndClose(allDeclined);
  };

  const handleEditSettings = () => {
    setIsBlockingModalVisible(false);
    setIsInternalSettingsVisible(true);
  };

  if (!currentModalVisible) {
    return null;
  }

  const isSettingsView = isSettingsModalActive;

  const ModalContent = (
    <div className="bg-neutral-950 rounded-[3rem] max-w-lg w-full p-10 space-y-8 transform transition-all duration-300 scale-100 border-2 border-neutral-900 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-neutral-900/20 rounded-full blur-3xl pointer-events-none" />

      <header className="space-y-4 relative z-10">
        <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-neutral-600">
          <Settings size={14} />
          <span>Privacy Protocol</span>
        </div>
        <h2
          id="cookie-consent-title"
          className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none"
        >
          {isSettingsView ? "Cookie Preferences" : "Your Privacy Matters"}
        </h2>
        <div className="h-1.5 w-12 bg-cyan-600 rounded-full" />
      </header>

      <p className="text-neutral-500 font-bold leading-relaxed text-sm relative z-10">
        {isSettingsView
          ? "Adjust your preferences below. Your choices help us improve our service and content delivery."
          : `We use cookies and similar technologies for advertising, project development, and internal analytics to ensure legal compliance.`}
      </p>

      <div className="bg-neutral-950 p-6 rounded-[2rem] border-2 border-neutral-900 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="font-black text-white text-xs tracking-widest flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span>Essential Cookies</span>
          </p>
          <span className="text-[10px] font-black text-emerald-500 tracking-tighter bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">
            Required
          </span>
        </div>
        <p className="text-[13px] text-neutral-600 font-medium">
          Necessary for session management and core security protocols.
        </p>
      </div>

      <div className="space-y-2">
        {COOKIE_CATEGORIES.map((category) => {
          const key = category.key as "analytics" | "marketing";
          const isChecked = preferences[key];

          return (
            <div
              key={key}
              className="p-6 bg-neutral-900/20 border-b-2 border-neutral-900 last:border-0"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-black text-white text-xs tracking-widest">
                  {category.title}
                </p>
                <label className="relative inline-flex items-center cursor-pointer scale-110">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-neutral-900 rounded-full border-2 border-neutral-800 peer-checked:bg-cyan-600 peer-checked:border-cyan-500 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-neutral-700 peer-checked:after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-6"></div>
                </label>
              </div>
              <p className="text-[13px] text-neutral-600 font-medium leading-snug">
                {category.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-6 justify-center">
        {["Terms", "Privacy", "Cookie Policy"].map((item, idx) => (
          <Link
            key={idx}
            href={
              item === "Terms"
                ? "/terms-of-use"
                : item === "Privacy"
                  ? "/privacy-policy"
                  : "/cookie-policy"
            }
            className="text-[10px] font-black text-neutral-700 hover:text-white tracking-[0.2em] transition-colors"
            target="_blank"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-6 border-t-2 border-neutral-900">
        {isSettingsView && (
          <>
            <button
              onClick={handleAcceptAll}
              className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-[11px] tracking-[0.2em] rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Accept All and Save
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDeclineAll}
                className="h-12 border-2 border-neutral-900 text-neutral-400 font-black text-[10px] tracking-widest rounded-full hover:bg-neutral-900 transition-all"
              >
                Decline All
              </button>
              <button
                onClick={() => handleSaveAndClose()}
                className="h-12 bg-neutral-900 text-white font-black text-[10px] tracking-widest rounded-full hover:bg-neutral-800 transition-all"
              >
                Save Choices
              </button>
            </div>
          </>
        )}

        {isBlockingModalVisible && (
          <>
            <button
              onClick={handleAcceptAll}
              className="w-full h-14 bg-white hover:bg-neutral-200 text-black font-black text-[11px] tracking-[0.3em] rounded-full transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Accept All Protocol
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDeclineAll}
                className="h-12 border-2 border-neutral-900 text-neutral-500 font-black text-[10px] tracking-widest rounded-full hover:bg-neutral-900 transition-all"
              >
                Reject
              </button>
              <button
                onClick={handleEditSettings}
                className="h-12 bg-neutral-900 text-white font-black text-[10px] tracking-widest rounded-full hover:bg-neutral-800 transition-all"
              >
                Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed top-0 inset-0 bg-black/80 flex items-center justify-center p-4 z-9999"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      {ModalContent}
    </div>
  );
};
