'use client';

import React, { useRef } from 'react';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import {
  addElementAtom,
  currentProjectAtom,
  elementCountAtom,
  leftSidebarOpenAtom,
} from '@/store/builder';
import { Button } from '@/components/ui/button';
import {
  Layers,
  Grid3x3,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  X,
  CreditCard,
  Bell,
  Menu,
  Columns,
  DollarSign,
  LayoutGrid,
  FileText,
  MessageCircle,
  CalendarCheck,
} from 'lucide-react';
import type { ElementType } from '@/types';

interface ElementTemplate {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  defaultProps: Record<string, any>;
}

const elementTemplates: ElementTemplate[] = [
  {
    type: 'announcement_bar',
    label: 'Announcement Bar',
    icon: <Bell className="w-5 h-5" />,
    description: 'Top banner with message and countdown timer',
    defaultProps: {
      message: 'Limited Time Offer - 25% Off All Products!',
      bgColor: '#ef4444',
      textColor: '#ffffff',
      showCountdown: true,
      countdownLabel: 'Ends in:',
      countdownEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      isSticky: true,
      showCloseButton: true,
    },
  },
  {
    type: 'navigation',
    label: 'Navigation',
    icon: <Menu className="w-5 h-5" />,
    description: 'Header with logo, menu, and mobile support',
    defaultProps: {
      logo: '',
      logoText: 'Your Brand',
      menuItems: [
        { label: 'Home', url: '#' },
        { label: 'Features', url: '#features' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'Contact', url: '#contact' },
      ],
      ctaButton: {
        text: 'Get Started',
        url: '#',
      },
      bgColor: '#ffffff',
      textColor: '#111827',
      isSticky: true,
      layout: 'split',
    },
  },
  {
    type: 'hero',
    label: 'Hero Section',
    icon: <Layers className="w-5 h-5" />,
    description: 'Large header section with headline and CTA',
    defaultProps: {
      variant: 'centered',
      headline: 'Your Compelling Headline Here',
      subheadline: 'A brief description that explains what you offer',
      ctaText: 'Get Started',
      ctaUrl: '#',
      bgColor: '#f9fafb',
    },
  },
  {
    type: 'features',
    label: 'Features',
    icon: <Grid3x3 className="w-5 h-5" />,
    description: 'Showcase product features in a grid or list',
    defaultProps: {
      variant: 'grid',
      title: 'Why Choose Us',
      features: [
        {
          icon: 'check',
          title: 'Feature One',
          description: 'Describe the benefit of this feature',
        },
        {
          icon: 'check',
          title: 'Feature Two',
          description: 'Describe the benefit of this feature',
        },
        {
          icon: 'check',
          title: 'Feature Three',
          description: 'Describe the benefit of this feature',
        },
      ],
    },
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    icon: <MessageSquareQuote className="w-5 h-5" />,
    description: 'Display customer reviews and testimonials',
    defaultProps: {
      variant: 'grid',
      title: 'What Our Customers Say',
      testimonials: [
        {
          name: 'John Doe',
          role: 'CEO, Company Inc',
          avatar: '',
          quote: 'This product has transformed our business. Highly recommended!',
          rating: 5,
        },
        {
          name: 'Jane Smith',
          role: 'Marketing Director',
          avatar: '',
          quote: 'Excellent service and amazing results. Worth every penny!',
          rating: 5,
        },
        {
          name: 'Mike Johnson',
          role: 'Freelancer',
          avatar: '',
          quote: 'Simple to use and incredibly effective. Love it!',
          rating: 5,
        },
      ],
    },
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Answer common questions',
    defaultProps: {
      variant: 'single_column',
      title: 'Frequently Asked Questions',
      questions: [
        {
          question: 'How does it work?',
          answer:
            'Our platform is designed to be intuitive and easy to use. Simply sign up, choose a template, and start customizing.',
        },
        {
          question: 'What is included?',
          answer:
            'All plans include access to our complete template library, unlimited projects, and 24/7 customer support.',
        },
        {
          question: 'Can I cancel anytime?',
          answer:
            'Yes, you can cancel your subscription at any time. No long-term commitments required.',
        },
        {
          question: 'Do you offer refunds?',
          answer:
            'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
        },
      ],
    },
  },
  {
    type: 'cta',
    label: 'Call to Action',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Compelling section with a call to action button',
    defaultProps: {
      variant: 'centered',
      headline: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today',
      buttonText: 'Start Free Trial',
      buttonUrl: '#',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  {
    type: 'payment_button',
    label: 'Payment Button',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Accept payments via LeanX gateway',
    defaultProps: {
      products: [],
      currency: 'MYR',
      buttonText: 'Pay Now',
      buttonColor: '#3b82f6',
      buttonSize: 'md',
      enableBumpOffer: false,
      bumpOfferName: '',
      bumpOfferDescription: '',
      bumpOfferAmount: 0,
      bumpOfferDiscount: 0,
      successMessage: 'Payment successful! Thank you for your purchase.',
      failureMessage: 'Payment failed. Please try again.',
      bgColor: '#ffffff',
    },
  },
  {
    type: 'pricing',
    label: 'Pricing Table',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Display pricing plans and packages',
    defaultProps: {
      title: 'Choose Your Plan',
      subtitle: 'Select the perfect plan for your needs',
      layout: 'cards',
      enablePaymentIntegration: false,
      plans: [
        {
          name: 'Starter',
          price: '29',
          currency: 'RM',
          period: 'month',
          description: 'Perfect for individuals',
          features: [
            'Up to 5 projects',
            'Basic support',
            '1 GB storage',
            'Community access',
          ],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: false,
          priceNumeric: 29,
          productId: 'plan_starter',
        },
        {
          name: 'Professional',
          price: '79',
          currency: 'RM',
          period: 'month',
          description: 'Best for growing teams',
          features: [
            'Unlimited projects',
            'Priority support',
            '10 GB storage',
            'Advanced analytics',
            'Custom domain',
          ],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: true,
          priceNumeric: 79,
          productId: 'plan_professional',
        },
        {
          name: 'Enterprise',
          price: '199',
          currency: 'RM',
          period: 'month',
          description: 'For large organizations',
          features: [
            'Everything in Pro',
            'Dedicated support',
            'Unlimited storage',
            'Custom integrations',
            'SLA guarantee',
          ],
          buttonText: 'Contact Sales',
          buttonUrl: '#',
          highlighted: false,
          priceNumeric: 199,
          productId: 'plan_enterprise',
        },
      ],
    },
  },
  {
    type: 'lead_form',
    label: 'Lead Form',
    icon: <FileText className="w-5 h-5" />,
    description: 'Collect customer information with Google Sheets integration',
    defaultProps: {
      title: 'Get In Touch',
      description: "Fill out the form below and we'll get back to you soon.",
      nameLabel: 'Your Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone Number (optional)',
      messageLabel: 'Message (optional)',
      submitButtonText: 'Submit',
      submitButtonColor: '#2563eb',
      successMessage: 'Thank you! We\'ll be in touch soon.',
      fields: {
        showPhone: true,
        showMessage: true,
        phoneRequired: false,
        messageRequired: false,
      },
      bgColor: '#ffffff',
      google_sheets_enabled: false,
      google_sheets_url: '',
    },
  },
  {
    type: 'whatsapp_button',
    label: 'WhatsApp Button',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'Floating or inline WhatsApp click-to-chat button',
    defaultProps: {
      phoneNumber: '60123456789', // Malaysia format example
      message: 'Hi! I\'m interested in your product.',
      buttonText: 'Chat on WhatsApp',
      buttonColor: '#25D366', // WhatsApp green
      buttonSize: 'md',
      position: 'fixed', // 'fixed' or 'inline'
      fixedPosition: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
      showIcon: true,
      customIcon: '',
      tooltipText: 'Need help? Chat with us!',
      showHeadline: true,
      headlineText: 'Want to know more about this product?',
      headlineColor: '#1f2937',
    },
  },
  {
    type: 'form_with_payment',
    label: 'Form with Payment',
    icon: <LayoutGrid className="w-5 h-5" />,
    description: 'Order form with products from inventory and payment',
    defaultProps: {
      title: 'Order Form',
      description: '',
      nameLabel: 'Name',
      mobileLabel: 'Mobile Number',
      emailLabel: 'Email',
      showName: true,
      showMobile: true,
      showEmail: true,
      nameRequired: true,
      mobileRequired: true,
      emailRequired: true,
      defaultCountryCode: 'MY',
      products: [], // Products added from inventory via ProductSelector
      currency: 'MYR',
      submitButtonText: 'Complete Payment',
      submitButtonColor: '#ef4444',
      bgColor: '#ffffff',
      termsUrl: '#',
      policyUrl: '#',
      contactUrl: '#',
      companyName: 'Your Company Name',
      companyRegistration: 'Company Registration Number',
    },
  },
  {
    type: 'booking_form',
    label: 'Booking Form',
    icon: <CalendarCheck className="w-5 h-5" />,
    description: 'Appointment booking with calendar, time slots, and payment',
    defaultProps: {
      title: 'Book an Appointment',
      description: 'Select your preferred date and time slot',
      nameLabel: 'Full Name',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email',
      remarkLabel: 'Notes / Remarks',
      showName: true,
      showPhone: true,
      showEmail: true,
      showRemark: true,
      nameRequired: true,
      phoneRequired: true,
      emailRequired: true,
      remarkRequired: false,
      defaultCountryCode: 'MY',
      serviceName: 'Consultation',
      servicePrice: 0,
      currency: 'MYR',
      duration: 60,
      slotDuration: 60,
      startTime: '09:00',
      endTime: '18:00',
      availableDays: [1, 2, 3, 4, 5], // Monday to Friday
      blockedDates: [],
      submitButtonText: 'Confirm Booking',
      submitButtonColor: '#2563eb',
      bgColor: '#ffffff',
      google_sheets_enabled: false,
      google_sheets_url: '',
      requirePayment: false,
      termsUrl: '#',
      policyUrl: '#',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: <Columns className="w-5 h-5" />,
    description: 'Site footer with links and social media',
    defaultProps: {
      logo: '',
      logoText: 'Your Brand',
      description: 'Building amazing products that make a difference.',
      bgColor: '#1f2937',
      textColor: '#ffffff',
      copyright: '© 2024 Your Company. All rights reserved.',
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', url: '#features' },
            { label: 'Pricing', url: '#pricing' },
            { label: 'FAQ', url: '#faq' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', url: '#about' },
            { label: 'Blog', url: '#blog' },
            { label: 'Careers', url: '#careers' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy', url: '#privacy' },
            { label: 'Terms', url: '#terms' },
            { label: 'Security', url: '#security' },
          ],
        },
      ],
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' },
      ],
    },
  },
];

export const ElementLibrary = () => {
  // Element library component
  const addElement = useSetAtom(addElementAtom);
  const currentProject = useAtomValue(currentProjectAtom);
  const elementCount = useAtomValue(elementCountAtom);
  const [isOpen, setIsOpen] = useAtom(leftSidebarOpenAtom);

  // Prevent rapid double-clicks that create duplicates
  const lastAddTimeRef = useRef<number>(0);
  const addingRef = useRef<boolean>(false);

  const handleAddElement = (template: ElementTemplate) => {
    if (!currentProject) return;

    // Prevent duplicate adds within 500ms
    const now = Date.now();
    if (addingRef.current || now - lastAddTimeRef.current < 500) {
      console.log('Prevented duplicate element add (double-click)');
      return;
    }

    // Mark as adding
    addingRef.current = true;
    lastAddTimeRef.current = now;

    addElement({
      project_id: currentProject.id,
      type: template.type,
      order: elementCount,
      props: template.defaultProps,
      version: 1,
    });

    // Reset adding flag after a short delay
    setTimeout(() => {
      addingRef.current = false;
    }, 100);

    // On mobile, close sidebar after adding element
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Elements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Click to add elements to your page
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Element list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {elementTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => handleAddElement(template)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {template.label}
                  </h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">
            {elementCount} {elementCount === 1 ? 'element' : 'elements'} on page
          </p>
          <p>Tip: Click on elements in the canvas to edit their properties</p>
        </div>
      </div>
    </div>
  );
};
