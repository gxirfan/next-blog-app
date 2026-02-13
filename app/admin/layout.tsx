import { Metadata } from "next";
import React from "react";
import AuthChecker from "./_components/AuthChecker";
import NavBar from "@/app/components/Navbar";
import BackButton from "@/app/components/BackButton";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthChecker>
      <div className="bg-neutral-950 min-h-screen pt-16">
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
    </AuthChecker>
  );
}
