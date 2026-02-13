interface CookiePolicyProps {
  blogName: string;
  effectiveDate: string;
}

const CookiePolicy = ({ blogName, effectiveDate }: CookiePolicyProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-neutral-950 rounded-lg text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="text-sm mb-8">**Effective Date:** {effectiveDate}</p>

      <p className="mb-4">
        This Cookie Policy explains what cookies are and how we use them on the
        **{blogName}** website. You should read this policy to understand the
        types of cookies we use and how the information collected is utilized.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
        <p className="mb-4">We use Cookies for the following purposes:</p>

        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            **Necessary Cookies:** Essential for the basic functionality of **
            {blogName}**.
          </li>
          <li>
            **Analytical/Performance Cookies:** Used to measure and improve the
            site's performance. **This data is crucial for project development
            and internal reporting.**
          </li>
          <li>
            **Targeting/Advertising Cookies:** Track browsing habits to deliver
            relevant advertising to support **{blogName}**'s revenue generation.
          </li>
          <li>
            **Functionality Cookies:** Used to remember your preferences (e.g.,
            login status, language).
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          3. Your Choices Regarding Cookies
        </h2>
        <p>
          If you wish to avoid the use of Cookies on the **{blogName}** Service,
          you must first disable them in your browser settings and then delete
          the Cookies saved in your browser associated with this website.
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;
