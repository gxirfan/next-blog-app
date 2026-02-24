import { ENV } from "@/config/env.config";

interface PrivacyPolicyProps {
  blogName: string;
  effectiveDate: string;
}

const PrivacyPolicy = ({ blogName, effectiveDate }: PrivacyPolicyProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-neutral-950 rounded-lg text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">
        **Effective Date:** {effectiveDate}
      </p>

      <p className="mb-4">
        This Privacy Policy describes how **{blogName}** ("we," "us," or "our")
        collects, uses, and shares your personal information and content when
        you use our blog and services (the "Service").
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We collect various types of information for different purposes to
          provide and improve our Service to you.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            **Personal Data:** Your name, email address, and profile
            information.
          </li>
          <li>
            **Usage Data:** IP address, browser type, pages visited, time spent,
            and diagnostic data.
          </li>
          <li>
            **Content Data:** All content you share, post, {ENV.POST_TYPE},
            upload, or submit to the Service (comments, articles, etc.).
          </li>
          <li>
            **Tracking & Cookies Data:** Used to track activity and hold certain
            information. (See **Cookie Policy** for details).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h4>2. How We Use Your Data</h4>

        <p className="mb-4 font-bold text-red-600">
          Your data is used for the following specific purposes, which you
          explicitly agree to by using the Service:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-neutral-200">
          <li>
            **For Project Development and Improvement:** To analyze usage
            patterns, test new features, troubleshoot, and continually enhance
            the functionality, user experience, and performance of the Service.
          </li>
          <li>
            **For Personalization and Advertising:** To personalize the content
            and advertisements you see, both on our Service and third-party
            platforms. This includes using your browsing history, content
            interaction, and personal profile information for targeted
            advertising.
          </li>
          <li>
            **For Internal Analysis and Reporting:** To generate aggregated,
            anonymized, and non-anonymized reports, conduct **internal
            evaluations**, and provide insights for business decisions related
            to the project&apos;s performance.
          </li>
          <li>To provide, operate, and maintain our Service.</li>
        </ul>
      </section>

      {/* ... Other sections (Disclosure, Rights, Security) ... */}
    </div>
  );
};

export default PrivacyPolicy;
