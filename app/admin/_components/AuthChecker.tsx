"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthCheckerProps {
  children: React.ReactNode;
}

const AuthChecker = ({ children }: AuthCheckerProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClientAuthorized, setIsClientAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isAuthorized =
      user && (user.role === "admin" || user.role === "moderator");

    if (isAuthorized) {
      setIsClientAuthorized(true);
    } else {
      router.replace("/login?error=unauthorized_admin");
    }
  }, [user, isLoading, router]);

  if (isLoading || !isClientAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-400">
        Checking access permissions...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthChecker;
