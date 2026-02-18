"use client";

import { useState } from "react";
import { CookieSettingsModal } from "./CookieSettingsModal";

export const CookieSettingsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="hover:text-white transition-colors cursor-pointer"
      >
        Cookie Settings
      </button>

      {isModalOpen && (
        <CookieSettingsModal
          isExternalSettingsModalOpen={isModalOpen}
          onCloseExternalSettingsModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
