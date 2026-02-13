// components/CookieConsentModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CookieConsentProps {
  blogName: string;
}

const LEGAL_PATHS = ["/privacy-policy", "/terms-of-use", "/cookie-policy"];

export const CookieConsentModal: React.FC<CookieConsentProps> = ({
  blogName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (LEGAL_PATHS.includes(pathname)) {
      setIsVisible(false);
      return;
    }

    const consent = localStorage.getItem("cookieConsent");

    if (consent !== "accepted" && consent !== "declined") {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    localStorage.setItem("cookieConsent", status);

    setIsVisible(false);
    document.body.style.overflow = "unset";

    if (status === "accepted") {
      // loadTrackingScripts();
    } else {
      //only essential cookies loaded.
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-9999"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="bg-neutral-950 rounded-xl max-w-lg w-full p-8 space-y-6 transform transition-all duration-300 scale-100">
        <h2
          id="cookie-consent-title"
          className="text-2xl font-bold text-neutral-100 border-b pb-2"
        >
          Important: Your Privacy Settings
        </h2>

        <p className="text-neutral-100 leading-relaxed">
          To comply with regulations, **{blogName}** requires your consent to
          use cookies and collect data related to your content and usage for
          **advertising, product development, and internal project
          evaluations.**
        </p>

        <p className="text-sm text-neutral-500">
          Please select your preference to proceed to the site.
        </p>

        <div className="flex space-x-4 text-sm font-medium">
          <Link
            href="/privacy-policy"
            className="text-indigo-600 hover:text-indigo-800 underline transition"
            target="_blank"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookie-policy"
            className="text-indigo-600 hover:text-indigo-800 underline transition"
            target="_blank"
          >
            Cookie Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="text-indigo-600 hover:text-indigo-800 underline transition"
            target="_blank"
          >
            Terms of Use
          </Link>
        </div>

        <div className="flex flex-col justify-end pt-4 border-t">
          <button
            onClick={() => handleConsent("accepted")}
            className="mb-3 h-16 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Accept and Continue
          </button>
          <button
            onClick={() => handleConsent("declined")}
            className="px-6 py-2 text-sm font-semibold text-neutral-100 border border-gray-300 rounded-lg hover:bg-neutral-900 transition"
          >
            Decline (Only Essential)
          </button>
        </div>
      </div>
    </div>
  );
};
