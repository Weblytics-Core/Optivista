
export default function TermsOfServicePage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "optivista@subhadipghosh.co.in";
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-8">Terms and Conditions</h1>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <div>
            <h2 className="text-2xl font-semibold font-headline">1. Acceptance of Terms</h2>
            <p>
              By accessing or using this website, you confirm that you agree to comply with all stated terms and applicable laws. If you disagree, please do not use our site or services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">2. Ownership and Intellectual Property</h2>
            <p>
              All photographs, videos, designs, and written materials displayed on this website are the sole property of Optivista, unless otherwise credited.
            </p>
            <p>
              You may not copy, reproduce, modify, resell, or distribute any content without express written permission. Unauthorized use may result in legal action under applicable copyright laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">3. User Accounts</h2>
            <p>
              When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials. Any unauthorized activity under your account must be reported immediately.
            </p>
            <p>
              We reserve the right to suspend or terminate any account for misuse, fraudulent activity, or violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">4. Purchases and Licensing</h2>
            <p>
              All transactions are securely processed. Once purchased, digital images or prints are provided under a limited license for personal or agreed commercial use. Redistribution, resale, or reproduction for profit is prohibited unless explicitly licensed.
            </p>
            <p>
              Refunds are only issued in exceptional cases, such as duplicate transactions or technical errors.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">5. AI & Digital Enhancements</h2>
            <p>
              Some images on the site may include AI-assisted editing or retouching for artistic purposes. Such enhancements remain the creative property of the photographer and follow the same copyright protections.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">6. Third-Party Services</h2>
            <p>
              Our website may contain links to external sites or use third-party integrations (e.g., payment processors, analytics). We are not responsible for their content, privacy policies, or data handling.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">7. Limitation of Liability</h2>
            <p>
              We shall not be liable for any direct, indirect, or consequential losses arising from your use of the website, inability to access services, or reliance on displayed content. All content is provided “as is” without warranties of any kind.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">8. Modifications</h2>
            <p>
              We may update or revise these Terms and this Privacy Policy at any time. Continued use of the site after changes indicates acceptance of the revised version.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">9. Contact</h2>
            <p>
              If you have questions, feedback, or data requests, please reach out via our Contact Page or email us at {contactEmail}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
