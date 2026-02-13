import CookiePolicy from "@/app/components/Legal/CookiePolicy";
import type { Metadata } from "next";

const BLOG_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME || "Blog Project";
const EFFECTIVE_DATE = "November 24, 2025";

// Sayfa meta verileri (SEO)
export const metadata: Metadata = {
  title: `Cookie Policy - ${BLOG_NAME}`,
  description: `Read the Cookie Policy for ${BLOG_NAME}. Last updated ${EFFECTIVE_DATE}.`,
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-12">
      <CookiePolicy blogName={BLOG_NAME} effectiveDate={EFFECTIVE_DATE} />
    </main>
  );
}
