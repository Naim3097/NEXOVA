import { Metadata } from 'next';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Privacy Policy — Nexova',
  description: 'How Nexova collects, uses, and protects your personal data.',
  alternates: { canonical: 'https://nexova.co/privacy' },
};

const LAST_UPDATED = 'March 17, 2026';

export default function PrivacyPage() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <RevealOnScroll>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-12">
            Last updated: {LAST_UPDATED}
          </p>
        </RevealOnScroll>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-8">
          <RevealOnScroll>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Who we are
              </h2>
              <p className="text-gray-600">
                Nexova (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
                operates the website at nexova.co, the X.IDE page builder, the
                Nexova template marketplace, and the Lean.x payment gateway.
                This Privacy Policy explains how we collect and use personal
                data when you interact with any of these services.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Data we collect
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  <strong>Account data:</strong> Email address, name, and
                  encrypted password when you create an account.
                </li>
                <li>
                  <strong>Usage data:</strong> Pages visited, features used,
                  session duration — collected via Google Tag Manager and Vercel
                  Analytics.
                </li>
                <li>
                  <strong>Payment data:</strong> Card or FPX details are
                  processed directly by Lean.x and are never stored on Nexova
                  servers.
                </li>
                <li>
                  <strong>Form submissions:</strong> Any data you enter into
                  forms you build with X.IDE is stored in your project and
                  governed by your own privacy policy as the data controller.
                </li>
                <li>
                  <strong>Communications:</strong> Email address and message
                  content when you contact us.
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. How we use your data
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>To provide and improve our services.</li>
                <li>To process payments and send receipts.</li>
                <li>
                  To send product updates and marketing emails — you may
                  unsubscribe at any time.
                </li>
                <li>To detect and prevent fraud or abuse.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Data sharing
              </h2>
              <p className="text-gray-600">
                We do not sell your personal data. We share data only with:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
                <li>
                  <strong>Supabase</strong> — database and authentication
                  provider.
                </li>
                <li>
                  <strong>Lean.x</strong> — payment processing.
                </li>
                <li>
                  <strong>Vercel</strong> — hosting and analytics.
                </li>
                <li>
                  <strong>Google</strong> — analytics via GTM.
                </li>
                <li>Law enforcement when required by applicable law.</li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Cookies
              </h2>
              <p className="text-gray-600">
                We use essential cookies to keep you logged in and remember
                preferences. Analytics cookies (via GTM) are used to understand
                how users navigate the site. You may disable non-essential
                cookies in your browser settings.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Your rights
              </h2>
              <p className="text-gray-600">
                You have the right to access, correct, or delete the personal
                data we hold about you. To exercise these rights, email us at{' '}
                <a
                  href="mailto:hello@nexova.co"
                  className="text-[#5BC0BE] hover:underline"
                >
                  hello@nexova.co
                </a>
                . We will respond within 30 days.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                7. Data retention
              </h2>
              <p className="text-gray-600">
                Account data is retained for the lifetime of your account plus
                90 days after deletion. Payment records are retained for 7 years
                as required by Malaysian financial regulations.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                8. Security
              </h2>
              <p className="text-gray-600">
                We use TLS/HTTPS for all data in transit. Data at rest is
                encrypted using AES-256. Passwords are hashed using bcrypt and
                never stored in plain text.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                9. Changes to this policy
              </h2>
              <p className="text-gray-600">
                We may update this policy from time to time. Material changes
                will be notified by email or a prominent notice on the site.
                Continued use of our services after the effective date
                constitutes acceptance.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                10. Contact
              </h2>
              <p className="text-gray-600">
                For privacy enquiries:{' '}
                <a
                  href="mailto:hello@nexova.co"
                  className="text-[#5BC0BE] hover:underline"
                >
                  hello@nexova.co
                </a>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
