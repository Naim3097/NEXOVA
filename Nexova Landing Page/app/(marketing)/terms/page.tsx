import { Metadata } from 'next';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Terms of Service — Nexova',
  description:
    'The terms and conditions governing use of Nexova products and services.',
  alternates: { canonical: 'https://nexova.co/terms' },
};

const LAST_UPDATED = 'March 17, 2026';

export default function TermsPage() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <RevealOnScroll>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mb-12">
            Last updated: {LAST_UPDATED}
          </p>
        </RevealOnScroll>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-8">
          <RevealOnScroll>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Acceptance
              </h2>
              <p className="text-gray-600">
                By accessing or using any Nexova service — including the X.IDE
                builder, the template marketplace, Nexova Elements, or Lean.x —
                you agree to be bound by these Terms of Service. If you do not
                agree, do not use our services.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Accounts
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>You must be at least 18 years old to create an account.</li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your credentials.
                </li>
                <li>
                  You must notify us immediately of any unauthorised account
                  access.
                </li>
                <li>
                  One person or entity may not maintain more than one free
                  account.
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                3. Acceptable use
              </h2>
              <p className="text-gray-600 mb-2">
                You agree not to use our services to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Publish illegal, defamatory, or harmful content.</li>
                <li>
                  Infringe intellectual property rights of any third party.
                </li>
                <li>Send spam or unsolicited communications.</li>
                <li>Attempt to gain unauthorised access to any system.</li>
                <li>Conduct phishing or fraudulent activities.</li>
                <li>
                  Resell or sublicense our services without written permission.
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                4. Subscriptions and payments
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Subscription fees are billed monthly in advance.</li>
                <li>
                  All fees are in Malaysian Ringgit (MYR) unless stated
                  otherwise.
                </li>
                <li>
                  You may cancel at any time; cancellation takes effect at the
                  end of the current billing period.
                </li>
                <li>No refunds are provided for partial months.</li>
                <li>
                  We reserve the right to change prices with 30 days&apos;
                  notice.
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                5. Intellectual property
              </h2>
              <p className="text-gray-600">
                Content you create using our tools (pages, forms, products)
                remains your property. You grant Nexova a limited, non-exclusive
                licence to host and display your content solely to provide the
                services. Nexova retains all rights to its platform, templates,
                and UI elements.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                6. Templates and elements
              </h2>
              <p className="text-gray-600">
                Each purchased template grants a single-site licence. You may
                customise the template for one live project. You may not resell,
                redistribute, or sublicense any template or element as a
                standalone product.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                7. Service availability
              </h2>
              <p className="text-gray-600">
                We aim for 99.9% uptime but do not guarantee uninterrupted
                service. Planned maintenance will be announced in advance where
                possible. Nexova is not liable for losses resulting from service
                interruptions outside our reasonable control.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                8. Termination
              </h2>
              <p className="text-gray-600">
                We may suspend or terminate accounts that violate these terms,
                with or without notice. Upon termination, your right to use the
                services ceases immediately. You may export your data for 30
                days after termination.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                9. Limitation of liability
              </h2>
              <p className="text-gray-600">
                To the maximum extent permitted by Malaysian law, Nexova&apos;s
                total liability to you for any claim arising from use of our
                services is limited to the amount you paid us in the 3 months
                preceding the claim. We are not liable for indirect, incidental,
                or consequential damages.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                10. Governing law
              </h2>
              <p className="text-gray-600">
                These Terms are governed by the laws of Malaysia. Any dispute
                shall be subject to the exclusive jurisdiction of the courts of
                Kuala Lumpur, Malaysia.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={60}>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                11. Contact
              </h2>
              <p className="text-gray-600">
                For legal enquiries:{' '}
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
