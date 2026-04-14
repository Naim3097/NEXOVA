-- Migration: Reset Templates - Create Ebook Category
-- Date: 2026-01-09
-- Purpose: Remove all existing templates and create new Ebook sales page template

-- Step 1: Delete all existing templates and their elements
DELETE FROM elements WHERE template_id IS NOT NULL;
DELETE FROM templates;

-- Step 2: Insert new Ebook sales page template inspired by IMPACH Academy
INSERT INTO templates (
  id,
  name,
  description,
  category,
  industry,
  preview_image,
  thumbnail_image,
  tags,
  is_free,
  price,
  status
) VALUES (
  gen_random_uuid(),
  'Ebook Sales Page',
  'A high-converting sales page template perfect for ebooks, digital products, and online courses. Features countdown timer, benefit highlights, testimonials, pricing tables, and FAQ section. Designed to maximize conversions.',
  'ebook',
  'Education',
  'https://placehold.co/1200x800/22c55e/ffffff?text=Ebook+Sales+Page',
  'https://placehold.co/400x300/22c55e/ffffff?text=Ebook',
  ARRAY['ebook', 'digital-product', 'course', 'education', 'sales', 'conversion', 'landing-page'],
  true,
  0,
  'published'
);

-- Get the template ID for reference
DO $$
DECLARE
  template_uuid UUID;
BEGIN
  -- Get the newly created template ID
  SELECT id INTO template_uuid FROM templates WHERE name = 'Ebook Sales Page' LIMIT 1;

  -- Element 1: Announcement Bar with Countdown Timer
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'announcement_bar',
    1,
    jsonb_build_object(
      'message', 'SPECIAL PROMOTION ENDS IN',
      'bgColor', '#ef4444',
      'textColor', '#ffffff',
      'showCountdown', true,
      'countdownLabel', 'Ends in:',
      'countdownEndDate', (NOW() + INTERVAL '30 days')::text,
      'isSticky', true,
      'showCloseButton', false,
      'link', '#pricing',
      'linkText', 'Get Started Now'
    )
  );

  -- Element 2: Navigation Header
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'navigation',
    2,
    jsonb_build_object(
      'logo', '',
      'logoText', 'YOUR ACADEMY',
      'menuItems', jsonb_build_array(
        jsonb_build_object('label', 'Home', 'url', '#'),
        jsonb_build_object('label', 'Benefits', 'url', '#benefits'),
        jsonb_build_object('label', 'Pricing', 'url', '#pricing'),
        jsonb_build_object('label', 'Testimonials', 'url', '#testimonials'),
        jsonb_build_object('label', 'FAQ', 'url', '#faq')
      ),
      'ctaButton', jsonb_build_object(
        'text', 'Enroll Now',
        'url', '#pricing'
      ),
      'bgColor', '#ffffff',
      'textColor', '#111827',
      'isSticky', true,
      'layout', 'split'
    )
  );

  -- Element 3: Hero Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'hero',
    3,
    jsonb_build_object(
      'variant', 'centered',
      'title', 'Save Up To $2,421 In Your First Year',
      'subtitle', 'Limited Time Offer - Enroll by January 31, 2026',
      'description', 'Transform your learning journey with our comprehensive program. Get exclusive access to premium content, expert guidance, and lifetime support.',
      'primaryButton', jsonb_build_object('text', 'Enroll Now - Save $2,421', 'url', '#pricing'),
      'secondaryButton', jsonb_build_object('text', 'Learn More', 'url', '#benefits'),
      'image', 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&h=800&fit=crop',
      'bgColor', '#f0fdfa'
    )
  );

  -- Element 4: Problem/Pain Points Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    4,
    jsonb_build_object(
      'title', 'Are You Struggling With These Challenges?',
      'subtitle', 'You''re not alone. Here are common problems we help solve:',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', 'Lack of structured learning path', 'description', 'Without a clear roadmap, it''s easy to feel lost and overwhelmed', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Limited time to study', 'description', 'Busy schedules make it hard to commit to traditional learning', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Expensive courses with no results', 'description', 'Spent thousands on programs that didn''t deliver promised outcomes', 'icon', 'x-circle'),
        jsonb_build_object('title', 'No personalized support', 'description', 'One-size-fits-all approach doesn''t address your specific needs', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Outdated materials', 'description', 'Learning content that''s not relevant to current industry standards', 'icon', 'x-circle'),
        jsonb_build_object('title', 'No accountability', 'description', 'Easy to procrastinate without proper guidance and check-ins', 'icon', 'x-circle')
      )
    )
  );

  -- Element 5: Solution/Benefits Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    5,
    jsonb_build_object(
      'title', 'Why Choose Our Program?',
      'subtitle', 'Everything you need to succeed in one comprehensive package',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', '10+ Years Experience', 'description', 'Proven track record of helping students achieve their goals', 'icon', 'award'),
        jsonb_build_object('title', 'Free Enrichment Programs', 'description', 'Access exclusive workshops and bonus content at no extra cost', 'icon', 'gift'),
        jsonb_build_object('title', 'Quarterly Progress Reports', 'description', 'Regular assessments to track your improvement and adjust strategy', 'icon', 'trending-up'),
        jsonb_build_object('title', 'Comprehensive Curriculum', 'description', 'Step-by-step lessons covering everything from basics to advanced', 'icon', 'check-circle'),
        jsonb_build_object('title', 'Exclusive 2026 Promotion', 'description', 'Special discount available only for early enrollments this month', 'icon', 'dollar-sign'),
        jsonb_build_object('title', '1000+ Successful Students', 'description', 'Join thousands who have transformed their lives with our program', 'icon', 'users')
      )
    )
  );

  -- Element 6: Pricing Table
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'pricing',
    6,
    jsonb_build_object(
      'title', 'Choose Your Package',
      'subtitle', 'Save up to 50% with our limited-time promotion',
      'layout', 'cards',
      'plans', jsonb_build_array(
        jsonb_build_object(
          'name', 'Basic Package',
          'price', '99',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Perfect for beginners starting their journey',
          'features', jsonb_build_array(
            'Access to core curriculum',
            'Monthly progress reports',
            'Email support',
            'Digital learning materials',
            'Certificate of completion'
          ),
          'buttonText', 'Get Started',
          'buttonUrl', '#checkout',
          'highlighted', false
        ),
        jsonb_build_object(
          'name', 'Premium Package',
          'price', '199',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Most popular - Best value for serious learners',
          'features', jsonb_build_array(
            'Everything in Basic',
            'Quarterly diagnostic tests',
            'Free enrichment classes',
            'Priority support',
            'Exclusive webinars',
            '1-on-1 coaching sessions'
          ),
          'buttonText', 'Enroll Now - Save RM200',
          'buttonUrl', '#checkout',
          'highlighted', true
        ),
        jsonb_build_object(
          'name', 'Elite Package',
          'price', '349',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Ultimate package with personalized attention',
          'features', jsonb_build_array(
            'Everything in Premium',
            'Weekly 1-on-1 mentoring',
            'Customized learning path',
            'Lifetime access to updates',
            'VIP community access',
            'Job placement assistance'
          ),
          'buttonText', 'Go Elite',
          'buttonUrl', '#checkout',
          'highlighted', false
        )
      )
    )
  );

  -- Element 7: What's Included Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    7,
    jsonb_build_object(
      'title', 'What''s Included In This Promotion?',
      'subtitle', 'Total value worth $4,621 - Now only $2,200',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', 'Registration Fee Waived', 'description', 'Save RM500 on enrollment - normally charged for all new students', 'icon', 'dollar-sign'),
        jsonb_build_object('title', 'Free Assessment Tests', 'description', 'Worth RM300 - Quarterly diagnostic tests to track your progress', 'icon', 'clipboard'),
        jsonb_build_object('title', 'Free Enrichment Classes', 'description', 'Worth RM800 - Access to all bonus workshops and masterclasses', 'icon', 'sparkles'),
        jsonb_build_object('title', 'Premium Learning Materials', 'description', 'Worth RM421 - Digital and physical resources included', 'icon', 'book')
      )
    )
  );

  -- Element 8: Testimonials
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'testimonials',
    8,
    jsonb_build_object(
      'title', 'What Our Students Say',
      'subtitle', 'Join thousands of satisfied learners who transformed their lives',
      'variant', 'grid',
      'testimonials', jsonb_build_array(
        jsonb_build_object(
          'name', 'Sarah Johnson',
          'role', 'Parent of 2 Students',
          'quote', 'My children''s grades improved dramatically within 3 months. The structured approach and regular assessments made all the difference. Highly recommend!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Ahmad Rahman',
          'role', 'Student, Form 5',
          'quote', 'The personalized attention and enrichment classes helped me excel in my exams. Got straight A''s thanks to this program!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Michelle Tan',
          'role', 'Parent',
          'quote', 'Best investment in my child''s education. The teachers are dedicated and the results speak for themselves. Worth every penny!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Kumar Suresh',
          'role', 'Student, Form 4',
          'quote', 'From struggling student to top performer - this program changed my academic life. The support is amazing!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Lisa Wong',
          'role', 'Parent',
          'quote', 'My daughter was hesitant at first, but now she looks forward to classes. Seeing her confidence grow has been incredible.',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'David Lee',
          'role', 'Parent of 3 Students',
          'quote', 'Having all three kids in the program has been a game-changer. The value for money is unbeatable, especially with this promotion!',
          'rating', 5
        )
      )
    )
  );

  -- Element 9: CTA Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'cta',
    9,
    jsonb_build_object(
      'title', 'Ready to Transform Your Learning Journey?',
      'description', 'Join now and save up to RM2,421. Limited time offer ends January 31, 2026. Don''t miss out!',
      'buttonText', 'Enroll Now - Save Big',
      'buttonUrl', '#pricing',
      'buttonBgColor', '#10b981',
      'buttonTextColor', '#ffffff',
      'buttonSize', 'large',
      'buttonFontSize', 20,
      'bgColor', '#f0fdf4'
    )
  );

  -- Element 10: FAQ Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'faq',
    10,
    jsonb_build_object(
      'title', 'Frequently Asked Questions',
      'subtitle', 'Everything you need to know about our program',
      'variant', 'accordion',
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'What is included in the program?',
          'answer', 'The program includes comprehensive curriculum materials, regular assessments, enrichment classes, learning materials, and ongoing support. Premium packages include additional 1-on-1 coaching and exclusive resources.'
        ),
        jsonb_build_object(
          'question', 'How long is the program valid?',
          'answer', 'Once enrolled, you have lifetime access to the core curriculum and all future updates. Live coaching sessions are available for the duration of your chosen package (6 months to 1 year).'
        ),
        jsonb_build_object(
          'question', 'Is there a money-back guarantee?',
          'answer', 'Yes! We offer a 30-day money-back guarantee. If you''re not satisfied with the program within the first 30 days, we''ll refund your full payment, no questions asked.'
        ),
        jsonb_build_object(
          'question', 'Can I upgrade my package later?',
          'answer', 'Absolutely! You can upgrade from Basic to Premium or Elite at any time. You''ll only pay the difference, and your progress will be maintained.'
        ),
        jsonb_build_object(
          'question', 'What payment methods do you accept?',
          'answer', 'We accept all major credit cards, online banking, and payment platforms. Installment plans are available for Premium and Elite packages.'
        ),
        jsonb_build_object(
          'question', 'When does the promotion end?',
          'answer', 'This special promotion ends on January 31, 2026 at 11:59 PM. After that, prices will return to regular rates and the bonus inclusions won''t be available.'
        ),
        jsonb_build_object(
          'question', 'Do you offer group discounts?',
          'answer', 'Yes! Families enrolling multiple students can get additional discounts. Contact us for a customized group rate quote.'
        ),
        jsonb_build_object(
          'question', 'Still have questions?',
          'answer', 'Feel free to reach out to our support team via WhatsApp or email. We''re here to help you make the best decision for your learning journey!'
        )
      )
    )
  );

  -- Element 11: Footer
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'footer',
    11,
    jsonb_build_object(
      'logo', '',
      'logoText', 'YOUR ACADEMY',
      'description', 'Empowering learners to achieve their full potential through comprehensive education and personalized support.',
      'columns', jsonb_build_array(
        jsonb_build_object(
          'title', 'Quick Links',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'Home', 'url', '#'),
            jsonb_build_object('label', 'About Us', 'url', '#about'),
            jsonb_build_object('label', 'Programs', 'url', '#programs'),
            jsonb_build_object('label', 'Contact', 'url', '#contact')
          )
        ),
        jsonb_build_object(
          'title', 'Programs',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'Basic Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Premium Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Elite Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Enrichment Classes', 'url', '#enrichment')
          )
        ),
        jsonb_build_object(
          'title', 'Support',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'FAQ', 'url', '#faq'),
            jsonb_build_object('label', 'Contact Us', 'url', '#contact'),
            jsonb_build_object('label', 'Privacy Policy', 'url', '#privacy'),
            jsonb_build_object('label', 'Terms of Service', 'url', '#terms')
          )
        )
      ),
      'socialLinks', jsonb_build_array(
        jsonb_build_object('platform', 'facebook', 'url', 'https://facebook.com/youracademy'),
        jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/youracademy'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/youracademy')
      ),
      'copyright', '© 2026 Your Academy. All rights reserved.',
      'bgColor', '#1f2937',
      'textColor', '#ffffff'
    )
  );

END $$;

-- Add helpful comment
COMMENT ON TABLE templates IS 'Templates library - Reset with Ebook category on 2026-01-09';
