"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function StatusGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !isLoading &&
      user &&
      user.status !== "active" &&
      pathname !== "/restricted"
    ) {
      router.replace("/restricted");
    }
  }, [user, isLoading, pathname, router]);

  if (user && user.status !== "active" && pathname !== "/restricted") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-[10px] text-neutral-600 tracking-[0.4em]">
        <Loader2 className="animate-spin mr-3 text-cyan-500" size={18} />
        VALIDATING_PROTOCOL_STATUS...
      </div>
    );
  }

  return <>{children}</>;
}
