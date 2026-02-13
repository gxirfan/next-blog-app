import TermsOfUse from "@/app/components/Legal/TermsOfUse";
import type { Metadata } from "next";

const BLOG_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog Project";
const LAST_UPDATED = "November 24, 2025";

// Sayfa meta verileri (SEO)
export const metadata: Metadata = {
  title: `Terms of Use - ${BLOG_NAME}`,
  description: `Read the Terms of Use for ${BLOG_NAME}. Last updated ${LAST_UPDATED}.`,
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-12">
      <TermsOfUse blogName={BLOG_NAME} lastUpdated={LAST_UPDATED} />
    </main>
  );
}
