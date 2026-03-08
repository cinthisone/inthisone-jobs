import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Terms of Service | Inthisone Jobs',
  description: 'Terms of service for Inthisone Jobs - rules and guidelines for using our service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-block">
            <Image
              src="/images/inthisone-jobs-logo.png"
              alt="Inthisone Jobs"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Inthisone Jobs ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Inthisone Jobs is a job application tracking platform that helps users manage their job search with AI-powered tools including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Job application tracking and organization</li>
              <li>AI-powered job description analysis</li>
              <li>Automated cover letter generation</li>
              <li>Resume management</li>
              <li>Interview preparation assistance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To use our Service, you must sign in with a Google account. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Free Trial and Subscription</h2>
            <p className="text-gray-700 mb-4">
              New users receive a 30-day free trial with full access to all features. After the trial period, a subscription of $10/month is required to continue using the Service. No credit card is required to start the free trial.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload malicious code or content</li>
              <li>Use the Service to spam or harass others</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. AI-Generated Content</h2>
            <p className="text-gray-700 mb-4">
              Our Service uses AI to generate cover letters, job analysis, and other content. While we strive for accuracy, AI-generated content should be reviewed and edited before use. You are responsible for the final content you submit to employers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by Inthisone Jobs and are protected by copyright, trademark, and other intellectual property laws. Your data remains your property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Inthisone Jobs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. We do not guarantee job placement or interview success.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account at any time for violations of these Terms. You may cancel your subscription at any time through your billing settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:support@inthisone.com" className="text-indigo-600 hover:text-indigo-800">
                support@inthisone.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
