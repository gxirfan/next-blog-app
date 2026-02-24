"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { AlertTriangle, ShieldOff } from "lucide-react";
import { useEffect } from "react";

export default function RestrictedPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.status === "active")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const isBanned = user.status === "banned";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full space-y-8 animate-in zoom-in-95 duration-500">
        <div className="border border-red-500/20 p-10 rounded-[2.5rem] text-center space-y-6">
          <div className="inline-flex p-5 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-red-500 mb-4">
            {isBanned ? <ShieldOff size={40} /> : <AlertTriangle size={40} />}
          </div>

          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            {isBanned ? "BANNED" : "SUSPENDED"}
          </h1>

          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 leading-relaxed">
              {isBanned
                ? "Your identity has been permanently purged from the central grid due to protocol violations."
                : "Your access to the network has been temporarily throttled. Review process is ongoing."}
            </p>

            <div className="py-3 px-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
              <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest">
                Status: {user.status?.toUpperCase()}{" "}
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => logout()}
              className="w-full h-14 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all"
            >
              Sign Out
            </button>
            {/* <Link
              href="/"
              className="text-[10px] text-neutral-600 hover:text-neutral-400 uppercase tracking-widest transition-all"
            >
              Return To Public Grid
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
