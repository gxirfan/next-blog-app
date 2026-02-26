"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

interface CookieConsentProps {
  blogName: string;
}

const LEGAL_PATHS = ["/privacy-policy", "/terms-of-use", "/cookie-policy"];

export const CookieConsentModal = ({ blogName }: CookieConsentProps) => {
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
  }, [pathname]);

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

  const handleConsent = (status: "accepted" | "declined") => {
    localStorage.setItem("cookieConsent", status);

    setIsVisible(false);
    document.body.style.overflow = "unset";

    if (status === "accepted") {
      localStorage.setItem(
        "cookiePreferences",
        JSON.stringify({
          ...DEFAULT_PREFERENCES,
          analytics: true,
          marketing: true,
        }),
      );
      // loadTrackingScripts();
    } else {
      localStorage.setItem(
        "cookiePreferences",
        JSON.stringify(DEFAULT_PREFERENCES),
      );
      //only essential cookies loaded.
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="bg-neutral-950 border-2 border-neutral-900 rounded-[2.5rem] max-w-lg w-full p-10 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-neutral-600">
            <Shield size={14} />
            <span>Privacy Notice</span>
          </div>
          <h2
            id="cookie-consent-title"
            className="text-3xl font-black text-white tracking-tighter leading-none"
          >
            Your Privacy
          </h2>
          <div className="h-1 w-12 bg-white rounded-full" />
        </div>

        <div className="space-y-4">
          <p className="text-neutral-400 text-sm font-bold leading-relaxed">
            To provide a better experience, **{blogName}** uses cookies for
            analytics and project stability. By continuing, you agree to our
            data usage protocols.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            {["Privacy", "Cookie", "Terms"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(" ", "-")}${item === "Terms" ? "-of-use" : "-policy"}`}
                className="text-[10px] font-black text-neutral-600 hover:text-white tracking-widest transition-colors border-b border-transparent hover:border-white"
                target="_blank"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t-2 border-neutral-900">
          <button
            onClick={() => handleConsent("accepted")}
            className="w-full h-14 bg-white text-black font-black text-[11px] tracking-[0.3em] rounded-full hover:bg-neutral-200 transition-all active:scale-95 flex items-center justify-center"
          >
            Accept All
          </button>
          <button
            onClick={() => handleConsent("declined")}
            className="w-full h-12 bg-transparent text-neutral-500 font-black text-[10px] tracking-[0.2em] rounded-full border-2 border-neutral-900 hover:bg-neutral-900 hover:text-neutral-300 transition-all"
          >
            Decline (Essential Only)
          </button>
        </div>
      </div>
    </div>
  );
};
