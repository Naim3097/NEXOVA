import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Nexova',
  description:
    'Get in touch with the Nexova team — for product questions, sales, partnerships, or support.',
  alternates: { canonical: 'https://nexova.co/contact' },
  openGraph: {
    title: 'Contact Nexova',
    description: 'Get in touch — support, sales, or partnerships.',
    url: 'https://nexova.co/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Nexova',
            url: 'https://nexova.co/contact',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-24 pb-8 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Get in{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                touch
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              Questions, partnerships, or just want to say hi — we&apos;re right
              here.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact split */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — info */}
            <RevealOnScroll>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-8">
                  How to reach us
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      label: 'General enquiries',
                      value: 'hello@nexova.co',
                      href: 'mailto:hello@nexova.co',
                    },
                    {
                      icon: MessageCircle,
                      label: 'Payment & Lean.x sales',
                      value: 'sales@nexova.co',
                      href: 'mailto:sales@nexova.co',
                    },
                    {
                      icon: MapPin,
                      label: 'Location',
                      value: 'Kuala Lumpur, Malaysia',
                      href: undefined,
                    },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5BC0BE]/20 to-[#7C74EA]/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-[#5BC0BE]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="text-sm text-gray-700 hover:text-[#5BC0BE] transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-700">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Right — form */}
            <RevealOnScroll delay={150}>
              <form
                action="https://formsubmit.co/hello@nexova.co"
                method="POST"
                className="bg-gray-50 border border-gray-100 rounded-2xl p-8 space-y-5"
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="_honey"
                  className="hidden"
                  aria-hidden="true"
                />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="hidden"
                  name="_subject"
                  value="New Nexova enquiry"
                />
                <input
                  type="hidden"
                  name="_next"
                  value="https://nexova.co/contact?sent=true"
                />

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5BC0BE] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5BC0BE] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5BC0BE] transition"
                  >
                    <option value="general">General enquiry</option>
                    <option value="sales">Sales / Pricing</option>
                    <option value="support">Product support</option>
                    <option value="partnership">Partnership</option>
                    <option value="payment">Lean.x / Payments</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5BC0BE] transition resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full py-3 shadow-md border-0"
                >
                  Send Message →
                </Button>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
