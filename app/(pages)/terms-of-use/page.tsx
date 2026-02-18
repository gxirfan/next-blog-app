import TermsOfUse from "@/app/components/Legal/TermsOfUse";
import type { Metadata } from "next";
import { ENV } from "@/config/env.config";

const BLOG_NAME = ENV.PROJECT_NAME;
const LAST_UPDATED = "November 24, 2025";

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
