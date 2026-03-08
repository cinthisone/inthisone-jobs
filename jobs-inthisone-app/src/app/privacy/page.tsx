import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy | Inthisone Jobs',
  description: 'Privacy policy for Inthisone Jobs - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Inthisone Jobs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our job application tracking service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture when you sign in with Google.</li>
              <li><strong>Job Application Data:</strong> Job titles, company names, application dates, job descriptions, and notes you enter.</li>
              <li><strong>Resume Information:</strong> Resumes and career information you upload to generate cover letters.</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store credit card numbers).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate AI-powered cover letters and job analysis tailored to your profile</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              Your data is stored securely using industry-standard encryption. We use Supabase for database hosting and implement appropriate technical and organizational measures to protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Google OAuth:</strong> For authentication</li>
              <li><strong>OpenAI:</strong> For AI-powered features (job parsing, cover letter generation)</li>
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>Vercel:</strong> For hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your job application data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
