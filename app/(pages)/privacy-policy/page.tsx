import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/Legal/PrivacyPolicy";

// Sayfa meta verileri (SEO)
export const metadata: Metadata = {
  title: `Privacy Policy - ${process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog Project"}`,
  description: `Read the detailed Privacy Policy for ${process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog Project"}. Last updated November 24, 2025.`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-12">
      <PrivacyPolicy
        blogName={process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog Project"}
        effectiveDate={"November 24, 2025"}
      />
    </main>
  );
}
