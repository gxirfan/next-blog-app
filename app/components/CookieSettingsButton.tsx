"use client";

import React, { useState } from "react";
import { CookieSettingsModal } from "./CookieSettingsModal";

export const CookieSettingsButton: React.FC = () => {
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
          blogName="Blog App"
        />
      )}
    </>
  );
};
