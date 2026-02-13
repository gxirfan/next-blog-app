"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface CookieConsentProps {
  blogName: string;
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

export const CookieSettingsModal: React.FC<CookieConsentProps> = ({
  blogName,
  isExternalSettingsModalOpen,
  onCloseExternalSettingsModal,
}) => {
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
    <div className="bg-neutral-950 rounded-xl max-w-lg w-full p-8 space-y-6 transform transition-all duration-300 scale-100 border border-neutral-700">
      <h2
        id="cookie-consent-title"
        className="text-2xl font-bold text-white border-b border-neutral-700 pb-3 flex items-center space-x-3"
      >
        <Settings size={28} className={ACCENT_COLOR_CLASS} />
        <span>
          {isSettingsView ? "Cookie Preferences" : "Your Privacy Matters"}
        </span>
      </h2>

      <p className="text-neutral-400 leading-relaxed text-sm">
        {isSettingsView
          ? "Adjust your preferences below. Your choices help us improve our service and content delivery."
          : `We use cookies and similar technologies for advertising, project development, and internal analytics to ensure legal compliance and project stability.`}
      </p>

      {/* Essential Cookies */}
      <div className={`bg-neutral-900 p-4 rounded-lg border ${BORDER_COLOR}`}>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-white flex items-center space-x-2">
            <CheckCircle size={18} className="text-green-500" />
            <span>Essential Cookies</span>
          </p>
          <span className="text-xs font-medium text-green-500">
            Always Required
          </span>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Required for the basic functionality of the site (session management,
          security) and cannot be disabled.
        </p>
      </div>

      {/* Toggleable Categories */}
      {COOKIE_CATEGORIES.map((category) => {
        const key = category.key as "analytics" | "marketing";
        const isChecked = preferences[key];

        return (
          <div key={key} className={`p-4 border-b ${BORDER_COLOR}`}>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white">{category.title}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(key)}
                  className="sr-only peer"
                />
                {/* Toggle Switch Design (Using Cyan) */}
                <div
                  className={`w-11 h-6 bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-300 after:border after:border-neutral-700 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600`}
                ></div>
              </label>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {category.description}
            </p>
          </div>
        );
      })}

      {/* Legal Links */}
      <div className="flex space-x-4 pt-2 justify-center">
        <Link href="/terms-of-use" className={LINK_CLASS} target="_blank">
          Terms
        </Link>
        <Link href="/privacy-policy" className={LINK_CLASS} target="_blank">
          Privacy
        </Link>
        <Link href="/cookie-policy" className={LINK_CLASS} target="_blank">
          Cookie Policy
        </Link>
      </div>

      {/* Button Actions */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-700">
        {isSettingsView && (
          <>
            <button onClick={handleAcceptAll} className={PRIMARY_BUTTON_CLASS}>
              <CheckCircle size={16} className="mr-2" />
              Accept All and Save
            </button>
            <div className="flex justify-between space-x-3">
              <button
                onClick={handleDeclineAll}
                className={SECONDARY_BUTTON_CLASS}
              >
                Decline All
              </button>
              <button
                onClick={() => handleSaveAndClose()}
                className={SECONDARY_BUTTON_CLASS}
              >
                Save Preferences
              </button>
            </div>
          </>
        )}

        {isBlockingModalVisible && (
          <>
            <button onClick={handleAcceptAll} className={PRIMARY_BUTTON_CLASS}>
              <CheckCircle size={16} className="mr-2" />
              Accept All and Continue
            </button>
            <div className="flex justify-between space-x-3">
              <button
                onClick={handleDeclineAll}
                className={SECONDARY_BUTTON_CLASS}
              >
                Decline All
              </button>
              <button
                onClick={handleEditSettings}
                className={SECONDARY_BUTTON_CLASS}
              >
                Edit Settings
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
