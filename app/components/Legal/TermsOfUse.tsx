interface TermsOfUseProps {
  blogName: string;
  lastUpdated: string;
}

const TermsOfUse = ({ blogName, lastUpdated }: TermsOfUseProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-neutral-950 rounded-lg text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      <p className="text-sm mb-8">**Last updated:** {lastUpdated}</p>

      <p className="mb-4">
        Please read these Terms of Use ("Terms") carefully before using the **
        {blogName}** website and the Service operated by **{blogName}**.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. User Content and License Grant
        </h2>
        <p className="mb-4">
          **Crucially, by posting, uploading, inputting, providing or submitting
          your Content, you grant {blogName} a worldwide, non-exclusive,
          perpetual, irrevocable, royalty-free, sublicensable, and transferable
          license to use, reproduce, modify, adapt, publish, translate, create
          derivative works from, distribute, publicly perform, and publicly
          display your Content** for any purpose, **including but not limited to
          advertising, product development, and internal analysis for project
          evaluation.**
        </p>
        <p className="text-sm italic">
          You represent and warrant that you own or otherwise control all of the
          rights to the Content that you post.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. User Obligations and Prohibited Uses
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Violating any applicable law or regulation.</li>
          <li>Sending unauthorized advertising or promotional material.</li>
          <li>Impersonating another person or entity.</li>
        </ul>
      </section>

      {/* ... Other sections (Limitation of Liability, Intellectual Property) ... */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Content Restrictions</h2>
        <p className="mb-4">
          {blogName} is a platform dedicated to technology, software, and
          knowledge sharing, and aims to maintain a neutral and respectful
          environment. To achieve this, we enforce a strict policy regarding the
          following topics:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Political Content: Any form of political propaganda, political
            debates, or partisan content is strictly prohibited.
          </li>
          <li>
            Religious Content: Discussions, promotions, or debates regarding
            religious beliefs, ideologies, or practices are strictly prohibited.
          </li>
          <li>
            Hate Speech: Content that promotes discrimination or hatred based on
            race, gender, or any other identity is strictly forbidden.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          4. User Responsibility and Liability
        </h2>
        <p className="mb-4">
          All content posted on {blogName}—including posts, comments, and
          profile information—is the sole responsibility of the user who created
          it.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Individual Liability: You, as the user, are exclusively liable for
            any legal, social, or personal consequences arising from your posts.
          </li>
          <li>
            Indemnification: You agree to indemnify and hold {blogName} and its
            operators harmless from any claims, damages, or legal fees resulting
            from your violation of these terms.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          5. Monitoring and Enforcement
        </h2>
        <p className="mb-4">
          We reserve the right, but do not assume the obligation, to monitor and
          remove any content that violates the "No Politics and No Religion"
          policy.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Right to Remove: Any content deemed political or religious in nature
            will be removed without prior notice.
          </li>
          <li>
            Account Termination: Repeated or severe violations of these
            community standards will lead to permanent suspension or termination
            of your account.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Legal Disclaimer</h2>
        <p className="mb-4">
          {blogName} does not endorse, support, or guarantee the completeness,
          truthfulness, or reliability of any content posted by users. Use of
          any content on this platform is at your own risk.
        </p>
      </section>

      <p className="mb-4">
        The Service is provided on an &apos;AS IS&apos; and &apos;AS
        AVAILABLE&apos; basis. {blogName} makes no warranties, expressed or
        implied, regarding the reliability or availability of the service.
      </p>

      <p className="mb-4">
        Your privacy is important to us. Please review our{" "}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        to understand how we collect, use, and share your personal data.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. License</h2>
        <p className="mb-4">
          The {blogName} platform is licensed under the GNU Affero General
          Public License v3.0 (AGPL-3.0).
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
