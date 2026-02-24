import { Metadata } from "next";
import React from "react";
import NavBar from "@/app/components/Navbar";
import BackButton from "@/app/components/BackButton";
import { cookies } from "next/headers";
import { ENV } from "@/config/env.config";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Admin Pannel",
  description: "Administration area for managing blog content.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

async function getCurrentUser() {
  const cookieList = await cookies();
  const res = await fetch(`${ENV.API_URL}/auth/status`, {
    cache: "no-store",
    headers: {
      Cookie: cookieList.toString(),
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();
  if (
    !session?.data?.user ||
    (session.data.user.role !== "admin" &&
      session.data.user.role !== "moderator")
  ) {
    redirect("/login?returnUrl=/admin");
  }
  return (
    <div className="bg-neutral-950 min-h-screen pt-16 px-4">
      {/* <div className="p-4 border-b border-gray-800 text-sm text-neutral-500">
          ADMINISTRATOR ACCESS ONLY
        </div> */}

      <NavBar />

      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        {children}
      </div>
    </div>
  );
}
