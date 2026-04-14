'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  service?: string;
  heading?: string;
  subheading?: string;
}

export function ContactForm({
  service,
  heading = 'Get a free consultation',
  subheading = "Tell us about your business and we'll get back to you within 24 hours.",
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: service || '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          phone: '',
          service: service || '',
          message: '',
        });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Inquiry sent!
        </h3>
        <p className="text-gray-500">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="ghost"
          className="mt-4 text-[#5BC0BE]"
          onClick={() => setStatus('idle')}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{heading}</h3>
      <p className="text-gray-500 mb-6">{subheading}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              maxLength={200}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BC0BE]/50 focus:border-[#5BC0BE]"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={320}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BC0BE]/50 focus:border-[#5BC0BE]"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              maxLength={20}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BC0BE]/50 focus:border-[#5BC0BE]"
              placeholder="+60 12-345 6789"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="contact-service"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service interested in
            </label>
            <select
              id="contact-service"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BC0BE]/50 focus:border-[#5BC0BE] bg-white"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">Select a service</option>
              <option value="Social Media Management">
                Social Media Management
              </option>
              <option value="Business Operation System">
                Business Operation System
              </option>
              <option value="META Ads">META Ads (Facebook & Instagram)</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Website Creation">Website Creation</option>
              <option value="Google SEO">Google SEO</option>
              <option value="Google My Business">
                Google My Business Setup
              </option>
              <option value="App Development">App Development</option>
              <option value="Landing Page Builder">Landing Page Builder</option>
              <option value="Other">Other / Not sure</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tell us about your project *
          </label>
          <textarea
            id="contact-message"
            required
            maxLength={2000}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5BC0BE]/50 focus:border-[#5BC0BE] resize-none"
            placeholder="What are you looking to achieve? Any specific challenges?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-xl h-12 text-base font-medium border-0"
        >
          {status === 'loading' ? (
            'Sending...'
          ) : (
            <>
              Send Inquiry
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
