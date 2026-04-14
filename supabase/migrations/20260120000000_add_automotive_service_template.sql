-- Migration: Add Automotive Service Template
-- Date: 2026-01-20
-- Purpose: Create a car service/workshop template with booking form CTA

-- Insert Automotive Service template
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Auto Service Workshop',
  'auto-service-workshop',
  'automotive',
  'Automotive',
  'A professional automotive service template perfect for car workshops, mechanics, and auto repair centers. Features service highlights, booking form for appointments, testimonials, and FAQ. Designed to convert visitors into booked customers.',
  'https://placehold.co/400x300/1e40af/ffffff?text=Auto+Service',
  'https://placehold.co/1200x800/1e40af/ffffff?text=Auto+Service+Preview',
  jsonb_build_object(
    'elements', jsonb_build_array(
      -- Element 1: Announcement Bar
      jsonb_build_object(
        'id', 'elem-auto-1',
        'type', 'announcement_bar',
        'order', 1,
        'props', jsonb_build_object(
          'message', 'FREE VEHICLE INSPECTION WITH EVERY SERVICE BOOKING!',
          'bgColor', '#dc2626',
          'textColor', '#ffffff',
          'showCountdown', false,
          'isSticky', true,
          'showCloseButton', true,
          'link', '#booking',
          'linkText', 'Book Now'
        )
      ),
      -- Element 2: Navigation Header
      jsonb_build_object(
        'id', 'elem-auto-2',
        'type', 'navigation',
        'order', 2,
        'props', jsonb_build_object(
          'logo', '',
          'logoText', 'AUTO PRO SERVICE',
          'menuItems', jsonb_build_array(
            jsonb_build_object('label', 'Services', 'url', '#services'),
            jsonb_build_object('label', 'Testimonials', 'url', '#testimonials'),
            jsonb_build_object('label', 'FAQ', 'url', '#faq')
          ),
          'ctaButton', jsonb_build_object(
            'text', 'Book Appointment',
            'url', '#booking'
          ),
          'bgColor', '#0f172a',
          'textColor', '#ffffff',
          'isSticky', true,
          'layout', 'split'
        )
      ),
      -- Element 3: Hero Section
      jsonb_build_object(
        'id', 'elem-auto-3',
        'type', 'hero',
        'order', 3,
        'props', jsonb_build_object(
          'variant', 'image_bg',
          'headline', 'Expert Car Care You Can Trust',
          'subheadline', 'Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed.',
          'ctaText', 'Book Your Service Now',
          'ctaUrl', '#booking',
          'image', 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1920&h=1080&fit=crop',
          'bgColor', '#0f172a',
          'headlineColor', '#ffffff',
          'subheadlineColor', '#e2e8f0',
          'imageOpacity', 60,
          'buttonBgColor', '#dc2626',
          'buttonTextColor', '#ffffff'
        )
      ),
      -- Element 4: Services Section
      jsonb_build_object(
        'id', 'elem-auto-4',
        'type', 'features',
        'order', 4,
        'props', jsonb_build_object(
          'title', 'Our Services',
          'subtitle', 'Complete automotive care under one roof',
          'variant', 'grid',
          'features', jsonb_build_array(
            jsonb_build_object('title', 'Engine Repair & Diagnostics', 'description', 'Advanced computer diagnostics and expert engine repairs for all makes and models', 'icon', 'settings'),
            jsonb_build_object('title', 'Oil Change & Maintenance', 'description', 'Regular maintenance services to keep your vehicle running smoothly', 'icon', 'droplet'),
            jsonb_build_object('title', 'Brake Service', 'description', 'Complete brake inspection, repair, and replacement services', 'icon', 'shield'),
            jsonb_build_object('title', 'Air Conditioning', 'description', 'A/C repair, recharge, and maintenance for optimal cooling', 'icon', 'wind'),
            jsonb_build_object('title', 'Tire Services', 'description', 'Tire rotation, balancing, alignment, and replacement', 'icon', 'circle'),
            jsonb_build_object('title', 'Battery Service', 'description', 'Battery testing, charging, and replacement services', 'icon', 'zap')
          ),
          'bgColor', '#f8fafc'
        )
      ),
      -- Element 5: Why Choose Us
      jsonb_build_object(
        'id', 'elem-auto-5',
        'type', 'features',
        'order', 5,
        'props', jsonb_build_object(
          'title', 'Why Choose Auto Pro Service?',
          'subtitle', 'Experience the difference of working with professionals who care',
          'variant', 'grid',
          'features', jsonb_build_array(
            jsonb_build_object('title', 'Certified Mechanics', 'description', 'Our team consists of ASE-certified technicians with years of experience', 'icon', 'award'),
            jsonb_build_object('title', 'Transparent Pricing', 'description', 'No hidden fees. Get detailed quotes before any work begins', 'icon', 'dollar-sign'),
            jsonb_build_object('title', 'Quality Parts', 'description', 'We use only OEM and high-quality aftermarket parts', 'icon', 'check-circle'),
            jsonb_build_object('title', 'Warranty Included', 'description', '12-month warranty on all repairs and parts installed', 'icon', 'shield'),
            jsonb_build_object('title', 'Quick Turnaround', 'description', 'Most services completed same-day. We value your time', 'icon', 'clock'),
            jsonb_build_object('title', 'Free Inspection', 'description', 'Complimentary 25-point vehicle inspection with every service', 'icon', 'gift')
          ),
          'bgColor', '#ffffff'
        )
      ),
      -- Element 6: Testimonials
      jsonb_build_object(
        'id', 'elem-auto-6',
        'type', 'testimonials',
        'order', 6,
        'props', jsonb_build_object(
          'title', 'What Our Customers Say',
          'subtitle', 'Trusted by thousands of car owners in the community',
          'variant', 'grid',
          'testimonials', jsonb_build_array(
            jsonb_build_object('name', 'Ahmad Razak', 'role', 'Honda Civic Owner', 'quote', 'Best workshop I have ever visited! They fixed my engine problem that 3 other workshops could not diagnose. Fair pricing and excellent service.', 'rating', 5),
            jsonb_build_object('name', 'Sarah Lim', 'role', 'Toyota Vios Owner', 'quote', 'I always bring my car here for servicing. The staff is friendly, work is done quickly, and they always explain everything clearly.', 'rating', 5),
            jsonb_build_object('name', 'Kumar Pillai', 'role', 'BMW 3 Series Owner', 'quote', 'Finally found a workshop I can trust with my BMW. Professional service at reasonable prices. Highly recommend!', 'rating', 5),
            jsonb_build_object('name', 'Michelle Wong', 'role', 'Mazda CX-5 Owner', 'quote', 'The online booking system is so convenient! I booked my appointment, dropped off my car, and it was ready by evening. Great experience!', 'rating', 5),
            jsonb_build_object('name', 'Rizal Hassan', 'role', 'Proton X70 Owner', 'quote', 'They found and fixed a brake issue during the free inspection. Could have been dangerous. Thank you for your honesty and thorough work!', 'rating', 5),
            jsonb_build_object('name', 'Jenny Tan', 'role', 'Perodua Myvi Owner', 'quote', 'Very satisfied with the A/C repair. My car is cool again! The mechanic took time to explain what was wrong and showed me the faulty part.', 'rating', 5)
          ),
          'bgColor', '#f1f5f9'
        )
      ),
      -- Element 7: Booking Form (Main CTA)
      jsonb_build_object(
        'id', 'elem-auto-7',
        'type', 'booking_form',
        'order', 7,
        'props', jsonb_build_object(
          'title', 'Book Your Service Appointment',
          'description', 'Schedule your visit online and skip the wait. Choose your preferred date and time slot below.',
          'nameLabel', 'Full Name',
          'phoneLabel', 'Phone Number',
          'emailLabel', 'Email Address',
          'remarkLabel', 'Vehicle Details & Service Required',
          'showName', true,
          'showPhone', true,
          'showEmail', true,
          'showRemark', true,
          'nameRequired', true,
          'phoneRequired', true,
          'emailRequired', false,
          'remarkRequired', true,
          'defaultCountryCode', 'MY',
          'serviceName', 'Car Service Appointment',
          'servicePrice', 0,
          'currency', 'MYR',
          'duration', 60,
          'slotDuration', 60,
          'startTime', '08:00',
          'endTime', '18:00',
          'availableDays', jsonb_build_array(1, 2, 3, 4, 5, 6),
          'blockedDates', jsonb_build_array(),
          'submitButtonText', 'Confirm Booking',
          'submitButtonColor', '#dc2626',
          'bgColor', '#ffffff',
          'google_sheets_enabled', false,
          'google_sheets_url', '',
          'requirePayment', false,
          'termsUrl', '#terms',
          'policyUrl', '#privacy'
        )
      ),
      -- Element 8: FAQ
      jsonb_build_object(
        'id', 'elem-auto-8',
        'type', 'faq',
        'order', 8,
        'props', jsonb_build_object(
          'title', 'Frequently Asked Questions',
          'subtitle', 'Got questions? We have answers',
          'variant', 'single_column',
          'questions', jsonb_build_array(
            jsonb_build_object('question', 'Do I need to book an appointment?', 'answer', 'While walk-ins are welcome, we highly recommend booking an appointment to ensure we can serve you promptly. Online booking allows you to choose your preferred time slot.'),
            jsonb_build_object('question', 'How long does a typical service take?', 'answer', 'Regular servicing takes about 1-2 hours. More complex repairs may take longer, but we will always inform you of the estimated time before starting any work.'),
            jsonb_build_object('question', 'What brands do you service?', 'answer', 'We service all major car brands including Proton, Perodua, Honda, Toyota, Nissan, Mazda, BMW, Mercedes, and more. Our technicians are trained to work on various makes and models.'),
            jsonb_build_object('question', 'Do you provide warranty on repairs?', 'answer', 'Yes! All our repairs come with a 12-month warranty on parts and labor. If any issue arises from our work, bring it back and we will fix it at no additional cost.'),
            jsonb_build_object('question', 'Can I wait while my car is being serviced?', 'answer', 'Absolutely! We have a comfortable waiting area with air conditioning, WiFi, and refreshments. You can also drop off your car and we will call you when it is ready.'),
            jsonb_build_object('question', 'What payment methods do you accept?', 'answer', 'We accept cash, credit/debit cards, online banking, and e-wallets including Touch n Go, GrabPay, and Boost. Installment plans are available for major repairs.'),
            jsonb_build_object('question', 'Is the free inspection really free?', 'answer', 'Yes, the 25-point inspection is completely free with any service booking. We will check your brakes, fluids, belts, battery, and more - with no obligation for additional repairs.'),
            jsonb_build_object('question', 'What are your operating hours?', 'answer', 'We are open Monday to Saturday, 8:00 AM to 6:00 PM. We are closed on Sundays and public holidays. Emergency services may be arranged by calling our hotline.')
          ),
          'bgColor', '#f8fafc'
        )
      ),
      -- Element 9: WhatsApp Button
      jsonb_build_object(
        'id', 'elem-auto-9',
        'type', 'whatsapp_button',
        'order', 9,
        'props', jsonb_build_object(
          'phoneNumber', '60123456789',
          'message', 'Hi! I would like to inquire about your car service.',
          'buttonText', 'Chat on WhatsApp',
          'buttonColor', '#25D366',
          'buttonSize', 'md',
          'position', 'fixed',
          'fixedPosition', 'bottom-right',
          'showIcon', true,
          'tooltipText', 'Need help? Chat with us!',
          'showHeadline', false
        )
      ),
      -- Element 10: Footer
      jsonb_build_object(
        'id', 'elem-auto-10',
        'type', 'footer',
        'order', 10,
        'props', jsonb_build_object(
          'logo', '',
          'logoText', 'AUTO PRO SERVICE',
          'description', 'Your trusted partner for all automotive needs. Quality service, honest pricing, and customer satisfaction guaranteed since 2010.',
          'columns', jsonb_build_array(
            jsonb_build_object(
              'title', 'Services',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'Engine Repair', 'url', '#services'),
                jsonb_build_object('label', 'Oil Change', 'url', '#services'),
                jsonb_build_object('label', 'Brake Service', 'url', '#services'),
                jsonb_build_object('label', 'A/C Service', 'url', '#services')
              )
            ),
            jsonb_build_object(
              'title', 'Company',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'About Us', 'url', '#about'),
                jsonb_build_object('label', 'Our Team', 'url', '#team'),
                jsonb_build_object('label', 'Careers', 'url', '#careers'),
                jsonb_build_object('label', 'Contact', 'url', '#contact')
              )
            ),
            jsonb_build_object(
              'title', 'Support',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'FAQ', 'url', '#faq'),
                jsonb_build_object('label', 'Book Online', 'url', '#booking'),
                jsonb_build_object('label', 'Privacy Policy', 'url', '#privacy'),
                jsonb_build_object('label', 'Terms of Service', 'url', '#terms')
              )
            )
          ),
          'socialLinks', jsonb_build_array(
            jsonb_build_object('platform', 'facebook', 'url', 'https://facebook.com/autoproservice'),
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/autoproservice'),
            jsonb_build_object('platform', 'youtube', 'url', 'https://youtube.com/autoproservice')
          ),
          'copyright', '© 2026 Auto Pro Service. All rights reserved.',
          'bgColor', '#0f172a',
          'textColor', '#e2e8f0'
        )
      )
    ),
    'seo_settings', jsonb_build_object(
      'title', 'Auto Pro Service - Expert Car Care You Can Trust',
      'description', 'Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed. Book your appointment today!',
      'ogType', 'website',
      'twitterCard', 'summary_large_image',
      'robotsIndex', true,
      'robotsFollow', true,
      'language', 'en'
    ),
    'theme', jsonb_build_object(
      'primaryColor', '#dc2626',
      'fontFamily', 'Inter'
    )
  ),
  true,
  0,
  ARRAY['automotive', 'car-service', 'mechanic', 'workshop', 'repair', 'booking', 'appointment']
);

-- Add comment
COMMENT ON TABLE templates IS 'Templates library - Added Automotive Service template on 2026-01-20';
