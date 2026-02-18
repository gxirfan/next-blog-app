import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/Legal/PrivacyPolicy";
import { ENV } from "@/config/env.config";

export const metadata: Metadata = {
  title: `Privacy Policy - ${ENV.PROJECT_NAME}`,
  description: `Read the detailed Privacy Policy for ${ENV.PROJECT_NAME}. Last updated November 24, 2025.`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 py-12">
      <PrivacyPolicy
        blogName={ENV.PROJECT_NAME}
        effectiveDate={"November 24, 2025"}
      />
    </main>
  );
}
