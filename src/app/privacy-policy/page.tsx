
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: October 20, 2025</p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p>
            At Optivista we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or interact with our website.
          </p>
          
          <div>
            <h2 className="text-2xl font-semibold font-headline">1. Information We Collect</h2>
            <p>We may collect the following information when you use our website:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, contact number, and account login details when you register, contact us, or make a purchase.</li>
              <li><strong>Payment Details:</strong> Only processed securely via third-party payment gateways; we never store your full credit/debit card details.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage analytics collected automatically through cookies or tracking technologies.</li>
            </ul>
            <p>We may also maintain records of your communications with us for customer service and security purposes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">2. How We Use Your Information</h2>
            <p>Your data helps us provide a personalized, secure, and efficient user experience. Specifically, we use it to:</p>
            <ul>
              <li>Manage user authentication and profile access.</li>
              <li>Process and deliver image purchases or digital downloads.</li>
              <li>Respond to customer inquiries and support requests.</li>
              <li>Improve website design, performance, and features.</li>
              <li>Send account-related notifications or marketing updates (only if you’ve consented).</li>
            </ul>
            <p>We do not sell or rent your information to any third parties. Limited data may be shared with trusted service providers (e.g., payment processors or cloud storage) under strict confidentiality.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">3. Data Security</h2>
            <p>We use encryption, secure servers, and authentication systems to protect your information. Access is restricted to authorized personnel only. While we maintain industry-standard security measures, we cannot guarantee 100% protection against unauthorized breaches.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">4. Cookies and Tracking</h2>
            <p>Cookies help us recognize repeat visitors and understand user preferences. You may disable cookies in your browser settings, but some site features may not function properly as a result.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold font-headline">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access, correction, or deletion of your personal data.</li>
              <li>Withdraw consent for marketing emails at any time.</li>
              <li>Request data portability or object to certain data uses.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
