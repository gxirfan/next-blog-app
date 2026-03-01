"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import CreateTagCard from "./CreateTagCard";
import { Plus, X, ShieldCheck } from "lucide-react";

const TagManagementHeader = () => {
  const { user, isLoading } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const isAuthorized =
    user &&
    (user.role.toLowerCase() === "admin" ||
      user.role.toLowerCase() === "moderator");

  if (isLoading || !isAuthorized) {
    return null;
  }

  return (
    <div className="mb-12 space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-neutral-950 border border-neutral-900 rounded-4xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-cyan-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-urbanist text-sm font-black tracking-widest text-white leading-none">
              Tag Authority
            </h3>
            <p className="font-inter text-[10px] text-neutral-600 tracking-widest mt-1">
              Privileged Registry Access
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormVisible((prev) => !prev)}
          className={`group flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 active:scale-95 cursor-pointer
            ${
              isFormVisible
                ? "bg-red-500/5 border-red-500/20 text-red-500 hover:border-red-500"
                : "bg-neutral-900 border-neutral-800 text-cyan-500 hover:border-cyan-500 hover:text-white"
            }`}
        >
          <span className="font-mono text-[10px] font-black tracking-[0.2em]">
            {isFormVisible ? "Cancel Protocol" : "Initialize Tag"}
          </span>
          {isFormVisible ? (
            <X size={16} strokeWidth={3} />
          ) : (
            <Plus
              size={16}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          )}
        </button>
      </div>

      {/* Form Area */}
      {isFormVisible && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 ease-out">
          <div className="relative">
            {/* Decorative Connection Line */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-linear-to-b from-neutral-900 to-cyan-500/30" />
            <CreateTagCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManagementHeader;
