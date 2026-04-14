export interface MockTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  tags: string[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  data: {
    elements: Array<{
      type: string;
      order: number;
      props: Record<string, any>;
    }>;
    seo_settings?: Record<string, any>;
    theme?: Record<string, any>;
  };
}

/**
 * Generates a complete, standalone HTML page for a template.
 * Includes full CSS, responsive design, animations, and interactivity.
 * Designed for UI/UX designers to review, redesign, and readjust.
 */
export function generateFullTemplateHTML(template: MockTemplate): string {
  const { data, name } = template;
  const theme = data.theme || {};
  const primaryColor = theme.primaryColor || '#3b82f6';
  const fontFamily = theme.fontFamily || 'Inter';
  const sortedElements = [...data.elements].sort((a, b) => a.order - b.order);

  const sectionsHTML = sortedElements
    .map((el) => {
      switch (el.type) {
        case 'hero':
          return renderHero(el.props, primaryColor);
        case 'navigation':
          return renderNavigation(el.props);
        case 'features':
          return renderFeatures(el.props, primaryColor);
        case 'services-pricing':
          return renderServicesPricing(el.props, primaryColor);
        case 'about':
          return renderAbout(el.props, primaryColor);
        case 'team':
          return renderTeam(el.props, primaryColor);
        case 'gallery':
          return renderGallery(el.props, primaryColor);
        case 'testimonials':
          return renderTestimonials(el.props, primaryColor);
        case 'faq':
          return renderFAQ(el.props, primaryColor);
        case 'cta':
          return renderCTA(el.props, primaryColor);
        case 'pricing':
          return renderPricing(el.props, primaryColor);
        case 'contact':
          return renderContact(el.props, primaryColor);
        case 'footer':
          return renderFooter(el.props);
        // Real Estate template sections
        case 're-navigation':
          return renderRENavigation(el.props, primaryColor);
        case 're-hero':
          return renderREHero(el.props, primaryColor);
        case 're-intro':
          return renderREIntro(el.props, primaryColor);
        case 're-featured-projects':
          return renderREFeaturedProjects(el.props, primaryColor);
        case 're-property-detail':
          return renderREPropertyDetail(el.props, primaryColor);
        case 're-gallery':
          return renderREGallery(el.props, primaryColor);
        case 're-floor-plans':
          return renderREFloorPlans(el.props, primaryColor);
        case 're-leadership':
          return renderRELeadership(el.props, primaryColor);
        case 're-partners':
          return renderREPartners(el.props, primaryColor);
        case 're-insights':
          return renderREInsights(el.props, primaryColor);
        case 're-testimonials':
          return renderRETestimonials(el.props, primaryColor);
        case 're-contact':
          return renderREContact(el.props, primaryColor);
        case 're-footer':
          return renderREFooter(el.props, primaryColor);
        // Smartwatch template sections
        case 'sw-navigation':
          return renderSWNavigation(el.props, primaryColor);
        case 'sw-hero':
          return renderSWHero(el.props, primaryColor);
        case 'sw-features':
          return renderSWFeatures(el.props, primaryColor);
        case 'sw-products':
          return renderSWProducts(el.props, primaryColor);
        case 'sw-showcase':
          return renderSWShowcase(el.props, primaryColor);
        case 'sw-choice':
          return renderSWChoice(el.props, primaryColor);
        case 'sw-offer':
          return renderSWOffer(el.props, primaryColor);
        case 'sw-video':
          return renderSWVideo(el.props, primaryColor);
        case 'sw-testimonials':
          return renderSWTestimonials(el.props, primaryColor);
        case 'sw-footer':
          return renderSWFooter(el.props, primaryColor);
        // Dental Clinic template sections
        case 'dc-navigation':
          return renderDCNavigation(el.props, primaryColor);
        case 'dc-hero':
          return renderDCHero(el.props, primaryColor);
        case 'dc-about':
          return renderDCAbout(el.props, primaryColor);
        case 'dc-reasons':
          return renderDCReasons(el.props, primaryColor);
        case 'dc-services':
          return renderDCServices(el.props, primaryColor);
        case 'dc-booking':
          return renderDCBooking(el.props, primaryColor);
        case 'dc-testimonial':
          return renderDCTestimonial(el.props, primaryColor);
        case 'dc-team':
          return renderDCTeam(el.props, primaryColor);
        case 'dc-blog':
          return renderDCBlog(el.props, primaryColor);
        case 'dc-footer':
          return renderDCFooter(el.props, primaryColor);
        // Sugarbomb perfume template sections
        case 'sb-navigation':
          return renderSBNavigation(el.props, primaryColor);
        case 'sb-hero':
          return renderSBHero(el.props, primaryColor);
        case 'sb-about':
          return renderSBAbout(el.props, primaryColor);
        case 'sb-popular':
          return renderSBPopular(el.props, primaryColor);
        case 'sb-banner':
          return renderSBBanner(el.props, primaryColor);
        case 'sb-categories':
          return renderSBCategories(el.props, primaryColor);
        case 'sb-collections':
          return renderSBCollections(el.props, primaryColor);
        case 'sb-story':
          return renderSBStory(el.props, primaryColor);
        case 'sb-testimonials':
          return renderSBTestimonials(el.props, primaryColor);
        case 'sb-newsletter':
          return renderSBNewsletter(el.props, primaryColor);
        case 'sb-footer':
          return renderSBFooter(el.props, primaryColor);
        default:
          return '';
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHTML(name)}</title>
  <meta name="description" content="${escapeHTML(data.seo_settings?.description || '')}"/>
  ${fontFamily === 'Satoshi' ? `<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap" rel="stylesheet"/>` : fontFamily === 'Inter Tight' ? `<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>` : `<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>`}
  <style>
    /* ========== RESET & BASE ========== */
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a202c;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img { max-width:100%; height:auto; display:block; }
    a { text-decoration:none; color:inherit; }

    /* ========== UTILITIES ========== */
    .container { max-width:1200px; margin:0 auto; padding:0 24px; }
    .container-sm { max-width:800px; margin:0 auto; padding:0 24px; }
    .container-lg { max-width:1400px; margin:0 auto; padding:0 24px; }
    .text-center { text-align:center; }
    .flex { display:flex; }
    .flex-wrap { flex-wrap:wrap; }
    .items-center { align-items:center; }
    .justify-center { justify-content:center; }
    .justify-between { justify-content:space-between; }
    .gap-16 { gap:16px; }
    .gap-24 { gap:24px; }
    .gap-32 { gap:32px; }
    .gap-40 { gap:40px; }

    /* ========== BUTTONS ========== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      letter-spacing: 0.01em;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
    .btn:active { transform: translateY(0); }
    .btn-primary {
      background: ${primaryColor};
      color: #fff;
    }
    .btn-white {
      background: #fff;
      color: #1a202c;
    }
    .btn-outline {
      background: transparent;
      border: 2px solid ${primaryColor};
      color: ${primaryColor};
    }
    .btn-lg { padding:18px 40px; font-size:1.1rem; border-radius:12px; }

    /* ========== SECTION SPACING ========== */
    .section { padding: 80px 0; }
    .section-lg { padding: 100px 0; }

    /* ========== TYPOGRAPHY ========== */
    .heading-xl { font-size:clamp(2.2rem, 5vw, 3.5rem); font-weight:800; line-height:1.15; letter-spacing:-0.02em; }
    .heading-lg { font-size:clamp(1.8rem, 4vw, 2.5rem); font-weight:700; line-height:1.2; letter-spacing:-0.01em; }
    .heading-md { font-size:clamp(1.3rem, 2.5vw, 1.5rem); font-weight:600; line-height:1.3; }
    .text-lg { font-size:clamp(1.05rem, 2vw, 1.25rem); line-height:1.7; }
    .text-md { font-size:1rem; line-height:1.6; }
    .text-sm { font-size:0.875rem; line-height:1.5; }
    .text-muted { color: #64748b; }
    .subtitle { font-size: clamp(1.05rem, 2vw, 1.3rem); color: #64748b; line-height: 1.7; max-width: 640px; margin: 0 auto; }

    /* ========== BADGE ========== */
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    /* ========== CARDS ========== */
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #e2e8f0;
      transition: all 0.25s ease;
    }
    .card:hover { border-color: ${primaryColor}40; box-shadow: 0 12px 40px rgba(0,0,0,0.08); transform: translateY(-4px); }
    .card-icon {
      width: 52px; height: 52px;
      background: ${primaryColor}15;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    /* ========== GRID ========== */
    .grid-2 { display:grid; grid-template-columns: repeat(2, 1fr); gap:24px; }
    .grid-3 { display:grid; grid-template-columns: repeat(3, 1fr); gap:24px; }
    .grid-4 { display:grid; grid-template-columns: repeat(4, 1fr); gap:24px; }

    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
      .section { padding: 48px 0; }
      .section-lg { padding: 64px 0; }
    }

    /* ========== ANIMATIONS ========== */
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(30px); }
      to { opacity:1; transform:translateY(0); }
    }
    .animate-in {
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    /* ========== STAR RATING ========== */
    .stars { color: #fbbf24; font-size: 1.1rem; letter-spacing: 2px; }

    /* ========== FAQ ACCORDION ========== */
    .faq-item {
      border-bottom: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.1rem;
      color: #1a202c;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
      transition: color 0.2s;
    }
    .faq-question:hover { color: ${primaryColor}; }
    .faq-chevron {
      transition: transform 0.3s ease;
      font-size: 1.2rem;
      color: #94a3b8;
    }
    .faq-item.open .faq-chevron { transform: rotate(180deg); }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding 0.35s ease;
      color: #64748b;
      line-height: 1.7;
      font-size: 1rem;
    }
    .faq-item.open .faq-answer {
      max-height: 400px;
      padding-bottom: 20px;
    }

    /* ========== TESTIMONIAL CARDS ========== */
    .testimonial-card {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .testimonial-card::before {
      content: '\\201C';
      position: absolute;
      top: 16px;
      left: 24px;
      font-size: 4rem;
      color: ${primaryColor}25;
      font-family: Georgia, serif;
      line-height: 1;
    }
    .testimonial-avatar {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: ${primaryColor}20;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: ${primaryColor}; font-size: 1.1rem;
    }

    /* ========== HERO SLIDER ========== */
    .hero-slider {
      position: relative;
      width: 100%;
      height: 90vh;
      min-height: 550px;
      overflow: hidden;
    }
    .hero-slides-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .hero-slide {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
      z-index: 0;
    }
    .hero-slide.active {
      opacity: 1;
      visibility: visible;
      z-index: 1;
    }
    .hero-slide-headline {
      font-size: clamp(2.8rem, 6vw, 4.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
      transform: translateY(30px);
      opacity: 0;
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, opacity 0.7s ease 0.15s;
    }
    .hero-slide.active .hero-slide-headline {
      transform: translateY(0);
      opacity: 1;
    }
    .hero-slide-sub {
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
      max-width: 600px;
      margin-bottom: 36px;
      transform: translateY(25px);
      opacity: 0;
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, opacity 0.7s ease 0.3s;
    }
    .hero-slide.active .hero-slide-sub {
      transform: translateY(0);
      opacity: 1;
    }
    .hero-slide-btns {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.45s, opacity 0.7s ease 0.45s;
    }
    .hero-slide.active .hero-slide-btns {
      transform: translateY(0);
      opacity: 1;
    }
    /* Exiting slide resets content for next entry */
    .hero-slide:not(.active) .hero-slide-headline,
    .hero-slide:not(.active) .hero-slide-sub,
    .hero-slide:not(.active) .hero-slide-btns {
      transform: translateY(30px);
      opacity: 0;
      transition: none;
    }
    .hero-dots {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }
    .hero-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.5);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    .hero-dot:hover { border-color: #fff; }
    .hero-dot.active {
      background: ${primaryColor};
      border-color: ${primaryColor};
      transform: scale(1.2);
    }
    @media (max-width: 640px) {
      .hero-slider { height: 75vh; min-height: 420px; }
      .hero-dots { bottom: 20px; }
    }

    /* ========== SERVICES-PRICING CARDS ========== */
    .svc-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 40px 28px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
    }
    .svc-card:hover { border-color: ${primaryColor}60; transform: translateY(-4px); }
    .svc-card-icon {
      width: 56px; height: 56px;
      margin: 0 auto 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .svc-card-title {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 10px;
    }
    .svc-card-desc {
      font-size: 0.85rem;
      color: #888;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .svc-card-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }
    .svc-card-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1px solid #555;
      background: transparent;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .svc-card-btn:hover { border-color: ${primaryColor}; color: ${primaryColor}; }

    /* ========== ABOUT SECTION ========== */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .about-stats {
      display: flex;
      gap: 40px;
      margin-top: 32px;
    }
    .about-stat-num {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800;
      color: #fff;
    }
    .about-stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #888;
      margin-top: 4px;
    }
    .about-img {
      width: 100%;
      height: 360px;
      object-fit: cover;
      border-radius: 16px;
      background: #222;
    }
    @media (max-width: 768px) {
      .about-grid { grid-template-columns: 1fr; }
      .about-stats { flex-wrap: wrap; gap: 24px; }
    }

    /* ========== TEAM SECTION ========== */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
    .team-member { text-align: center; }
    .team-img {
      width: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
      border-radius: 16px;
      background: #ddd;
      margin-bottom: 16px;
    }
    .team-name {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    .team-role {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    @media (max-width: 640px) {
      .team-grid { grid-template-columns: 1fr; }
    }

    /* ========== GALLERY SECTION ========== */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .gallery-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background: #333;
      border-radius: 12px;
      transition: opacity 0.3s;
      cursor: pointer;
    }
    .gallery-img:hover { opacity: 0.8; }
    @media (max-width: 640px) {
      .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* ========== CONTACT SECTION ========== */
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }
    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }
    .contact-item svg { flex-shrink: 0; margin-top: 2px; }
    .contact-map {
      width: 100%;
      height: 180px;
      background: #2a2a2a;
      border-radius: 14px;
      margin-top: 16px;
      overflow: hidden;
    }
    .book-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .book-input {
      padding: 14px 16px;
      background: transparent;
      border: 1px solid #444;
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .book-input:focus { border-color: ${primaryColor}; }
    .book-input::placeholder { color: #777; }
    .book-select {
      padding: 14px 16px;
      background: transparent;
      border: 1px solid #444;
      border-radius: 12px;
      color: #777;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      appearance: none;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23777' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
    }
    .book-select:focus { border-color: ${primaryColor}; }
    .book-btn {
      padding: 14px 32px;
      background: #fff;
      color: #111;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .book-btn:hover { background: ${primaryColor}; color: #111; }
    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
    }

    /* ========== BACK LINK ========== */
    .back-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #1a202c;
      color: #fff;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .back-bar a {
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.85;
      transition: opacity 0.2s;
    }
    .back-bar a:hover { opacity: 1; }
    .back-bar .template-name { font-weight: 600; }
    body { padding-top: 44px; }

    /* ============================================================
       REAL ESTATE TEMPLATE STYLES
       ============================================================ */
    :root {
      --re-px: clamp(24px, 5.5vw, 120px);
    }
    .re-nav {
      position: fixed; top: 44px; left: 0; right: 0; z-index: 900;
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px var(--re-px);
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      transition: background 0.4s, box-shadow 0.4s;
    }
    .re-nav.scrolled {
      background: rgba(255,255,255,0.96);
      box-shadow: 0 2px 24px rgba(0,0,0,0.06);
      border-bottom-color: rgba(0,0,0,0.06);
    }
    .re-nav.scrolled .re-nav-brand,
    .re-nav.scrolled .re-nav-link { color: #1a1a1a; }
    .re-nav.scrolled .re-nav-cta { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
    .re-nav-brand {
      font-size: 1.15rem; font-weight: 700; color: #fff;
      display: flex; align-items: center; gap: 10px; text-decoration: none;
    }
    .re-nav-brand svg { width: 28px; height: 28px; }
    .re-nav-links { display: flex; align-items: center; gap: 32px; }
    .re-nav-link {
      color: rgba(255,255,255,0.85); font-size: 0.85rem; font-weight: 500;
      text-decoration: none; transition: color 0.2s; letter-spacing: 0.02em;
    }
    .re-nav-link:hover { color: #fff; }
    .re-nav-cta {
      padding: 10px 24px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.3);
      background: transparent; color: #fff; font-size: 0.8rem; font-weight: 600;
      cursor: pointer; transition: all 0.3s; text-decoration: none; letter-spacing: 0.04em;
    }
    .re-nav-cta:hover { background: rgba(255,255,255,0.15); }
    @media(max-width:768px){
      .re-nav { padding: 12px var(--re-px); }
      .re-nav-links { gap: 16px; }
      .re-nav-link { font-size: 0.78rem; }
    }

    /* RE Hero */
    .re-hero {
      position: relative; min-height: 100vh; display: flex; flex-direction: column;
      justify-content: center; align-items: center; text-align: center;
      overflow: hidden; padding: 120px var(--re-px) 80px;
    }
    .re-hero-bg {
      position: absolute; inset: 0; z-index: 0;
      background-size: cover; background-position: center;
    }
    .re-hero-bg::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%);
    }
    .re-hero-content {
      position: relative; z-index: 2; max-width: 900px;
    }
    .re-hero h1 {
      font-size: clamp(2.5rem, 5.5vw, 4.5rem); font-weight: 800; color: #fff;
      line-height: 1.08; margin-bottom: 40px; letter-spacing: -0.02em;
      white-space: pre-line;
    }
    .re-hero-btns { display: flex; gap: 16px; justify-content: center; margin-bottom: 60px; }
    .re-hero-btn {
      padding: 14px 36px; border-radius: 50px; font-size: 0.85rem; font-weight: 600;
      text-decoration: none; transition: all 0.3s; letter-spacing: 0.02em;
    }
    .re-hero-btn-primary { background: #fff; color: #1a1a1a; border: 2px solid #fff; }
    .re-hero-btn-primary:hover { background: transparent; color: #fff; }
    .re-hero-btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); }
    .re-hero-btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

    .re-search-bar {
      position: relative; z-index: 2; max-width: 680px; width: 100%; margin: 0 auto;
      background: rgba(255,255,255,0.12); backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 60px; padding: 6px 6px 6px 28px;
      display: flex; align-items: center; gap: 12px;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .re-search-filters { display: flex; gap: 4px; }
    .re-search-filter {
      padding: 8px 18px; border-radius: 50px; border: none;
      background: transparent; color: rgba(255,255,255,0.7);
      font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .re-search-filter.active { background: rgba(255,255,255,0.2); color: #fff; }
    .re-search-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-size: 0.85rem; padding: 10px 0;
    }
    .re-search-input::placeholder { color: rgba(255,255,255,0.45); }
    .re-search-submit {
      width: 44px; height: 44px; border-radius: 50%; border: none;
      background: ${primaryColor}; color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, background 0.2s; flex-shrink: 0;
    }
    .re-search-submit:hover { transform: scale(1.06); }
    @media(max-width:640px){
      .re-hero { padding: 100px var(--re-px) 60px; }
      .re-hero-btns { flex-direction: column; align-items: center; }
      .re-search-bar { flex-direction: column; border-radius: 20px; padding: 16px; }
      .re-search-filters { justify-content: center; }
    }

    /* RE Intro */
    .re-intro-section {
      padding: 100px var(--re-px); text-align: center;
    }
    .re-intro-section p {
      max-width: 760px; margin: 0 auto 40px; font-size: clamp(1.1rem, 2vw, 1.45rem);
      line-height: 1.7; color: #333; font-weight: 400;
    }
    .re-intro-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 50px; border: 2px solid #1a1a1a;
      background: transparent; color: #1a1a1a; font-size: 0.85rem; font-weight: 600;
      text-decoration: none; transition: all 0.3s;
    }
    .re-intro-cta:hover { background: #1a1a1a; color: #fff; }

    /* RE Featured Projects */
    .re-featured {
      padding: 80px var(--re-px);
    }
    .re-featured-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 48px; flex-wrap: wrap; gap: 24px;
    }
    .re-featured-header h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; color: #1a1a1a;
      line-height: 1.15;
    }
    .re-featured-count {
      text-align: right;
    }
    .re-featured-count .num {
      font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; color: #1a1a1a;
      line-height: 1;
    }
    .re-featured-count .label {
      font-size: 0.75rem; color: #888; text-transform: uppercase;
      letter-spacing: 0.1em; margin-top: 4px;
    }
    .re-featured-filters {
      display: flex; gap: 8px; margin-bottom: 36px; flex-wrap: wrap;
    }
    .re-filter-btn {
      padding: 8px 20px; border-radius: 50px; border: 1px solid #ddd;
      background: #fff; color: #555; font-size: 0.78rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .re-filter-btn.active,
    .re-filter-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
    .re-projects-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
    }
    .re-project-card {
      position: relative; border-radius: 20px; overflow: hidden;
      aspect-ratio: 3/4; cursor: pointer;
    }
    .re-project-card img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.6s ease;
    }
    .re-project-card:hover img { transform: scale(1.05); }
    .re-project-card-overlay {
      position: absolute; inset: 0; padding: 24px;
      display: flex; flex-direction: column; justify-content: flex-end;
      background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%);
    }
    .re-project-loc {
      position: absolute; top: 16px; left: 16px;
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 50px;
      background: rgba(255,255,255,0.15); backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.35);
      color: #fff; font-size: 0.72rem; font-weight: 600;
    }
    .re-project-loc svg { flex-shrink: 0; }
    .re-project-arrow {
      position: absolute; top: 16px; right: 16px;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,255,255,0.18); backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.35);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.25s ease; color: #fff;
    }
    .re-project-arrow:hover {
      background: rgba(255,255,255,0.35); transform: scale(1.08);
    }
    .re-project-card-num {
      font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.5);
      margin-bottom: 6px;
    }
    .re-project-card h3 { color: #fff; font-size: 1rem; font-weight: 600; margin-bottom: 0; line-height: 1.3; }
    /* Project popup modal */
    .re-proj-modal-backdrop {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0); backdrop-filter: blur(0px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease, background 0.35s ease, backdrop-filter 0.35s ease;
    }
    .re-proj-modal-backdrop.open {
      opacity: 1; pointer-events: auto;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
    }
    .re-proj-modal {
      background: #fff; border-radius: 24px; overflow: hidden;
      max-width: 520px; width: 90%; max-height: 88vh;
      transform: translateY(40px) scale(0.95); opacity: 0;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
      box-shadow: 0 32px 80px rgba(0,0,0,0.25);
    }
    .re-proj-modal-backdrop.open .re-proj-modal {
      transform: translateY(0) scale(1); opacity: 1;
    }
    .re-proj-modal-img {
      width: 100%; height: 260px; object-fit: cover;
    }
    .re-proj-modal-body { padding: 28px 32px 32px; }
    .re-proj-modal-loc {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 50px; background: #f0f0f0;
      font-size: 0.7rem; font-weight: 600; color: #555; margin-bottom: 16px;
    }
    .re-proj-modal-title {
      font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; line-height: 1.3;
    }
    .re-proj-modal-price {
      font-size: 1.1rem; font-weight: 700; color: ${primaryColor}; margin-bottom: 20px;
    }
    .re-proj-modal-desc {
      font-size: 0.85rem; color: #666; line-height: 1.7; margin-bottom: 24px;
    }
    .re-proj-modal-specs {
      display: flex; gap: 24px; padding-top: 20px; border-top: 1px solid #eee;
    }
    .re-proj-modal-spec {
      text-align: center; flex: 1;
    }
    .re-proj-modal-spec .val {
      font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;
    }
    .re-proj-modal-spec .lbl {
      font-size: 0.68rem; color: #999; text-transform: uppercase; letter-spacing: 0.06em;
    }
    .re-proj-modal-close {
      position: absolute; top: 16px; right: 16px;
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
      border: none; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #fff; transition: background 0.2s;
    }
    .re-proj-modal-close:hover { background: rgba(0,0,0,0.6); }
    @media(max-width:1024px){ .re-projects-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:640px){
      .re-featured { padding: 60px var(--re-px); }
      .re-projects-grid { grid-template-columns: 1fr; }
    }

    /* RE Property Detail */
    .re-property-detail {
      padding: 80px var(--re-px);
    }
    .re-pd-grid {
      display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: start;
    }
    .re-pd-main-img {
      width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 20px;
    }
    .re-pd-thumbs {
      display: flex; gap: 12px; margin-top: 16px;
    }
    .re-pd-thumb {
      width: 80px; height: 60px; object-fit: cover; border-radius: 10px;
      cursor: pointer; opacity: 0.6; transition: opacity 0.2s; border: 2px solid transparent;
    }
    .re-pd-thumb:hover, .re-pd-thumb.active { opacity: 1; border-color: ${primaryColor}; }
    .re-pd-info h2 {
      font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 700; color: #fff;
      line-height: 1.3; margin-bottom: 12px;
    }
    .re-pd-info .location {
      font-size: 0.82rem; color: #aaa; margin-bottom: 20px;
      display: flex; align-items: center; gap: 6px;
    }
    .re-pd-price {
      font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: ${primaryColor};
      margin-bottom: 28px;
    }
    .re-pd-specs {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px;
    }
    .re-pd-spec {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px; background: rgba(255,255,255,0.06); border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .re-pd-spec .val { font-weight: 700; color: #fff; font-size: 0.9rem; }
    .re-pd-spec .lbl { color: #888; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .re-pd-features {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;
    }
    .re-pd-feature {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 10px;
      font-size: 0.78rem; color: #ccc; border: 1px solid rgba(255,255,255,0.06);
    }
    .re-pd-feature svg { width: 16px; height: 16px; flex-shrink: 0; }
    .re-pd-details {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
    }
    .re-pd-detail {
      display: flex; justify-content: space-between;
      padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .re-pd-detail .dlbl { color: #888; font-size: 0.78rem; }
    .re-pd-detail .dval { color: #fff; font-size: 0.82rem; font-weight: 600; }
    @media(max-width:900px){
      .re-pd-grid { grid-template-columns: 1fr; }
    }
    @media(max-width:640px){
      .re-property-detail { padding: 60px var(--re-px); }
      .re-pd-specs { grid-template-columns: 1fr; }
      .re-pd-features { grid-template-columns: repeat(2, 1fr); }
    }

    /* RE Gallery */
    .re-gallery-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      padding: 80px var(--re-px);
    }
    .re-gallery-grid img {
      width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 16px;
      transition: transform 0.5s ease, opacity 0.3s; cursor: pointer;
    }
    .re-gallery-grid img:hover { transform: scale(1.03); opacity: 0.9; }
    @media(max-width:768px){
      .re-gallery-grid { grid-template-columns: repeat(2, 1fr); padding: 60px var(--re-px); }
    }

    /* RE Floor Plans */
    .re-plans {
      padding: 80px var(--re-px);
    }
    .re-plans h2 {
      font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; color: #1a1a1a;
      margin-bottom: 36px;
    }
    .re-plan-tabs {
      display: flex; gap: 8px; margin-bottom: 32px;
    }
    .re-plan-tab {
      padding: 10px 24px; border-radius: 50px; border: 1px solid #ddd;
      background: #fff; color: #555; font-size: 0.8rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .re-plan-tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
    .re-plan-img {
      width: 100%; max-width: 800px; border-radius: 16px;
      border: 1px solid #e5e5e5;
    }

    /* RE Leadership */
    .re-leadership {
      padding: 100px var(--re-px) 80px; position: relative; min-height: 85vh;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .re-leadership h2 {
      font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 300; color: #1a1a1a;
      margin-bottom: 28px; letter-spacing: -0.02em; line-height: 1.1;
    }
    .re-lead-pagination {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 8px 20px; border-radius: 50px; border: 1px solid #ddd;
      font-size: 0.8rem; font-weight: 500; color: #666; margin-bottom: 48px;
      width: fit-content;
    }
    .re-lead-body {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
    }
    .re-lead-photos {
      position: relative; width: 480px; height: 420px; margin: 0 auto; flex-shrink: 0;
    }
    .re-lead-photo {
      position: absolute; border-radius: 16px; overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12); object-fit: cover;
      cursor: pointer; user-select: none;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .re-lead-photo[data-pos="back-left"] {
      width: 200px; height: 240px; top: 10px; left: 60px;
      z-index: 1; opacity: 0.85; filter: brightness(0.95);
      border-radius: 14px;
    }
    .re-lead-photo[data-pos="front"] {
      width: 260px; height: 340px; top: 40px; left: 140px;
      z-index: 3; opacity: 1; filter: brightness(1);
      border-radius: 18px;
      box-shadow: 0 16px 60px rgba(0,0,0,0.18);
    }
    .re-lead-photo[data-pos="back-right"] {
      width: 200px; height: 280px; top: 70px; left: 310px;
      z-index: 1; opacity: 0.85; filter: brightness(0.95);
      border-radius: 14px;
    }
    .re-lead-photo:hover { filter: brightness(1.02); }
    .re-lead-info {
      display: flex; justify-content: space-between; align-items: flex-end;
      padding-top: 32px; margin-top: auto;
      border-top: none; position: relative;
    }
    .re-lead-info-slide {
      display: flex; justify-content: space-between; align-items: flex-end;
      width: 100%; opacity: 0; position: absolute; left: 0; bottom: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
    .re-lead-info-slide.active {
      opacity: 1; position: relative; pointer-events: auto;
    }
    .re-lead-info-left { max-width: 320px; }
    .re-lead-name {
      font-size: 1.15rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;
    }
    .re-lead-role {
      font-size: 0.78rem; color: #888; margin-bottom: 16px;
    }
    .re-lead-divider {
      width: 40px; height: 1px; background: #ddd; margin-bottom: 16px;
    }
    .re-lead-bio {
      font-size: 0.82rem; color: #999; line-height: 1.6;
    }
    .re-lead-info-right {
      display: flex; gap: 40px; text-align: left;
    }
    .re-lead-stat-label {
      font-size: 0.68rem; color: #aaa; text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 4px;
    }
    .re-lead-stat-value {
      font-size: 0.88rem; font-weight: 600; color: #1a1a1a; line-height: 1.4;
    }
    .re-lead-arrow {
      position: absolute; bottom: 0; right: 0;
      width: 44px; height: 44px; border-radius: 50%; border: 1px solid #ddd;
      background: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; color: #666; z-index: 2;
    }
    .re-lead-arrow:hover { border-color: #999; color: #1a1a1a; }
    @media(max-width:900px){
      .re-leadership { padding: 60px var(--re-px); min-height: auto; }
      .re-lead-photos { width: 320px; height: 300px; }
      .re-lead-photo[data-pos="back-left"] { width: 140px; height: 170px; left: 20px; }
      .re-lead-photo[data-pos="front"] { width: 180px; height: 240px; left: 90px; }
      .re-lead-photo[data-pos="back-right"] { width: 140px; height: 200px; left: 200px; }
      .re-lead-info { flex-direction: column; gap: 24px; }
      .re-lead-info-slide { flex-direction: column; gap: 16px; }
      .re-lead-info-right { gap: 24px; }
    }

    /* RE Partners */
    .re-partners {
      padding: 48px var(--re-px); text-align: center; border-top: 1px solid #eee;
    }
    .re-partners-title { font-size: 0.8rem; color: #aaa; margin-bottom: 32px; letter-spacing: 0.1em; }
    .re-partners-logos {
      display: flex; justify-content: center; align-items: center; gap: 56px; flex-wrap: wrap;
    }
    .re-partner-logo {
      font-size: 1.3rem; font-weight: 800; color: #999; letter-spacing: 0.08em;
      transition: color 0.2s;
    }
    .re-partner-logo:hover { color: #333; }

    /* RE Insights */
    .re-insights {
      padding: 80px var(--re-px);
    }
    .re-insights h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; color: #1a1a1a;
      margin-bottom: 12px;
    }
    .re-insights-cats {
      display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap;
    }
    .re-insights-cat {
      font-size: 0.78rem; color: #888; font-weight: 500; cursor: pointer;
      transition: color 0.2s; padding: 4px 0; border-bottom: 2px solid transparent;
    }
    .re-insights-cat.active { color: #1a1a1a; border-bottom-color: ${primaryColor}; }
    .re-articles-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }
    .re-article-card {
      border-radius: 16px; overflow: hidden; background: #fff;
      border: 1px solid #eee; transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }
    .re-article-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
    .re-article-card img {
      width: 100%; aspect-ratio: 16/10; object-fit: cover;
    }
    .re-article-body { padding: 20px; }
    .re-article-cat {
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: ${primaryColor}; margin-bottom: 8px;
    }
    .re-article-title { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; line-height: 1.4; margin-bottom: 8px; }
    .re-article-date { font-size: 0.72rem; color: #aaa; }
    @media(max-width:768px){
      .re-insights { padding: 60px var(--re-px); }
      .re-articles-grid { grid-template-columns: 1fr; }
    }

    /* RE Testimonials */
    .re-testi {
      padding: 80px var(--re-px);
    }
    .re-testi h2 {
      font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 300; color: #1a1a1a;
      margin-bottom: 48px; letter-spacing: -0.02em; line-height: 1.15;
    }
    .re-testi-body {
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
    }
    .re-testi-left {
      display: flex; flex-direction: column; gap: 0;
    }
    .re-testi-social {
      display: flex; align-items: center; gap: 16px;
    }
    .re-testi-arrow-icon {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid #ddd;
      display: flex; align-items: center; justify-content: center;
      color: #888; flex-shrink: 0;
    }
    .re-testi-avatars {
      display: flex; align-items: center;
    }
    .re-testi-avatars img {
      width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
      border: 3px solid #fff; margin-left: -12px; position: relative;
    }
    .re-testi-avatars img:first-child { margin-left: 0; }
    .re-testi-review-count {
      display: flex; align-items: baseline; gap: 6px; margin-left: 12px;
    }
    .re-testi-review-count .num {
      font-size: 1.3rem; font-weight: 700; color: #1a1a1a;
    }
    .re-testi-review-count .lbl {
      font-size: 0.78rem; color: #888; font-weight: 400;
    }
    .re-testi-right {
      display: flex; flex-direction: column;
    }
    .re-testi-quote-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: #e8866a; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; font-weight: 700; font-family: Georgia, serif;
      margin-bottom: 24px; flex-shrink: 0;
    }
    .re-testi-slides {
      position: relative; min-height: 200px;
    }
    .re-testi-slide {
      opacity: 0; position: absolute; top: 0; left: 0; right: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
    .re-testi-slide.active {
      opacity: 1; position: relative; pointer-events: auto;
    }
    .re-testi-quote {
      font-size: clamp(0.95rem, 1.6vw, 1.15rem); color: #2a2a2a; line-height: 1.75;
      margin-bottom: 32px; font-weight: 400;
    }
    .re-testi-divider {
      width: 60px; height: 2px; background: #1a1a1a; margin-bottom: 28px;
    }
    .re-testi-author {
      display: flex; align-items: center; gap: 14px;
    }
    .re-testi-avatar {
      width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
    }
    .re-testi-name { font-weight: 700; font-size: 0.92rem; color: #1a1a1a; }
    .re-testi-role { font-size: 0.75rem; color: #999; margin-top: 2px; }
    .re-testi-nav {
      display: flex; gap: 8px; align-self: flex-end; margin-top: 24px;
    }
    .re-testi-nav-btn {
      width: 44px; height: 44px; border-radius: 50%; border: 1px solid #ddd;
      background: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; color: #666;
    }
    .re-testi-nav-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
    .re-testi-nav-btn.dark {
      background: #1a1a1a; border-color: #1a1a1a; color: #fff;
    }
    .re-testi-nav-btn.dark:hover { background: #333; }
    @media(max-width:768px){
      .re-testi { padding: 60px var(--re-px); }
      .re-testi-body { grid-template-columns: 1fr; gap: 40px; }
      .re-testi-nav { align-self: flex-start; }
    }

    /* RE Contact */
    .re-contact {
      padding: 80px var(--re-px);
    }
    .re-contact-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
    }
    .re-contact h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; color: #1a1a1a;
      line-height: 1.25; margin-bottom: 40px; white-space: pre-line;
    }
    .re-contact-form {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    .re-form-group { display: flex; flex-direction: column; gap: 6px; }
    .re-form-group.full { grid-column: 1 / -1; }
    .re-form-label { font-size: 0.75rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.06em; }
    .re-form-input {
      padding: 14px 16px; border-radius: 12px; border: 1px solid #ddd;
      background: #fafafa; font-size: 0.85rem; color: #1a1a1a;
      outline: none; transition: border-color 0.2s;
    }
    .re-form-input:focus { border-color: ${primaryColor}; }
    .re-form-select {
      padding: 14px 16px; border-radius: 12px; border: 1px solid #ddd;
      background: #fafafa; font-size: 0.85rem; color: #1a1a1a;
      outline: none; transition: border-color 0.2s; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 16px center;
    }
    .re-form-select:focus { border-color: ${primaryColor}; }
    .re-form-submit {
      grid-column: 1 / -1; padding: 16px 32px; border-radius: 12px;
      border: none; background: #1a1a1a; color: #fff; font-size: 0.85rem;
      font-weight: 600; cursor: pointer; transition: all 0.3s; margin-top: 8px;
    }
    .re-form-submit:hover { background: ${primaryColor}; }
    .re-contact-right {
      display: flex; flex-direction: column; gap: 24px;
    }
    .re-contact-map {
      width: 100%; aspect-ratio: 4/3; border-radius: 16px; background: #e8e8e8;
      overflow: hidden; border: 1px solid #eee;
    }
    .re-contact-note {
      font-size: 0.8rem; color: #888;
    }
    @media(max-width:768px){
      .re-contact { padding: 60px var(--re-px); }
      .re-contact-grid { grid-template-columns: 1fr; }
      .re-contact-form { grid-template-columns: 1fr; }
    }

    /* RE Footer */
    .re-footer {
      background: #0a0a0a; padding: 64px var(--re-px) 32px; color: #fff;
    }
    .re-footer-grid {
      display: grid; grid-template-columns: 1.5fr repeat(3, 1fr); gap: 48px;
      margin-bottom: 48px;
    }
    .re-footer-brand {
      font-size: 1.4rem; font-weight: 800; margin-bottom: 16px;
      display: flex; align-items: center; gap: 10px;
    }
    .re-footer-tagline {
      font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.6;
      white-space: pre-line;
    }
    .re-footer-col-title {
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin-bottom: 20px;
    }
    .re-footer-link {
      display: block; color: rgba(255,255,255,0.65); font-size: 0.85rem;
      text-decoration: none; margin-bottom: 12px; transition: color 0.2s;
    }
    .re-footer-link:hover { color: #fff; }
    .re-footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08);
      flex-wrap: wrap; gap: 16px;
    }
    .re-footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
    .re-footer-socials { display: flex; gap: 16px; }
    .re-footer-social {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.5); transition: all 0.2s; text-decoration: none;
    }
    .re-footer-social:hover { border-color: rgba(255,255,255,0.4); color: #fff; }
    @media(max-width:768px){
      .re-footer { padding: 48px var(--re-px) 24px; }
      .re-footer-grid { grid-template-columns: 1fr 1fr; }
    }

    /* RE Animations */
    .re-fade-up {
      opacity: 0; transform: translateY(30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .re-fade-up.visible {
      opacity: 1; transform: translateY(0);
    }
    .re-stagger-1 { transition-delay: 0.1s; }
    .re-stagger-2 { transition-delay: 0.2s; }
    .re-stagger-3 { transition-delay: 0.3s; }
    .re-stagger-4 { transition-delay: 0.4s; }
    .re-stagger-5 { transition-delay: 0.5s; }

    /* ============================================================
       SMARTWATCH TEMPLATE STYLES
       ============================================================ */
    :root {
      --sw-px: clamp(40px, 8vw, 160px);
      --sw-green: ${primaryColor};
      --sw-dark: #1a1a2e;
      --sw-gray: #6b7280;
      --sw-light: #f9fafb;
    }

    /* ---- SW Scroll Animations ---- */
    .sw-fade-up {
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .sw-fade-up.sw-visible { opacity: 1; transform: translateY(0); }
    .sw-fade-left {
      opacity: 0; transform: translateX(-40px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .sw-fade-left.sw-visible { opacity: 1; transform: translateX(0); }
    .sw-fade-right {
      opacity: 0; transform: translateX(40px);
      transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .sw-fade-right.sw-visible { opacity: 1; transform: translateX(0); }
    .sw-delay-1 { transition-delay: 0.08s; }
    .sw-delay-2 { transition-delay: 0.16s; }
    .sw-delay-3 { transition-delay: 0.24s; }
    .sw-delay-4 { transition-delay: 0.32s; }
    .sw-delay-5 { transition-delay: 0.40s; }
    .sw-delay-6 { transition-delay: 0.48s; }

    /* ---- SW Section Label (reusable) ---- */
    .sw-section-label {
      display: inline-block; font-size: 0.72rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: var(--sw-green); margin-bottom: 10px;
    }

    /* ---- SW Navigation ---- */
    .sw-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px var(--sw-px); background: #fff;
      position: sticky; top: 0; z-index: 900;
      border-bottom: 1px solid rgba(0,0,0,0.04);
      transition: box-shadow 0.3s ease;
    }
    .sw-nav.sw-scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .sw-nav-logo {
      font-size: 1.25rem; font-weight: 800; color: var(--sw-green);
      text-decoration: none; letter-spacing: -0.02em;
    }
    .sw-nav-links { display: flex; gap: 36px; list-style: none; }
    .sw-nav-links a {
      text-decoration: none; font-size: 0.82rem; font-weight: 500;
      color: var(--sw-gray); transition: color 0.2s;
    }
    .sw-nav-links a:hover, .sw-nav-links a.active { color: var(--sw-dark); }
    .sw-nav-cta {
      padding: 10px 26px; border-radius: 8px; font-size: 0.8rem;
      font-weight: 600; color: #fff; background: var(--sw-green);
      text-decoration: none; border: none; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sw-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,184,148,0.25); }
    .sw-nav-hamburger {
      display: none; width: 36px; height: 36px; border: none;
      background: transparent; cursor: pointer; flex-direction: column;
      align-items: center; justify-content: center; gap: 5px;
    }
    .sw-nav-hamburger span {
      display: block; width: 22px; height: 2px; background: var(--sw-dark);
      border-radius: 2px; transition: 0.3s;
    }
    @media(max-width:768px){
      .sw-nav-links { display: none; }
      .sw-nav-hamburger { display: flex; }
    }

    /* ---- SW Hero ---- */
    .sw-hero {
      padding: 80px var(--sw-px) 60px; display: flex; align-items: center;
      gap: 48px; overflow: hidden; min-height: 560px;
    }
    .sw-hero-left { flex: 1; min-width: 0; }
    .sw-hero-headline {
      font-size: clamp(2.2rem, 4.2vw, 3.4rem); font-weight: 800;
      color: var(--sw-dark); line-height: 1.15; margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .sw-hero-headline .sw-hl {
      color: var(--sw-green); font-style: italic;
    }
    .sw-hero-desc {
      font-size: 0.92rem; color: var(--sw-gray); line-height: 1.75;
      margin-bottom: 32px; max-width: 440px;
    }
    .sw-hero-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 36px; border-radius: 50px;
      font-size: 0.88rem; font-weight: 600; color: #fff;
      background: var(--sw-green); text-decoration: none;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .sw-hero-cta:hover {
      transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,184,148,0.3);
    }
    .sw-hero-cta svg { transition: transform 0.25s; }
    .sw-hero-cta:hover svg { transform: translateX(3px); }
    .sw-hero-right {
      flex: 1; position: relative; display: flex; align-items: center;
      justify-content: center; min-height: 480px;
    }
    /* Outer neon glow ring */
    .sw-hero-right::before {
      content: ''; position: absolute;
      width: clamp(340px, 38vw, 520px); height: clamp(340px, 38vw, 520px);
      border-radius: 50%; z-index: 0;
      background: radial-gradient(circle,
        rgba(0,184,148,0.18) 0%,
        rgba(0,184,148,0.08) 40%,
        rgba(0,184,148,0.02) 65%,
        transparent 80%);
      box-shadow:
        0 0 60px 10px rgba(0,184,148,0.12),
        0 0 120px 40px rgba(0,184,148,0.06),
        inset 0 0 60px 10px rgba(0,184,148,0.05);
      animation: sw-glow-pulse 4s ease-in-out infinite;
    }
    /* Inner glassmorphism circle */
    .sw-hero-right::after {
      content: ''; position: absolute;
      width: clamp(260px, 28vw, 400px); height: clamp(260px, 28vw, 400px);
      border-radius: 50%; z-index: 0;
      background: rgba(0,184,148,0.06);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(0,184,148,0.12);
      box-shadow:
        0 0 40px 8px rgba(0,184,148,0.08),
        inset 0 0 40px 4px rgba(0,184,148,0.04);
    }
    @keyframes sw-glow-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.75; transform: scale(1.04); }
    }
    .sw-hero-img {
      position: relative; z-index: 1;
      width: clamp(320px, 34vw, 480px); height: auto; object-fit: contain;
      filter: drop-shadow(0 30px 60px rgba(0,0,0,0.14));
      animation: sw-float 5s ease-in-out infinite;
      transition: transform 0.6s cubic-bezier(.22,1,.36,1), filter 0.6s cubic-bezier(.22,1,.36,1);
    }
    .sw-hero-img:hover {
      animation-play-state: paused;
      transform: translateY(-10px) scale(1.06) rotateY(-4deg);
      filter: drop-shadow(0 36px 72px rgba(0,0,0,0.20));
    }
    @keyframes sw-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-16px); }
    }
    .sw-hero-badge {
      position: absolute; top: 24px; right: 8px; z-index: 2;
      background: #fff; border-radius: 12px; padding: 14px 20px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.07);
      font-size: 0.78rem; font-weight: 700; color: var(--sw-dark);
      line-height: 1.3;
    }
    .sw-hero-badge strong {
      display: block; font-size: 1.3rem; color: var(--sw-green);
    }
    @media(max-width:768px){
      .sw-hero {
        flex-direction: column; text-align: center;
        padding: 48px var(--sw-px) 40px; min-height: auto; gap: 32px;
      }
      .sw-hero-desc { margin-left: auto; margin-right: auto; }
      .sw-hero-right { min-height: 280px; }
      .sw-hero-right::before { width: clamp(240px, 60vw, 340px); height: clamp(240px, 60vw, 340px); }
      .sw-hero-right::after { width: clamp(180px, 45vw, 260px); height: clamp(180px, 45vw, 260px); }
      .sw-hero-img { width: clamp(220px, 55vw, 320px); }
    }

    /* ---- SW Features Strip ---- */
    .sw-features {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
      padding: 40px var(--sw-px);
      border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;
    }
    .sw-feature-card {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 20px 18px; border-radius: 12px; background: #fff;
      border: 1px solid #f0f0f0; transition: box-shadow 0.3s, transform 0.3s;
    }
    .sw-feature-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.05); transform: translateY(-2px);
    }
    .sw-feature-icon {
      width: 44px; height: 44px; border-radius: 10px;
      background: rgba(0,184,148,0.08); display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; color: var(--sw-green);
    }
    .sw-feature-title {
      font-size: 0.88rem; font-weight: 700; color: var(--sw-dark);
      margin-bottom: 4px;
    }
    .sw-feature-desc { font-size: 0.76rem; color: #9ca3af; line-height: 1.5; }
    @media(max-width:640px){
      .sw-features { grid-template-columns: 1fr; gap: 12px; padding: 28px var(--sw-px); }
    }

    /* ---- SW Products Carousel ---- */
    .sw-products { padding: 80px var(--sw-px); text-align: center; overflow: hidden; }
    .sw-products h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800;
      color: var(--sw-dark); margin-bottom: 12px; letter-spacing: -0.02em;
    }
    .sw-products h2 span { color: var(--sw-green); }
    .sw-products-sub {
      font-size: 0.85rem; color: #9ca3af; max-width: 520px;
      margin: 0 auto 48px; line-height: 1.7;
    }
    .sw-products-track-wrap {
      position: relative; overflow: hidden;
      margin: 0 -12px;
    }
    .sw-products-track {
      display: flex; gap: 24px;
      transition: transform 0.65s cubic-bezier(.22,1,.36,1);
      will-change: transform;
    }
    .sw-product-card {
      flex: 0 0 calc(33.333% - 16px); min-width: 0;
      background: #fff; border: 1px solid #f0f0f0; border-radius: 16px;
      overflow: hidden;
      transition: transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s cubic-bezier(.22,1,.36,1), opacity 0.5s;
      opacity: 0.7;
    }
    .sw-product-card.sw-card-active {
      transform: scale(1.08); opacity: 1; z-index: 2;
      box-shadow: 0 20px 60px rgba(0,0,0,0.10);
    }
    .sw-product-card.sw-card-side {
      transform: scale(0.95); opacity: 0.85;
    }
    .sw-product-card:hover {
      box-shadow: 0 16px 48px rgba(0,0,0,0.07);
    }
    .sw-product-img-wrap {
      background: var(--sw-light); padding: 28px;
      display: flex; align-items: center; justify-content: center;
      aspect-ratio: 1;
    }
    .sw-product-img-wrap img {
      width: 75%; height: auto; object-fit: contain;
      transition: transform 0.5s cubic-bezier(.22,1,.36,1);
    }
    .sw-product-card:hover .sw-product-img-wrap img { transform: scale(1.06); }
    .sw-product-body { padding: 18px 20px 22px; }
    .sw-product-name {
      font-size: 0.9rem; font-weight: 700; color: var(--sw-dark);
      margin-bottom: 2px;
    }
    .sw-product-color {
      font-size: 0.74rem; color: #9ca3af; margin-bottom: 10px;
    }
    .sw-product-meta {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .sw-product-price {
      font-size: 1.05rem; font-weight: 800; color: var(--sw-green);
    }
    .sw-product-stars { display: flex; align-items: center; gap: 3px; }
    .sw-product-stars svg { width: 13px; height: 13px; }
    .sw-product-reviews { font-size: 0.7rem; color: #bbb; margin-left: 4px; }
    .sw-product-actions { display: flex; gap: 8px; }
    .sw-btn-buy {
      flex: 1; padding: 10px 0; border-radius: 8px; border: none;
      background: var(--sw-green); color: #fff; font-size: 0.78rem;
      font-weight: 600; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sw-btn-buy:hover {
      transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,184,148,0.25);
    }
    .sw-btn-fav {
      width: 40px; height: 40px; border-radius: 8px;
      border: 1px solid #f0f0f0; background: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: border-color 0.2s, color 0.2s; color: #d1d5db;
    }
    .sw-btn-fav:hover { border-color: #f87171; color: #f87171; }
    /* Carousel arrows */
    .sw-products-arrows {
      display: flex; justify-content: center; gap: 16px; margin-top: 36px;
    }
    .sw-products-arrow {
      width: 44px; height: 44px; border-radius: 50%;
      border: 1.5px solid #e5e7eb; background: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.25s ease;
      color: var(--sw-dark);
    }
    .sw-products-arrow:hover {
      background: var(--sw-green); border-color: var(--sw-green); color: #fff;
      box-shadow: 0 4px 16px rgba(0,184,148,0.25);
    }
    .sw-products-arrow svg { width: 18px; height: 18px; }
    /* Dot indicators */
    .sw-products-dots {
      display: flex; justify-content: center; gap: 8px; margin-top: 18px;
    }
    .sw-products-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb;
      border: none; cursor: pointer; padding: 0;
      transition: all 0.35s cubic-bezier(.22,1,.36,1);
    }
    .sw-products-dot.sw-dot-active {
      width: 28px; border-radius: 4px; background: var(--sw-green);
    }
    @media(max-width:768px){
      .sw-product-card { flex: 0 0 calc(50% - 12px); }
      .sw-product-card.sw-card-active { transform: scale(1.04); }
    }
    @media(max-width:550px){
      .sw-products { padding: 60px var(--sw-px); }
      .sw-product-card { flex: 0 0 calc(80% - 12px); }
      .sw-product-card.sw-card-active { transform: scale(1.02); }
    }

    /* ---- SW Showcase ---- */
    .sw-showcase {
      padding: 80px var(--sw-px); display: flex; align-items: center;
      gap: 56px; background: var(--sw-light);
    }
    .sw-showcase-img {
      flex: 1; display: flex; align-items: center; justify-content: center;
    }
    .sw-showcase-img img {
      width: 80%; max-width: 400px; height: auto; object-fit: contain;
      filter: drop-shadow(0 20px 48px rgba(0,0,0,0.10));
      transition: transform 0.5s cubic-bezier(.22,1,.36,1), filter 0.5s cubic-bezier(.22,1,.36,1);
    }
    .sw-showcase-img img:hover {
      transform: scale(1.08) translateY(-6px);
      filter: drop-shadow(0 28px 56px rgba(0,0,0,0.16));
    }
    .sw-showcase-info { flex: 1; }
    .sw-showcase-info h2 {
      font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800;
      color: var(--sw-dark); line-height: 1.25; margin-bottom: 16px;
      letter-spacing: -0.01em;
    }
    .sw-showcase-desc {
      font-size: 0.85rem; color: var(--sw-gray); line-height: 1.75;
      margin-bottom: 32px;
    }
    .sw-specs-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    }
    .sw-spec {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 0; font-size: 0.8rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .sw-spec:nth-child(odd) { padding-right: 24px; }
    .sw-spec:nth-child(even) { padding-left: 24px; border-left: 1px solid #e5e7eb; }
    .sw-spec-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--sw-green); flex-shrink: 0;
    }
    .sw-spec-label { color: var(--sw-gray); }
    .sw-spec-val { font-weight: 600; color: var(--sw-dark); margin-left: auto; white-space: nowrap; }
    @media(max-width:768px){
      .sw-showcase { flex-direction: column; gap: 40px; padding: 60px var(--sw-px); }
    }

    /* ---- SW Choice ---- */
    .sw-choice {
      padding: 120px var(--sw-px); display: flex; align-items: center; gap: 56px;
    }
    .sw-choice-img { flex: 1; display: flex; justify-content: center; }
    .sw-choice-img img {
      width: 80%; max-width: 400px; height: auto; object-fit: contain;
      filter: drop-shadow(0 20px 48px rgba(0,0,0,0.10));
    }
    .sw-choice-info { flex: 1; }
    .sw-choice-info h2 {
      font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800;
      color: var(--sw-dark); line-height: 1.25; margin-bottom: 14px;
      letter-spacing: -0.01em;
    }
    .sw-choice-desc {
      font-size: 0.85rem; color: var(--sw-gray); line-height: 1.75;
      margin-bottom: 28px;
    }
    .sw-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 28px; }
    .sw-check {
      display: flex; align-items: center; gap: 10px;
      font-size: 0.84rem; font-weight: 500; color: #374151;
    }
    .sw-check-icon {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--sw-green);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    @media(max-width:768px){
      .sw-choice { flex-direction: column; gap: 40px; padding: 60px var(--sw-px); }
    }

    /* ---- SW Offer ---- */
    .sw-offer { padding: 80px var(--sw-px); text-align: center; background: #fff; }
    .sw-offer h2 {
      font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800;
      color: var(--sw-dark); margin-bottom: 10px; letter-spacing: -0.01em;
    }
    .sw-offer-desc {
      font-size: 0.85rem; color: #9ca3af; max-width: 500px;
      margin: 0 auto 48px; line-height: 1.7;
    }
    .sw-offer-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
      }
      .sw-offer-card {
        background: #edfcf5; border-radius: 20px; padding: 32px 28px;
        display: flex; align-items: center; gap: 20px;
        border: none; position: relative; overflow: hidden;
        transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s;
      }
      .sw-offer-card:hover {
        transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,184,148,0.10);
      }
      .sw-offer-card-img {
        flex-shrink: 0; width: 110px; height: 110px;
        display: flex; align-items: center; justify-content: center;
      }
      .sw-offer-card-img img {
        width: 100%; height: auto; object-fit: contain;
        filter: drop-shadow(0 8px 20px rgba(0,0,0,0.08));
        transition: transform 0.4s cubic-bezier(.22,1,.36,1);
      }
      .sw-offer-card:hover .sw-offer-card-img img { transform: scale(1.06); }
      .sw-offer-card-body {
        flex: 1; text-align: left;
      }
      .sw-offer-badge {
        display: block; font-size: clamp(1.1rem, 2vw, 1.4rem); font-weight: 800;
        font-style: italic; color: var(--sw-green); margin-bottom: 14px;
        line-height: 1.2;
      }
      .sw-offer-card-btn {
        display: inline-block; padding: 12px 32px; border-radius: 50px;
        background: linear-gradient(135deg, #f7a44c, #f59e0b); color: #fff;
        font-size: 0.82rem; font-weight: 700; text-decoration: none;
        border: none; cursor: pointer;
        transition: transform 0.25s, box-shadow 0.25s;
      }
      .sw-offer-card-btn:hover {
        transform: translateY(-2px); box-shadow: 0 6px 20px rgba(247,164,76,0.35);
      }
      @media(max-width:900px){
        .sw-offer-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
    }

    /* ---- SW Video ---- */
    .sw-video {
      position: relative; text-align: center;
      padding: 80px var(--sw-px) 0; overflow: visible;
    }
    .sw-video-bg {
      position: absolute; top: 0; left: 0; right: 0;
      height: 65%; background: var(--sw-green);
      z-index: 0;
    }
    .sw-video-inner {
      position: relative; z-index: 1;
    }
    .sw-video .sw-section-label { color: rgba(255,255,255,0.85); }
    .sw-video h2 {
      font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800;
      color: #fff; margin-bottom: 12px; letter-spacing: -0.01em;
    }
    .sw-video-desc {
      font-size: 0.85rem; color: rgba(255,255,255,0.8); max-width: 500px;
      margin: 0 auto 44px; line-height: 1.7;
    }
    .sw-video-wrap {
      position: relative; border-radius: 20px; overflow: hidden;
      max-width: 820px; margin: 0 auto;
      box-shadow: 0 24px 64px rgba(0,0,0,0.12);
    }
    .sw-video-wrap video {
      width: 100%; height: auto; display: block;
      object-fit: cover;
    }
    .sw-video-play {
      position: absolute; inset: 0; display: flex;
      align-items: center; justify-content: center;
      pointer-events: none;
    }
    .sw-video-play-btn {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.95); border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--sw-green); pointer-events: auto;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    .sw-video-play-btn:hover {
      transform: scale(1.1); box-shadow: 0 12px 44px rgba(0,0,0,0.2);
    }
    .sw-video-spacer { height: 80px; }
    @media(max-width:640px){
      .sw-video { padding: 60px var(--sw-px) 0; }
      .sw-video-spacer { height: 48px; }
    }

    /* ---- SW Testimonials ---- */
    .sw-testi { padding: 80px var(--sw-px); text-align: center; }
    .sw-testi h2 {
      font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800;
      color: var(--sw-dark); margin-bottom: 10px; letter-spacing: -0.01em;
    }
    .sw-testi-desc {
      font-size: 0.85rem; color: #9ca3af; max-width: 520px;
      margin: 0 auto 48px; line-height: 1.7;
    }
    .sw-testi-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
      text-align: left;
    }
    .sw-testi-card {
      padding: 28px 24px; border-radius: 16px; background: #fff;
      border: 1px solid #f0f0f0;
      transition: box-shadow 0.35s, transform 0.35s;
    }
    .sw-testi-card:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.06); transform: translateY(-3px);
    }
    .sw-testi-quote-icon {
      width: 32px; height: 32px; margin-bottom: 14px; color: #e5e7eb;
    }
    .sw-testi-text {
      font-size: 0.84rem; color: #4b5563; line-height: 1.75;
      margin-bottom: 22px;
    }
    .sw-testi-author { display: flex; align-items: center; gap: 12px; }
    .sw-testi-avatar {
      width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
    }
    .sw-testi-name {
      font-weight: 700; font-size: 0.85rem; color: var(--sw-dark);
    }
    .sw-testi-role { font-size: 0.72rem; color: #9ca3af; }
    .sw-testi-stars { display: flex; gap: 2px; margin-top: 3px; }
    .sw-testi-stars svg { width: 13px; height: 13px; fill: #f59e0b; }
    @media(max-width:768px){
      .sw-testi { padding: 60px var(--sw-px); }
      .sw-testi-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
    }

    /* ---- SW Footer ---- */
    .sw-footer {
      padding: 64px var(--sw-px) 28px; background: var(--sw-dark); color: #fff;
    }
    .sw-footer-grid {
      display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 40px;
      margin-bottom: 48px;
    }
    .sw-footer-logo {
      font-size: 1.25rem; font-weight: 800; color: var(--sw-green);
      margin-bottom: 14px; letter-spacing: -0.02em;
    }
    .sw-footer-tagline {
      font-size: 0.78rem; color: #6b7280; line-height: 1.7;
      max-width: 260px;
    }
    .sw-footer-col h4 {
      font-size: 0.82rem; font-weight: 700; color: #fff; margin-bottom: 18px;
      letter-spacing: 0.02em;
    }
    .sw-footer-col a {
      display: block; font-size: 0.78rem; color: #6b7280; margin-bottom: 11px;
      text-decoration: none; transition: color 0.2s;
    }
    .sw-footer-col a:hover { color: var(--sw-green); }
    .sw-footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08); padding-top: 22px;
      text-align: center; font-size: 0.72rem; color: #4b5563;
    }
    @media(max-width:768px){
      .sw-footer { padding: 48px var(--sw-px) 24px; }
      .sw-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    }
    @media(max-width:480px){
      .sw-footer-grid { grid-template-columns: 1fr; }
    }

    /* ============================================================
       DENTAL CLINIC TEMPLATE STYLES
       ============================================================ */
    :root {
      --dc-px: clamp(40px, 8vw, 160px);
      --dc-blue: ${primaryColor};
      --dc-dark: #0f1b3d;
      --dc-gray: #6b7280;
      --dc-light: #f5f7fb;
      --dc-lavender: #e8ecf8;
      --dc-accent: #4f6df5;
    }

    /* ---- DC Scroll Animations ---- */
    .dc-fade-up {
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .dc-fade-up.dc-visible { opacity: 1; transform: translateY(0); }
    .dc-fade-left {
      opacity: 0; transform: translateX(-32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .dc-fade-left.dc-visible { opacity: 1; transform: translateX(0); }
    .dc-fade-right {
      opacity: 0; transform: translateX(32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .dc-fade-right.dc-visible { opacity: 1; transform: translateX(0); }
    .dc-delay-1 { transition-delay: 0.08s; }
    .dc-delay-2 { transition-delay: 0.18s; }
    .dc-delay-3 { transition-delay: 0.28s; }
    .dc-delay-4 { transition-delay: 0.38s; }

    /* ---- DC Badge ---- */
    .dc-badge {
      display: inline-block; font-size: 0.68rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--dc-accent); margin-bottom: 14px;
    }

    /* ---- DC Navigation ---- */
    .dc-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px var(--dc-px); position: absolute; top: 0; left: 0; right: 0;
      z-index: 100; background: transparent;
      transition: background 0.35s, box-shadow 0.35s, backdrop-filter 0.35s;
    }
    .dc-nav.dc-scrolled {
      position: fixed;
      background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .dc-nav-logo {
      font-size: 1.2rem; font-weight: 800; color: #fff;
      text-decoration: none; display: flex; align-items: center; gap: 8px;
      transition: color 0.3s;
    }
    .dc-nav.dc-scrolled .dc-nav-logo { color: var(--dc-blue); }
    .dc-nav-logo svg { width: 22px; height: 22px; transition: stroke 0.3s; }
    .dc-nav.dc-scrolled .dc-nav-logo svg { stroke: var(--dc-blue); }
    .dc-nav-links { display: flex; gap: 32px; }
    .dc-nav-links a {
      font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.85);
      text-decoration: none; transition: color 0.2s;
    }
    .dc-nav-links a:hover { color: #fff; }
    .dc-nav.dc-scrolled .dc-nav-links a { color: #374151; }
    .dc-nav.dc-scrolled .dc-nav-links a:hover { color: var(--dc-blue); }
    .dc-nav-right { display: flex; align-items: center; gap: 16px; }
    .dc-nav-icon {
      width: 38px; height: 38px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; background: rgba(255,255,255,0.12);
      border: none; cursor: pointer; color: #fff; transition: background 0.2s, color 0.2s;
    }
    .dc-nav-icon:hover { background: rgba(255,255,255,0.22); }
    .dc-nav.dc-scrolled .dc-nav-icon { background: rgba(0,0,0,0.05); color: var(--dc-dark); }
    .dc-nav-icon svg { width: 18px; height: 18px; }
    .dc-nav-hamburger {
      display: none; flex-direction: column; gap: 4px; background: none;
      border: none; cursor: pointer; padding: 6px;
    }
    .dc-nav-hamburger span {
      width: 22px; height: 2px; background: #fff; border-radius: 2px;
      transition: background 0.3s;
    }
    .dc-nav.dc-scrolled .dc-nav-hamburger span { background: var(--dc-dark); }
    @media(max-width:768px){
      .dc-nav-links { display: none; }
      .dc-nav-hamburger { display: flex; }
    }

    /* ---- DC Hero ---- */
    .dc-hero {
      position: relative; min-height: 100vh; overflow: visible;
      display: flex; flex-direction: column; justify-content: center;
      padding: 0;
    }
    .dc-hero-bg {
      position: absolute; inset: 0; z-index: 0;
    }
    .dc-hero-bg img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .dc-hero-bg::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(
        to right,
        rgba(15,27,61,0.70) 0%,
        rgba(15,27,61,0.50) 30%,
        rgba(15,27,61,0.15) 55%,
        rgba(15,27,61,0.05) 70%,
        transparent 100%
      );
    }
    .dc-hero-bg::before {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0;
      height: 35%; z-index: 1;
      background: linear-gradient(to top, rgba(15,27,61,0.55) 0%, transparent 100%);
    }
    .dc-hero-inner {
      position: relative; z-index: 2;
      padding: 160px var(--dc-px) 0;
      min-height: calc(100vh - 100px);
      display: flex; flex-direction: column; justify-content: center;
    }
    .dc-hero-headline {
      font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 700;
      color: #fff; line-height: 1.15; max-width: 620px;
      letter-spacing: -0.02em; margin-bottom: 28px;
    }
    .dc-hero-sub-row {
      display: flex; align-items: flex-start; gap: 24px; max-width: 580px;
      margin-bottom: 32px;
    }
    .dc-hero-brand-label {
      font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.6);
      white-space: nowrap; margin-top: 2px;
      letter-spacing: 0.02em;
    }
    .dc-hero-subheadline {
      font-size: 0.86rem; font-weight: 400; color: rgba(255,255,255,0.75);
      line-height: 1.7; max-width: 420px;
    }
    .dc-hero-video-cta {
      display: inline-flex; align-items: center; gap: 12px;
      color: #fff; text-decoration: none; font-size: 0.86rem; font-weight: 500;
      transition: opacity 0.2s;
    }
    .dc-hero-video-cta:hover { opacity: 0.8; }
    .dc-hero-play-btn {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1.5px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .dc-hero-video-cta:hover .dc-hero-play-btn {
      background: rgba(255,255,255,0.25);
    }
    .dc-hero-play-btn svg { width: 18px; height: 18px; margin-left: 2px; }

    /* Patient Recovery Badge — top right glassmorphism */
    .dc-hero-patient-badge {
      position: absolute; top: 120px; right: var(--dc-px); z-index: 5;
      display: flex; align-items: center; gap: 14px;
      background: rgba(255,255,255,0.20); backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.30);
      border-radius: 60px; padding: 10px 22px 10px 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10);
    }
    .dc-hero-patient-avatars {
      display: flex;
    }
    .dc-hero-patient-avatars img {
      width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
      border: 2.5px solid rgba(255,255,255,0.5); margin-left: -10px;
    }
    .dc-hero-patient-avatars img:first-child { margin-left: 0; }
    .dc-hero-patient-info {
      display: flex; flex-direction: column;
    }
    .dc-hero-patient-value {
      font-size: 1.1rem; font-weight: 800; color: #fff;
      display: flex; align-items: center; gap: 6px;
    }
    .dc-hero-patient-check {
      width: 20px; height: 20px; border-radius: 50%;
      background: #3b82f6; display: flex;
      align-items: center; justify-content: center;
    }
    .dc-hero-patient-check svg { width: 12px; height: 12px; }
    .dc-hero-patient-label {
      font-size: 0.72rem; color: rgba(255,255,255,0.7); font-weight: 500;
    }

    /* Bottom Stats Bar — glassmorphism */
    .dc-hero-stats-bar {
      position: absolute; bottom: 0; left: 0; right: 0; z-index: 4;
      display: grid; grid-template-columns: repeat(4, 1fr);
      background: rgba(255,255,255,0.12); backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.18);
    }
    .dc-hero-stat {
      padding: 28px 32px; text-align: center;
      border-right: 1px solid rgba(255,255,255,0.10);
    }
    .dc-hero-stat:last-child { border-right: none; }
    .dc-hero-stat-value {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; color: #fff;
      margin-bottom: 4px;
    }
    .dc-hero-stat-label {
      font-size: 0.76rem; color: rgba(255,255,255,0.65); font-weight: 400;
    }

    /* About section — remove extra top padding override */

    @media(max-width:960px){
      .dc-hero-patient-badge { top: 100px; right: 20px; }
    }
    @media(max-width:768px){
      .dc-hero { min-height: 90vh; }
      .dc-hero-inner { padding: 140px var(--dc-px) 100px; }
      .dc-hero-headline { font-size: clamp(1.8rem, 6vw, 2.6rem); }
      .dc-hero-sub-row { flex-direction: column; gap: 12px; }
      .dc-hero-stats-bar { grid-template-columns: repeat(2, 1fr); }
      .dc-hero-patient-badge { position: static; margin: 20px var(--dc-px) 0; width: fit-content; }
    }
    @media(max-width:480px){
      .dc-hero { min-height: 80vh; }
      .dc-hero-inner { padding: 120px var(--dc-px) 80px; }
      .dc-hero-stats-bar { grid-template-columns: 1fr 1fr; }
      .dc-hero-stat { padding: 18px 16px; }
    }

    /* ---- DC About ---- */
    .dc-about {
      padding: 100px var(--dc-px); display: flex; align-items: center; gap: 56px;
      background: var(--dc-light);
    }
    .dc-about-info { flex: 1; }
    .dc-about-info .dc-badge {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--dc-gray);
      background: rgba(0,0,0,0.04); padding: 6px 14px; border-radius: 20px;
      display: inline-block; margin-bottom: 20px;
    }
    .dc-about-info h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700;
      color: var(--dc-dark); line-height: 1.2; margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .dc-about-desc {
      font-size: 0.86rem; color: var(--dc-gray); line-height: 1.8;
      margin-bottom: 32px; max-width: 460px; font-weight: 400;
    }
    .dc-about-cta {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 28px 14px 32px; border-radius: 50px; font-size: 0.84rem;
      font-weight: 600; color: #fff; background: var(--dc-dark);
      text-decoration: none; transition: transform 0.25s, box-shadow 0.25s;
    }
    .dc-about-cta:hover {
      transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,27,61,0.30);
    }
    .dc-about-cta-arrow {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.15); display: flex;
      align-items: center; justify-content: center;
    }
    .dc-about-cta-arrow svg { width: 13px; height: 13px; }

    /* About Visual — decorative frame */
    .dc-about-visual { flex: 1; display: flex; justify-content: center; }
    .dc-about-frame {
      position: relative; display: flex; align-items: center; justify-content: center;
    }
    .dc-about-frame::before {
      content: ''; position: absolute;
      width: calc(100% + 48px); height: calc(100% + 48px);
      border: 1.5px solid rgba(30,58,110,0.15); border-radius: 50%;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    }
    .dc-about-frame img {
      width: 88%; max-width: 400px; border-radius: 16px; object-fit: cover;
      box-shadow: 0 16px 48px rgba(30,58,110,0.10);
      position: relative; z-index: 1;
    }
    .dc-about-frame-icon {
      position: absolute; z-index: 2;
      width: 44px; height: 44px; border-radius: 50%; background: #fff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      display: flex; align-items: center; justify-content: center;
    }
    .dc-about-frame-icon svg { width: 20px; height: 20px; }
    .dc-about-frame-icon--top { top: -10px; left: 50%; transform: translateX(-50%); }
    .dc-about-frame-icon--bottom { bottom: -10px; left: 50%; transform: translateX(-50%); }
    @media(max-width:768px){
      .dc-about { flex-direction: column; gap: 40px; padding: 80px var(--dc-px); }
      .dc-about-frame::before { width: calc(100% + 32px); height: calc(100% + 32px); }
    }

    /* ---- DC Reasons ---- */
    .dc-reasons {
      padding: 100px var(--dc-px); background: var(--dc-light);
    }
    .dc-reasons-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 48px; gap: 32px;
    }
    .dc-reasons-header-left {}
    .dc-reasons-header .dc-badge {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--dc-gray);
      background: rgba(0,0,0,0.04); padding: 6px 14px; border-radius: 20px;
      display: inline-block; margin-bottom: 18px;
    }
    .dc-reasons-header h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700;
      color: var(--dc-dark); line-height: 1.2; letter-spacing: -0.02em;
    }
    .dc-reasons-cert {
      display: flex; align-items: flex-start; gap: 12px;
      padding-top: 10px; text-align: right;
    }
    .dc-reasons-cert-icon {
      width: 40px; height: 40px; border-radius: 50%; background: var(--dc-dark);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .dc-reasons-cert-icon svg { width: 18px; height: 18px; }
    .dc-reasons-cert-text {
      font-size: 0.8rem; font-weight: 500; color: var(--dc-dark); line-height: 1.5;
    }
    .dc-reasons-cert-link {
      font-size: 0.8rem; font-weight: 700; color: var(--dc-accent);
      text-decoration: none; display: inline-flex; align-items: center; gap: 5px;
    }
    .dc-reasons-cert-link svg { width: 13px; height: 13px; }

    /* Reasons Grid — 3 cards + 1 image card */
    .dc-reasons-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
    }
    .dc-reason-card {
      background: #fff; border-radius: 16px; padding: 28px 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.04);
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
    }
    .dc-reason-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 48px rgba(0,0,0,0.10);
    }
    .dc-reason-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--dc-lavender); display: flex;
      align-items: center; justify-content: center; margin-bottom: 22px;
    }
    .dc-reason-icon svg { width: 20px; height: 20px; }
    .dc-reason-card h3 {
      font-size: 0.94rem; font-weight: 700; color: var(--dc-dark);
      margin-bottom: 10px; line-height: 1.3;
    }
    .dc-reason-card p {
      font-size: 0.8rem; color: var(--dc-gray); line-height: 1.7; margin: 0;
    }

    /* Image card (4th column) */
    .dc-reason-img-card {
      border-radius: 16px; overflow: hidden; position: relative;
      min-height: 280px;
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
    }
    .dc-reason-img-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 48px rgba(0,0,0,0.12);
    }
    .dc-reason-img-card img {
      width: 100%; height: 100%; object-fit: cover;
      position: absolute; inset: 0;
    }
    .dc-reason-img-card::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(15,27,61,0.85) 0%, rgba(15,27,61,0.40) 50%, rgba(15,27,61,0.15) 100%);
    }
    .dc-reason-img-card-text {
      position: absolute; bottom: 24px; left: 24px; right: 24px; z-index: 2;
      font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.3;
      font-style: italic;
    }
    @media(max-width:960px){
      .dc-reasons-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media(max-width:768px){
      .dc-reasons { padding: 80px var(--dc-px); }
      .dc-reasons-header { flex-direction: column; gap: 20px; }
      .dc-reasons-cert { text-align: left; }
    }
    @media(max-width:480px){
      .dc-reasons-grid { grid-template-columns: 1fr; }
    }

    /* ---- DC Services ---- */
    .dc-services {
      padding: 100px var(--dc-px);
    }
    .dc-services-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 48px; gap: 24px;
    }
    .dc-services-header .dc-badge {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--dc-gray);
      background: rgba(0,0,0,0.04); padding: 6px 14px; border-radius: 20px;
      display: inline-block; margin-bottom: 18px;
    }
    .dc-services-header h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700;
      color: var(--dc-dark); line-height: 1.2; letter-spacing: -0.02em;
    }
    .dc-services-more-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 50px; font-size: 0.82rem;
      font-weight: 600; color: #fff; background: var(--dc-dark);
      text-decoration: none; white-space: nowrap;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .dc-services-more-btn:hover {
      transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,27,61,0.25);
    }
    .dc-services-more-btn svg { width: 14px; height: 14px; }

    /* Services body: list left, visual right */
    .dc-services-body {
      display: flex; gap: 48px; align-items: flex-start;
    }
    .dc-services-list { flex: 1.2; }
    .dc-service-row {
      display: flex; align-items: flex-start; gap: 20px;
      padding: 24px 0; border-bottom: 1px solid #e5e7eb;
      cursor: pointer; transition: padding-left 0.3s;
    }
    .dc-service-row:first-child { border-top: 1px solid #e5e7eb; }
    .dc-service-row:hover { padding-left: 6px; }
    .dc-service-num {
      font-size: 0.72rem; font-weight: 700; color: var(--dc-accent);
      min-width: 28px; padding-top: 3px;
    }
    .dc-service-info {}
    .dc-service-name {
      font-size: 1rem; font-weight: 700; color: var(--dc-dark);
      margin-bottom: 4px; transition: color 0.2s;
    }
    .dc-service-row:hover .dc-service-name { color: var(--dc-accent); }
    .dc-service-desc {
      font-size: 0.8rem; color: var(--dc-gray); line-height: 1.65;
    }

    /* Services visual (right column) */
    .dc-services-visual {
      flex: 0.6; display: flex; flex-direction: column; gap: 18px;
      position: sticky; top: 100px;
    }
    .dc-services-photo {
      border-radius: 18px; overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    }
    .dc-services-photo img {
      width: 100%; height: 340px; object-fit: cover; display: block;
    }
    .dc-services-review-card {
      position: relative; border-radius: 16px; overflow: hidden;
      padding: 24px; min-height: 140px;
      display: flex; flex-direction: column; justify-content: flex-end;
    }
    .dc-services-review-card img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 0;
    }
    .dc-services-review-card::after {
      content: ''; position: absolute; inset: 0; z-index: 1;
      background: linear-gradient(to top, rgba(15,27,61,0.92) 0%, rgba(30,58,110,0.70) 50%, rgba(30,58,110,0.30) 100%);
    }
    .dc-services-review-inner {
      position: relative; z-index: 2;
    }
    .dc-services-review-stars { display: flex; gap: 3px; margin-bottom: 10px; }
    .dc-services-review-stars svg { width: 14px; height: 14px; }
    .dc-services-review-text {
      font-size: 0.84rem; color: #fff; line-height: 1.6;
      font-style: italic; font-weight: 500; margin-bottom: 14px;
    }
    .dc-services-review-meta {
      display: flex; align-items: center; gap: 10px;
    }
    .dc-services-review-name {
      font-size: 0.82rem; font-weight: 700; color: #fff;
    }
    .dc-services-review-role {
      font-size: 0.7rem; color: rgba(255,255,255,0.6);
    }
    @media(max-width:768px){
      .dc-services { padding: 80px var(--dc-px); }
      .dc-services-body { flex-direction: column; gap: 36px; }
      .dc-services-visual { position: static; flex-direction: row; }
      .dc-services-photo, .dc-services-review-card { flex: 1; }
      .dc-services-header { flex-direction: column; gap: 16px; }
    }
    @media(max-width:480px){
      .dc-services-visual { flex-direction: column; }
    }

    /* ---- DC Booking ---- */
    .dc-booking {
      padding: 100px var(--dc-px); display: flex; align-items: center; gap: 56px;
      background: linear-gradient(135deg, var(--dc-dark) 0%, var(--dc-blue) 40%, #6b8cce 100%);
      border-radius: 24px; margin: 0 var(--dc-px); position: relative; overflow: hidden;
    }
    .dc-booking::before {
      content: ''; position: absolute; top: -40%; right: -10%; width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(107,140,206,0.25) 0%, transparent 70%);
      border-radius: 50%; pointer-events: none;
    }
    .dc-booking-form { flex: 1; position: relative; z-index: 1; }
    .dc-booking-form .dc-badge {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: rgba(255,255,255,0.8);
      background: rgba(255,255,255,0.12); padding: 6px 16px; border-radius: 20px;
      display: inline-block; margin-bottom: 18px; backdrop-filter: blur(4px);
    }
    .dc-booking-form h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700;
      color: #fff; line-height: 1.2; margin-bottom: 36px;
      letter-spacing: -0.02em; white-space: pre-line;
    }
    .dc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .dc-form-group { display: flex; flex-direction: column; gap: 0; }
    .dc-form-group.dc-full-width { grid-column: 1 / -1; }
    .dc-form-group label {
      font-size: 0; width: 0; height: 0; overflow: hidden; position: absolute;
    }
    .dc-form-group input, .dc-form-group textarea {
      padding: 14px 0; border-radius: 0;
      border: none; border-bottom: 1px solid rgba(255,255,255,0.25);
      font-size: 0.84rem; font-family: inherit; outline: none;
      background: transparent; color: #fff;
      transition: border-color 0.2s;
    }
    .dc-form-group input::placeholder, .dc-form-group textarea::placeholder {
      color: rgba(255,255,255,0.5);
    }
    .dc-form-group input:focus, .dc-form-group textarea:focus {
      border-bottom-color: #fff;
    }
    .dc-form-group textarea {
      resize: vertical; min-height: 60px; font-family: inherit;
    }
    .dc-booking-submit {
      margin-top: 32px; padding: 16px 40px; border-radius: 50px;
      background: var(--dc-dark); color: #fff; font-size: 0.86rem;
      font-weight: 600; border: none; cursor: pointer; font-family: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .dc-booking-submit:hover {
      transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    .dc-booking-img {
      flex: 0.75; position: relative; z-index: 1;
      align-self: stretch; display: flex;
    }
    .dc-booking-img img {
      width: 100%; border-radius: 18px; object-fit: cover;
      box-shadow: 0 16px 48px rgba(0,0,0,0.15);
    }
    @media(max-width:768px){
      .dc-booking {
        flex-direction: column; gap: 40px; padding: 60px var(--dc-px);
        margin: 0; border-radius: 0;
      }
      .dc-form-grid { grid-template-columns: 1fr; }
      .dc-booking-img img { height: 320px; }
    }

    /* ---- DC Testimonial ---- */
    .dc-testimonial {
      padding: 100px var(--dc-px); display: flex; align-items: center; gap: 48px;
      background: var(--dc-light);
    }
    .dc-testimonial-left { flex: 0.5; position: relative; }
    .dc-testimonial-left img {
      width: 100%; max-width: 320px; border-radius: 20px; object-fit: cover;
    }
    .dc-testimonial-right { flex: 1; }
    .dc-testimonial-quote-icon {
      width: 48px; height: 48px; color: var(--dc-accent); margin-bottom: 20px;
    }
    .dc-testimonial-text {
      font-size: clamp(1rem, 1.8vw, 1.25rem); font-weight: 500;
      color: var(--dc-dark); line-height: 1.7; font-style: italic;
      margin-bottom: 24px; max-width: 560px;
    }
    .dc-testimonial-author {
      display: flex; align-items: center; gap: 14px;
    }
    .dc-testimonial-avatar {
      width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
    }
    .dc-testimonial-name {
      font-size: 0.88rem; font-weight: 700; color: var(--dc-dark);
    }
    .dc-testimonial-role {
      font-size: 0.74rem; color: var(--dc-gray);
    }
    @media(max-width:768px){
      .dc-testimonial { flex-direction: column; gap: 36px; padding: 80px var(--dc-px); text-align: center; }
      .dc-testimonial-left { order: -1; }
      .dc-testimonial-left img { max-width: 260px; margin: 0 auto; display: block; }
    }

    /* ---- DC Team ---- */
    .dc-team {
      padding: 100px var(--dc-px); text-align: center;
    }
    .dc-team h2 {
      font-size: clamp(1.5rem, 2.8vw, 2.2rem); font-weight: 800;
      color: var(--dc-dark); line-height: 1.2; margin-bottom: 14px;
      letter-spacing: -0.01em; text-align: left;
    }
    .dc-team-header {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 48px;
    }
    .dc-team-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 28px; border-radius: 50px; font-size: 0.8rem;
      font-weight: 600; color: #fff; background: var(--dc-blue);
      text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    .dc-team-cta:hover {
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(30,58,110,0.25);
    }
    .dc-team-cta svg { width: 14px; height: 14px; }
    .dc-team-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px 40px;
    }
    .dc-doctor-card { text-align: center; }
    .dc-doctor-card img {
      width: 100%; aspect-ratio: 3/4; object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.06);
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
    }
    .dc-doctor-card:hover img {
      transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.10);
    }
    .dc-doctor-name {
      font-size: 0.92rem; font-weight: 700; color: var(--dc-dark);
      margin-top: 16px;
    }
    .dc-doctor-role {
      font-size: 0.76rem; color: var(--dc-gray); margin-top: 2px;
    }
    @media(max-width:640px){
      .dc-team { padding: 80px var(--dc-px); }
      .dc-team-grid { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
      .dc-team-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    }

    /* ---- DC Blog ---- */
    .dc-blog {
      padding: 100px var(--dc-px);
    }
    .dc-blog-header {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 48px;
    }
    .dc-blog h2 {
      font-size: clamp(1.5rem, 2.8vw, 2.2rem); font-weight: 800;
      color: var(--dc-dark); line-height: 1.2; letter-spacing: -0.01em;
    }
    .dc-blog-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 28px; border-radius: 50px; font-size: 0.8rem;
      font-weight: 600; color: #fff; background: #f97316;
      text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    .dc-blog-cta:hover {
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249,115,22,0.3);
    }
    .dc-blog-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px;
    }
    .dc-blog-card {
      border-radius: 16px; overflow: hidden; background: #fff;
      box-shadow: 0 4px 24px rgba(0,0,0,0.04);
      transition: transform 0.35s, box-shadow 0.35s;
    }
    .dc-blog-card:hover {
      transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08);
    }
    .dc-blog-card img {
      width: 100%; height: 200px; object-fit: cover;
    }
    .dc-blog-card-body { padding: 22px 24px; }
    .dc-blog-date {
      font-size: 0.7rem; color: var(--dc-gray); margin-bottom: 8px;
    }
    .dc-blog-card-body h3 {
      font-size: 1rem; font-weight: 700; color: var(--dc-dark);
      margin-bottom: 8px; line-height: 1.3;
    }
    .dc-blog-card-body p {
      font-size: 0.8rem; color: var(--dc-gray); line-height: 1.6; margin: 0;
    }
    @media(max-width:640px){
      .dc-blog { padding: 80px var(--dc-px); }
      .dc-blog-grid { grid-template-columns: 1fr; }
      .dc-blog-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    }

    /* ---- DC Footer ---- */
    .dc-footer {
      padding: 64px var(--dc-px) 28px; background: var(--dc-dark); color: #fff;
    }
    .dc-footer-grid {
      display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 40px;
      margin-bottom: 48px;
    }
    .dc-footer-logo {
      font-size: 1.2rem; font-weight: 800; color: #fff;
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    }
    .dc-footer-logo svg { width: 22px; height: 22px; }
    .dc-footer-tagline {
      font-size: 0.76rem; color: #9ca3af; line-height: 1.7;
      margin-bottom: 20px;
    }
    .dc-footer-contact { font-size: 0.78rem; color: #9ca3af; line-height: 1.8; }
    .dc-footer-contact a {
      color: var(--dc-accent); text-decoration: none;
    }
    .dc-footer-col h4 {
      font-size: 0.82rem; font-weight: 700; color: #fff; margin-bottom: 18px;
      letter-spacing: 0.02em;
    }
    .dc-footer-col a {
      display: block; font-size: 0.78rem; color: #9ca3af; margin-bottom: 11px;
      text-decoration: none; transition: color 0.2s;
    }
    .dc-footer-col a:hover { color: #fff; }
    .dc-footer-newsletter {
      display: flex; gap: 0; margin-top: 10px;
    }
    .dc-footer-newsletter input {
      flex: 1; padding: 10px 14px; border-radius: 8px 0 0 8px;
      border: 1px solid #374151; background: transparent; color: #fff;
      font-size: 0.78rem; font-family: inherit; outline: none;
    }
    .dc-footer-newsletter input::placeholder { color: #6b7280; }
    .dc-footer-newsletter button {
      padding: 10px 18px; border-radius: 0 8px 8px 0;
      background: var(--dc-accent); color: #fff; border: none;
      font-size: 0.76rem; font-weight: 600; cursor: pointer;
      transition: background 0.2s;
    }
    .dc-footer-newsletter button:hover { background: #3b5de7; }
    .dc-footer-social { display: flex; gap: 12px; margin-top: 16px; }
    .dc-footer-social a {
      width: 34px; height: 34px; border-radius: 50%;
      border: 1px solid #374151; display: flex;
      align-items: center; justify-content: center;
      color: #9ca3af; text-decoration: none;
      transition: border-color 0.2s, color 0.2s;
    }
    .dc-footer-social a:hover { border-color: #fff; color: #fff; }
    .dc-footer-social a svg { width: 14px; height: 14px; }
    .dc-footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08); padding-top: 22px;
      text-align: center; font-size: 0.72rem; color: #4b5563;
    }
    @media(max-width:768px){
      .dc-footer { padding: 48px var(--dc-px) 24px; }
      .dc-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    }
    @media(max-width:480px){
      .dc-footer-grid { grid-template-columns: 1fr; }
    }

    /* ================================================================
       TPL-011 — SUGARBOMB  Luxury Perfume
       ================================================================ */
    :root {
      --sb-dark: #1a1a1a;
      --sb-olive: #2d3a2e;
      --sb-green: #3e4f3a;
      --sb-cream: #faf7f2;
      --sb-muted: #8a8a7a;
      --sb-gold: #b39264;
      --sb-px: clamp(32px, 7vw, 140px);
    }

    /* ---- SB Navigation ---- */
    .sb-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px var(--sb-px);
      transition: background 0.35s, box-shadow 0.35s;
    }
    .sb-nav.sb-scrolled {
      background: rgba(26,26,26,0.95); backdrop-filter: blur(12px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
    .sb-nav-logo {
      font-family: 'Inter Tight', sans-serif; font-size: 1.4rem;
      font-weight: 800; color: #fff; text-decoration: none; letter-spacing: -0.02em;
    }
    .sb-nav-links { display: flex; gap: 32px; }
    .sb-nav-links a {
      color: rgba(255,255,255,0.75); text-decoration: none;
      font-size: 0.82rem; font-weight: 500; letter-spacing: 0.03em;
      transition: color 0.2s;
    }
    .sb-nav-links a:hover { color: #fff; }
    .sb-nav-right { display: flex; align-items: center; gap: 16px; }
    .sb-nav-cart {
      background: none; border: none; cursor: pointer; color: #fff;
      display: flex; align-items: center; padding: 4px;
    }
    .sb-nav-cart svg { width: 20px; height: 20px; }
    .sb-nav-cta {
      padding: 8px 24px; border-radius: 8px;
      background: var(--sb-olive); color: #fff;
      font-size: 0.78rem; font-weight: 600; border: none; cursor: pointer;
      transition: background 0.2s;
    }
    .sb-nav-cta:hover { background: var(--sb-green); }
    @media(max-width:768px){
      .sb-nav-links { display: none; }
    }

    /* ---- SB Hero ---- */
    .sb-hero {
      position: relative; min-height: 100vh; overflow: hidden;
      display: flex; align-items: center;
      background: var(--sb-dark); color: #fff;
    }
    .sb-hero-bg {
      position: absolute; inset: 0; z-index: 0;
    }
    .sb-hero-bg img {
      width: 100%; height: 100%; object-fit: cover;
      opacity: 0.45; filter: brightness(0.5);
    }
    .sb-hero-content {
      position: relative; z-index: 2; padding: 140px var(--sb-px) 100px;
      width: 100%; max-width: 100%; text-align: center;
      display: flex; flex-direction: column; align-items: center;
    }
    .sb-hero h1 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 800;
      line-height: 1.0; letter-spacing: -0.03em;
      white-space: pre-line; margin-bottom: 20px;
      color: #fff;
    }
    .sb-hero-sub {
      font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.65);
      max-width: 480px; margin-bottom: 32px; text-align: center;
    }
    .sb-hero-cta {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 32px; border-radius: 8px;
      background: var(--sb-olive); color: #fff;
      font-size: 0.84rem; font-weight: 600; text-decoration: none;
      transition: transform 0.2s, background 0.2s;
    }
    .sb-hero-cta:hover { transform: translateY(-2px); background: var(--sb-green); }
    .sb-hero-cta svg { width: 16px; height: 16px; }
    .sb-hero-featured {
      position: absolute; bottom: 40px; left: var(--sb-px); z-index: 3;
      display: flex; align-items: center; gap: 16px;
      background: rgba(255,255,255,0.07); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px; padding: 12px 18px;
    }
    .sb-hero-featured img {
      width: 52px; height: 68px; object-fit: cover; border-radius: 8px;
    }
    .sb-hero-feat-name { font-size: 0.78rem; font-weight: 600; color: #fff; }
    .sb-hero-feat-price { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 2px; }
    @media(max-width:768px){
      .sb-hero-content { padding: 120px 24px 80px; }
      .sb-hero-featured { left: 24px; bottom: 24px; }
    }

    /* ---- SB About ---- */
    .sb-about {
      padding: 100px var(--sb-px); background: #fff;
      display: flex; align-items: flex-start; gap: 120px;
    }
    .sb-about-badge {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.15em; color: var(--sb-muted);
      white-space: nowrap; padding-top: 6px;
    }
    .sb-about-text {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(1.15rem, 2vw, 1.5rem); font-weight: 400;
      color: #9a9a9a; line-height: 1.7; max-width: 600px;
    }
    .sb-about-text strong {
      font-weight: 700; color: var(--sb-dark);
    }
    @media(max-width:768px){
      .sb-about { flex-direction: column; gap: 24px; padding: 80px 24px; }
    }

    /* ---- SB Popular Products ---- */
    .sb-popular {
      padding: 80px var(--sb-px); background: #fff;
      display: flex; align-items: flex-end; gap: 48px;
    }
    .sb-popular-left {
      flex-shrink: 0; min-width: 200px;
      display: flex; flex-direction: column; justify-content: flex-end;
    }
    .sb-popular-left h2 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800;
      color: var(--sb-dark); line-height: 1.15; white-space: pre-line;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .sb-popular-desc {
      font-size: 0.8rem; color: var(--sb-muted); line-height: 1.6;
      margin-bottom: 28px; max-width: 200px;
    }
    .sb-popular-arrows { display: flex; gap: 8px; }
    .sb-popular-arrows button {
      width: 40px; height: 40px; border-radius: 50%;
      border: 1.5px solid #d4d4d4; background: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s, border-color 0.2s;
    }
    .sb-popular-arrows button.sb-arrow-active {
      background: var(--sb-olive); border-color: var(--sb-olive);
    }
    .sb-popular-arrows button.sb-arrow-active svg { stroke: #fff; }
    .sb-popular-arrows button:hover { background: var(--sb-dark); border-color: var(--sb-dark); }
    .sb-popular-arrows button:hover svg { stroke: #fff; }
    .sb-popular-arrows svg { width: 16px; height: 16px; stroke: var(--sb-dark); }
    .sb-popular-grid {
      display: flex; gap: 20px; flex: 1;
      align-items: flex-end;
    }
    .sb-popular-card {
      flex: 1; position: relative;
    }
    .sb-popular-card-img {
      width: 100%; height: 280px; border-radius: 16px;
      background: #f3f3ef; display: flex;
      align-items: center; justify-content: center; overflow: hidden;
      margin-bottom: 16px;
    }
    .sb-popular-card-img img {
      width: 55%; height: 75%; object-fit: contain;
    }
    .sb-popular-card-bottom {
      display: flex; align-items: center; justify-content: space-between;
    }
    .sb-popular-card-name {
      font-size: 0.84rem; font-weight: 700; color: var(--sb-dark);
    }
    .sb-popular-card-add {
      width: 32px; height: 32px; border-radius: 50%;
      border: 1.5px solid #d4d4d4; background: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }
    .sb-popular-card-add:hover {
      background: var(--sb-olive); border-color: var(--sb-olive);
    }
    .sb-popular-card-add:hover svg { stroke: #fff; }
    .sb-popular-card-add svg { width: 14px; height: 14px; stroke: var(--sb-dark); stroke-width: 2; }
    /* Decorative arrows between cards */
    .sb-popular-between {
      display: flex; flex-direction: column; gap: 8px;
      align-items: center; margin-bottom: 160px;
      flex-shrink: 0;
    }
    .sb-popular-between-btn {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid #e0e0dc; background: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .sb-popular-between-btn svg { width: 14px; height: 14px; stroke: #b0b0a8; stroke-width: 2; }
    @media(max-width:768px){
      .sb-popular { flex-direction: column; gap: 24px; padding: 60px 24px; }
      .sb-popular-grid { flex-direction: column; }
      .sb-popular-card-img { height: 240px; }
      .sb-popular-between { display: none; }
    }

    /* ---- SB Featured Banner ---- */
    .sb-banner {
      position: relative; padding: 100px var(--sb-px);
      background: var(--sb-olive); color: #fff; overflow: hidden;
      min-height: 400px; display: flex; align-items: center;
    }
    .sb-banner-bg {
      position: absolute; inset: 0; z-index: 0; opacity: 0.15;
    }
    .sb-banner-bg img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .sb-banner-text {
      position: relative; z-index: 2;
    }
    .sb-banner-text span {
      display: block; font-family: 'Inter Tight', sans-serif;
      font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 800;
      line-height: 1.1; letter-spacing: -0.03em;
    }
    .sb-banner-products {
      position: absolute; right: var(--sb-px); top: 50%;
      transform: translateY(-50%); z-index: 3;
      display: flex; gap: 16px; align-items: center;
    }
    .sb-banner-products img {
      width: 140px; height: 200px; object-fit: contain;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.25));
    }
    .sb-banner-dots {
      position: absolute; bottom: 24px; left: var(--sb-px); z-index: 4;
      display: flex; gap: 8px;
    }
    .sb-banner-dots span {
      width: 28px; height: 4px; border-radius: 2px;
      background: rgba(255,255,255,0.3);
    }
    .sb-banner-dots span.active { background: #fff; width: 40px; }
    @media(max-width:768px){
      .sb-banner { min-height: 300px; padding: 60px 24px; }
      .sb-banner-products { position: static; transform: none; margin-top: 32px; }
      .sb-banner { flex-direction: column; align-items: flex-start; }
    }

    /* ---- SB Categories ---- */
    .sb-categories {
      padding: 100px var(--sb-px); background: #fff;
      display: flex; align-items: flex-start; gap: 48px;
    }
    .sb-categories-image {
      flex: 0.5; border-radius: 16px; overflow: hidden;
    }
    .sb-categories-image img {
      width: 100%; height: 380px; object-fit: cover; display: block;
    }
    .sb-categories-content { flex: 1; }
    .sb-categories-badge {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: var(--sb-muted); margin-bottom: 28px;
    }
    .sb-categories-list { margin-bottom: 32px; }
    .sb-cat-item {
      font-family: 'Inter Tight', sans-serif;
      font-size: 1.4rem; font-weight: 400; color: #c4c4c4;
      padding: 6px 0; cursor: pointer; transition: color 0.2s, font-weight 0.2s;
    }
    .sb-cat-item.sb-cat-active {
      font-size: 1.8rem; font-weight: 700; color: var(--sb-dark);
    }
    .sb-cat-detail { display: flex; gap: 32px; align-items: flex-start; }
    .sb-cat-detail-title {
      font-size: 1rem; font-weight: 700; color: var(--sb-dark); margin-bottom: 8px;
    }
    .sb-cat-detail-desc {
      font-size: 0.82rem; color: var(--sb-muted); line-height: 1.7;
      margin-bottom: 18px;
    }
    .sb-cat-cta {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 0.8rem; font-weight: 600; color: var(--sb-dark);
      text-decoration: none; border-bottom: 1.5px solid var(--sb-dark);
      padding-bottom: 2px; transition: opacity 0.2s;
    }
    .sb-cat-cta:hover { opacity: 0.7; }
    .sb-cat-detail-img {
      width: 64px; height: 64px; border-radius: 12px; overflow: hidden;
      flex-shrink: 0;
    }
    .sb-cat-detail-img img { width: 100%; height: 100%; object-fit: cover; }
    @media(max-width:768px){
      .sb-categories { flex-direction: column; gap: 32px; padding: 60px 24px; }
      .sb-categories-image img { height: 260px; }
    }

    /* ---- SB Collections ---- */
    .sb-collections {
      padding: 80px var(--sb-px); background: #fff;
    }
    .sb-collections h2 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(1.3rem, 2.5vw, 1.8rem); font-weight: 600;
      color: var(--sb-dark); text-align: center; margin-bottom: 48px;
      letter-spacing: -0.02em;
    }
    .sb-collections-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      margin-bottom: 40px;
    }
    .sb-col-card {
      border: 1px solid #e8e8e4; border-radius: 16px;
      overflow: hidden; transition: box-shadow 0.3s;
    }
    .sb-col-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
    .sb-col-card-price {
      padding: 16px 20px 0; font-size: 0.78rem; font-weight: 600;
      color: var(--sb-dark);
    }
    .sb-col-card-img {
      height: 220px; display: flex; align-items: center;
      justify-content: center; padding: 20px;
    }
    .sb-col-card-img img {
      max-height: 100%; max-width: 100%; object-fit: contain;
    }
    .sb-col-card-img.sb-landscape img { object-fit: cover; width: 100%; height: 100%; border-radius: 8px; }
    .sb-col-card-name {
      font-size: 0.82rem; font-weight: 600; color: var(--sb-dark);
      padding: 0 20px;
    }
    .sb-col-card-buy {
      display: block; margin: 12px 20px 20px; padding: 10px;
      text-align: center; border: 1.5px solid #e0e0dc;
      border-radius: 8px; font-size: 0.78rem; font-weight: 600;
      color: var(--sb-dark); text-decoration: none; cursor: pointer; background: none;
      transition: background 0.2s, color 0.2s;
    }
    .sb-col-card-buy:hover { background: var(--sb-dark); color: #fff; }
    .sb-col-card.sb-featured { background: var(--sb-cream); }
    .sb-col-card.sb-featured .sb-col-card-buy {
      background: var(--sb-olive); color: #fff; border-color: var(--sb-olive);
    }
    .sb-collections-cta {
      display: flex; justify-content: center;
    }
    .sb-collections-cta a {
      padding: 12px 32px; border-radius: 8px; border: 1.5px solid var(--sb-dark);
      font-size: 0.8rem; font-weight: 600; color: var(--sb-dark);
      text-decoration: none; transition: background 0.2s, color 0.2s;
    }
    .sb-collections-cta a:hover { background: var(--sb-dark); color: #fff; }
    @media(max-width:768px){
      .sb-collections { padding: 60px 24px; }
      .sb-collections-grid { grid-template-columns: 1fr; }
    }

    /* ---- SB Story (Video) ---- */
    .sb-story {
      position: relative; height: 70vh; min-height: 400px;
      display: flex; align-items: center; justify-content: center;
      background: var(--sb-dark); overflow: hidden;
    }
    .sb-story-bg {
      position: absolute; inset: 0; z-index: 0;
    }
    .sb-story-bg img {
      width: 100%; height: 100%; object-fit: cover;
      opacity: 0.4; filter: grayscale(30%) brightness(0.6);
    }
    .sb-story-inner {
      position: relative; z-index: 2; text-align: center; color: #fff;
    }
    .sb-story-play {
      width: 72px; height: 72px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.5); background: rgba(255,255,255,0.08);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 28px; cursor: pointer;
      transition: transform 0.3s, background 0.3s;
    }
    .sb-story-play:hover { transform: scale(1.08); background: rgba(255,255,255,0.15); }
    .sb-story-play svg { width: 24px; height: 24px; fill: #fff; }
    .sb-story h2 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(2rem, 4vw, 3.4rem); font-weight: 700;
      letter-spacing: -0.02em;
    }

    /* ---- SB Testimonials ---- */
    .sb-testimonials {
      padding: 100px var(--sb-px); position: relative;
      background: var(--sb-cream); overflow: hidden;
    }
    .sb-testimonials-header {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 56px;
    }
    .sb-testimonials-header h2 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(2.2rem, 5vw, 4.5rem); font-weight: 800;
      color: var(--sb-dark); line-height: 1.05; white-space: pre-line;
      letter-spacing: -0.03em;
    }
    .sb-test-badge {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: var(--sb-muted); margin-bottom: 16px;
    }
    .sb-testimonials-cards {
      display: flex; gap: 20px; flex-wrap: wrap;
      justify-content: center;
    }
    .sb-test-card {
      background: #fff; border-radius: 16px; padding: 24px;
      max-width: 320px; flex: 1; min-width: 260px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      transition: transform 0.3s;
    }
    .sb-test-card:hover { transform: translateY(-4px); }
    .sb-test-stars { display: flex; gap: 3px; margin-bottom: 12px; }
    .sb-test-stars svg { width: 14px; height: 14px; }
    .sb-test-text {
      font-size: 0.84rem; color: var(--sb-dark); line-height: 1.7;
      margin-bottom: 18px;
    }
    .sb-test-meta { display: flex; align-items: center; gap: 12px; }
    .sb-test-avatar {
      width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
    }
    .sb-test-author {
      font-size: 0.78rem; font-weight: 700; color: var(--sb-dark);
    }
    .sb-test-date {
      font-size: 0.68rem; color: var(--sb-muted);
    }
    @media(max-width:768px){
      .sb-testimonials { padding: 60px 24px; }
      .sb-testimonials-cards { flex-direction: column; }
      .sb-test-card { max-width: 100%; }
    }

    /* ---- SB Newsletter ---- */
    .sb-newsletter {
      display: flex; background: var(--sb-dark); color: #fff;
      min-height: 440px; overflow: hidden;
    }
    .sb-newsletter-img { flex: 0.5; position: relative; }
    .sb-newsletter-img img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .sb-newsletter-content {
      flex: 1; display: flex; flex-direction: column;
      justify-content: center; padding: 60px var(--sb-px);
    }
    .sb-newsletter-content h2 {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700;
      line-height: 1.15; white-space: pre-line; margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    .sb-newsletter-sub {
      font-size: 0.8rem; color: rgba(255,255,255,0.55);
      line-height: 1.7; margin-bottom: 28px; max-width: 400px;
    }
    .sb-newsletter-form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
    .sb-newsletter-input {
      padding: 14px 18px; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; background: rgba(255,255,255,0.05);
      color: #fff; font-size: 0.84rem; font-family: inherit; outline: none;
    }
    .sb-newsletter-input::placeholder { color: rgba(255,255,255,0.35); }
    .sb-newsletter-input:focus { border-color: rgba(255,255,255,0.4); }
    .sb-newsletter-btn {
      padding: 14px; border-radius: 8px;
      background: var(--sb-olive); color: #fff; border: none;
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      font-family: inherit; transition: background 0.2s;
    }
    .sb-newsletter-btn:hover { background: var(--sb-green); }
    @media(max-width:768px){
      .sb-newsletter { flex-direction: column; }
      .sb-newsletter-img { height: 260px; }
      .sb-newsletter-content { padding: 40px 24px; }
    }

    /* ---- SB Footer ---- */
    .sb-footer {
      background: var(--sb-dark); color: #fff;
      padding: 60px var(--sb-px) 40px;
    }
    .sb-footer-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 48px; margin-bottom: 56px;
    }
    .sb-footer-col {}
    .sb-footer-col a {
      display: block; font-size: 0.82rem; color: rgba(255,255,255,0.6);
      text-decoration: none; margin-bottom: 10px; transition: color 0.2s;
    }
    .sb-footer-col a:hover { color: #fff; }
    .sb-footer-tagline {
      font-size: 0.78rem; color: rgba(255,255,255,0.35);
      max-width: 300px; line-height: 1.6;
    }
    .sb-footer-brand {
      font-family: 'Inter Tight', sans-serif;
      font-size: clamp(4rem, 10vw, 8rem); font-weight: 800;
      color: #fff; letter-spacing: -0.04em; line-height: 1;
      margin-bottom: 16px;
    }
    .sb-footer-copy {
      font-size: 0.7rem; color: rgba(255,255,255,0.25);
    }
    @media(max-width:768px){
      .sb-footer { padding: 48px 24px 32px; }
      .sb-footer-top { flex-direction: column; gap: 28px; }
      .sb-footer-brand { font-size: clamp(3rem, 12vw, 5rem); }
    }

    /* SB Animations */
    .sb-fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .sb-fade-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .sb-fade-right { opacity: 0; transform: translateX(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .sb-visible { opacity: 1 !important; transform: none !important; }
  </style>
</head>
<body>
  <!-- Designer Toolbar -->
  <div class="back-bar">
    <a href="/templates">&larr; Back to Gallery</a>
    <span class="template-name">${escapeHTML(name)}</span>
    <span style="opacity:0.5;font-size:0.8rem">Template Preview &mdash; Full Page</span>
  </div>

${sectionsHTML}

  <script>
    // ===== Hero Slider =====
    (function() {
      var slides = document.querySelectorAll('.hero-slide');
      var dots = document.querySelectorAll('.hero-dot');
      if (slides.length < 2) return;

      var current = 0;
      var total = slides.length;
      var interval = 6000;
      var timer = null;
      var isTransitioning = false;

      function goTo(index) {
        if (isTransitioning || index === current) return;
        isTransitioning = true;
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        setTimeout(function() { isTransitioning = false; }, 900);
      }

      function startAuto() {
        stopAuto();
        timer = setInterval(function() { goTo(current + 1); }, interval);
      }

      function stopAuto() {
        if (timer) { clearInterval(timer); timer = null; }
      }

      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          var idx = parseInt(this.getAttribute('data-slide'));
          goTo(idx);
          stopAuto();
          startAuto();
        });
      });

      startAuto();
    })();

    // FAQ accordion toggle
    document.querySelectorAll('.faq-question').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = this.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        // Optionally close others:
        // item.parentElement.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open')});
        if (wasOpen) { item.classList.remove('open'); } else { item.classList.add('open'); }
      });
    });

    // Intersection Observer for scroll animations
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(function(el) {
      observer.observe(el);
    });

    /* Real Estate template: scroll-triggered fade-up animations */
    var reObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.re-fade-up').forEach(function(el) {
      reObserver.observe(el);
    });

    /* Real Estate nav: scroll background change */
    (function() {
      var reNav = document.querySelector('.re-nav');
      if (!reNav) return;
      window.addEventListener('scroll', function() {
        if (window.scrollY > 80) {
          reNav.classList.add('scrolled');
        } else {
          reNav.classList.remove('scrolled');
        }
      });
    })();

    /* Real Estate: filter tabs interactivity */
    document.querySelectorAll('.re-search-filter, .re-filter-btn, .re-plan-tab, .re-insights-cat').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var siblings = btn.parentElement.children;
        for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('active');
        btn.classList.add('active');
      });
    });

    /* Real Estate: Project detail popup */
    (function() {
      var backdrop = document.getElementById('reProjModal');
      if (!backdrop) return;
      var dataEl = document.getElementById('reProjData');
      if (!dataEl) return;
      var projects = JSON.parse(dataEl.textContent);
      var arrows = document.querySelectorAll('.re-project-arrow');
      var closeBtn = backdrop.querySelector('.re-proj-modal-close');

      function openModal(idx) {
        var proj = projects[idx];
        if (!proj) return;
        document.getElementById('reProjModalImg').src = proj.image;
        document.getElementById('reProjModalImg').alt = proj.title;
        document.getElementById('reProjModalLoc').textContent = proj.location;
        document.getElementById('reProjModalTitle').textContent = proj.title;
        document.getElementById('reProjModalPrice').textContent = proj.price;
        document.getElementById('reProjModalDesc').textContent = proj.description;
        document.getElementById('reProjModalBeds').textContent = proj.beds;
        document.getElementById('reProjModalBaths').textContent = proj.baths;
        document.getElementById('reProjModalSqft').textContent = proj.sqft;
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      function closeModal() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }

      arrows.forEach(function(arrow) {
        arrow.addEventListener('click', function(e) {
          e.stopPropagation();
          var idx = parseInt(this.getAttribute('data-proj-idx'), 10);
          openModal(idx);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      backdrop.addEventListener('click', function(e) {
        if (e.target === backdrop) closeModal();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
      });
    })();

    /* Real Estate: Leadership photo stack */
    (function() {
      var photos = document.querySelectorAll('.re-lead-photo');
      var infoSlides = document.querySelectorAll('.re-lead-info-slide');
      var pagination = document.querySelector('.re-lead-current');
      var arrow = document.querySelector('.re-lead-arrow');
      if (!photos.length) return;

      var positions = ['front', 'back-right', 'back-left'];
      // Track which member is at which position: order[posIdx] = memberIdx
      // Initially: front=0, back-right=1, back-left=2
      var order = [];
      for (var i = 0; i < photos.length; i++) order.push(i);

      function setActive(memberIdx) {
        // Find current position of the clicked member
        var clickedPosIdx = order.indexOf(memberIdx);
        if (clickedPosIdx === 0) return; // Already in front

        // Rotate order so clickedMember is at front
        // Shift array: move clicked to front, shift others
        var newOrder = [memberIdx];
        for (var j = 0; j < order.length; j++) {
          if (order[j] !== memberIdx) newOrder.push(order[j]);
        }
        order = newOrder;

        // Apply new positions
        for (var k = 0; k < order.length; k++) {
          photos[order[k]].setAttribute('data-pos', positions[k]);
        }

        // Update info slides
        for (var m = 0; m < infoSlides.length; m++) {
          infoSlides[m].classList.remove('active');
        }
        infoSlides[memberIdx].classList.add('active');

        // Update pagination
        if (pagination) pagination.textContent = String(memberIdx + 1);
      }

      // Click on photo to bring to front
      photos.forEach(function(photo) {
        photo.addEventListener('click', function() {
          var memberIdx = parseInt(this.getAttribute('data-member'), 10);
          setActive(memberIdx);
        });
      });

      // Arrow cycles to next member
      if (arrow) {
        arrow.addEventListener('click', function() {
          var currentFront = order[0];
          var nextIdx = (currentFront + 1) % photos.length;
          setActive(nextIdx);
        });
      }
    })();

    /* Real Estate: Testimonials carousel */
    (function() {
      var slides = document.querySelectorAll('.re-testi-slide');
      var btns = document.querySelectorAll('.re-testi-nav-btn');
      if (!slides.length) return;
      var idx = 0;
      var total = slides.length;

      function goTo(n) {
        slides[idx].classList.remove('active');
        idx = ((n % total) + total) % total;
        slides[idx].classList.add('active');
      }

      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var dir = this.getAttribute('data-dir');
          goTo(dir === 'next' ? idx + 1 : idx - 1);
        });
      });
    })();

    /* ---- Smartwatch Animations & Interactions ---- */
    (function(){
      /* Scroll-reveal for .sw-fade-up / .sw-fade-left / .sw-fade-right */
      var swEls = document.querySelectorAll('.sw-fade-up,.sw-fade-left,.sw-fade-right');
      if (swEls.length) {
        var io = new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if (e.isIntersecting) {
              e.target.classList.add('sw-visible');
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.15 });
        swEls.forEach(function(el){ io.observe(el); });
      }
      /* Sticky nav shadow */
      var swNav = document.querySelector('.sw-nav');
      if (swNav) {
        window.addEventListener('scroll', function(){
          swNav.classList.toggle('sw-scrolled', window.scrollY > 20);
        }, { passive: true });
      }

      /* ---- Product Carousel ---- */
      (function(){
        var track = document.querySelector('.sw-products-track');
        var cards = document.querySelectorAll('.sw-product-card');
        var dots = document.querySelectorAll('.sw-products-dot');
        var prevBtn = document.querySelector('[data-dir="prev"]');
        var nextBtn = document.querySelector('[data-dir="next"]');
        if (!track || cards.length < 1) return;

        var current = 1; // start centered on 2nd card
        var total = cards.length;

        function update() {
          /* Calculate card width + gap from the actual DOM */
          var card = cards[0];
          var gap = 24;
          var cardW = card.offsetWidth + gap;
          /* Center the active card: offset = current * cardW - (container width - cardW) / 2 */
          var wrap = track.parentElement;
          var wrapW = wrap.offsetWidth;
          var offset = current * cardW - (wrapW - card.offsetWidth) / 2;
          track.style.transform = 'translateX(' + (-offset) + 'px)';

          cards.forEach(function(c, i) {
            c.classList.remove('sw-card-active', 'sw-card-side');
            if (i === current) c.classList.add('sw-card-active');
            else if (i === current - 1 || i === current + 1) c.classList.add('sw-card-side');
          });
          dots.forEach(function(d, i) {
            d.classList.toggle('sw-dot-active', i === current);
          });
        }

        function go(dir) {
          current = (current + dir + total) % total;
          update();
        }

        if (prevBtn) prevBtn.addEventListener('click', function() { go(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function() { go(1); });
        dots.forEach(function(d, i) {
          d.addEventListener('click', function() { current = i; update(); });
        });

        /* Initial state */
        update();
        /* Recalculate on resize */
        window.addEventListener('resize', function() { update(); }, { passive: true });
      })();
    })();

    /* ---- Dental Clinic Animations & Interactions ---- */
    (function(){
      /* Scroll-reveal for .dc-fade-up / .dc-fade-left / .dc-fade-right */
      var dcEls = document.querySelectorAll('.dc-fade-up,.dc-fade-left,.dc-fade-right');
      if (dcEls.length) {
        var dcObs = new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if (e.isIntersecting) {
              e.target.classList.add('dc-visible');
              dcObs.unobserve(e.target);
            }
          });
        }, { threshold: 0.12 });
        dcEls.forEach(function(el){ dcObs.observe(el); });
      }
      /* Sticky nav shadow */
      var dcNav = document.querySelector('.dc-nav');
      if (dcNav) {
        window.addEventListener('scroll', function(){
          dcNav.classList.toggle('dc-scrolled', window.scrollY > 20);
        }, { passive: true });
      }
    })();
  </script>
</body>
</html>`;
}

// ========================
// Section renderers
// ========================

function renderHero(p: Record<string, any>, primaryColor: string): string {
  // If slides array exists, render slider hero
  if (p.slides && p.slides.length > 1) {
    return renderHeroSlider(p, primaryColor);
  }

  const bgColor = p.bgColor || '#f9fafb';
  const isDark = isDarkColor(bgColor);
  const headlineColor = p.headlineColor || (isDark ? '#ffffff' : '#1a202c');
  const subColor = p.subheadlineColor || (isDark ? '#cbd5e1' : '#64748b');
  const btnBg = p.buttonBgColor || primaryColor;
  const btnText = p.buttonTextColor || '#fff';
  const heroImage = p.bgImage || '';
  const secondaryCtaText = p.secondaryCtaText || '';
  const secondaryCtaUrl = p.secondaryCtaUrl || '#';

  const bgStyle = heroImage
    ? `background:linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)),url('${escapeAttr(heroImage)}') center/cover no-repeat;min-height:85vh;display:flex;align-items:center;`
    : `background:${bgColor};`;

  return `
  <!-- HERO SECTION -->
  <section class="section-lg" style="${bgStyle}">
    <div class="container" style="${p.textAlign === 'left' ? '' : 'text-align:center;'}">
      <div data-animate class="delay-1">
        <h1 class="heading-xl" style="color:${headlineColor};margin-bottom:20px;${p.headlineFontSize ? 'font-size:' + p.headlineFontSize + ';' : ''}">
          ${escapeHTML(p.headline || 'Welcome')}
        </h1>
      </div>
      <div data-animate class="delay-2">
        <p class="subtitle" style="color:${subColor};margin-bottom:36px;${p.textAlign === 'left' ? 'margin-left:0;' : ''}">
          ${escapeHTML(p.subheadline || '')}
        </p>
      </div>
      <div data-animate class="delay-3" style="display:flex;gap:16px;${p.textAlign === 'left' ? '' : 'justify-content:center;'}flex-wrap:wrap;">
        <a href="${escapeAttr(p.ctaUrl || '#')}" class="btn btn-lg" style="background:${btnBg};color:${btnText};border:2px solid ${btnBg};border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;">
          ${escapeHTML(p.ctaText || 'Get Started')}
        </a>
        ${secondaryCtaText ? `<a href="${escapeAttr(secondaryCtaUrl)}" class="btn btn-lg btn-outline" style="border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;border-color:${primaryColor};color:${primaryColor};">${escapeHTML(secondaryCtaText)}</a>` : ''}
      </div>
    </div>
  </section>`;
}

function renderHeroSlider(
  p: Record<string, any>,
  primaryColor: string
): string {
  const slides = p.slides as any[];
  const textAlign = p.textAlign || 'left';
  const alignCSS = textAlign === 'left' ? '' : 'text-align:center;';
  const btnJustify = textAlign === 'left' ? '' : 'justify-content:center;';

  const slidesHTML = slides
    .map((s: any, i: number) => {
      const bgImg = s.bgImage || '';
      const headlineColor = s.headlineColor || '#ffffff';
      const subColor = s.subheadlineColor || '#aaa';
      const btnBg = s.buttonBgColor || 'transparent';
      const btnText = s.buttonTextColor || '#fff';
      const secondaryCta = s.secondaryCtaText || '';
      const secondaryUrl = s.secondaryCtaUrl || '#';

      return `<div class="hero-slide${i === 0 ? ' active' : ''}" style="background:linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('${escapeAttr(bgImg)}') center/cover no-repeat;">
      <div class="container" style="${alignCSS}">
        <h1 class="hero-slide-headline" style="color:${headlineColor};${s.headlineFontSize ? 'font-size:' + s.headlineFontSize + ';' : ''}">
          ${escapeHTML(s.headline || '')}
        </h1>
        <p class="hero-slide-sub" style="color:${subColor};${textAlign === 'left' ? 'margin-left:0;' : ''}">
          ${escapeHTML(s.subheadline || '')}
        </p>
        <div class="hero-slide-btns" style="${btnJustify}">
          <a href="${escapeAttr(s.ctaUrl || '#')}" class="btn btn-lg" style="background:${btnBg};color:${btnText};border:2px solid ${btnBg === 'transparent' ? primaryColor : btnBg};border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;">
            ${escapeHTML(s.ctaText || 'Learn More')}
          </a>
          ${secondaryCta ? `<a href="${escapeAttr(secondaryUrl)}" class="btn btn-lg btn-outline" style="border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;border-color:${primaryColor};color:${primaryColor};">${escapeHTML(secondaryCta)}</a>` : ''}
        </div>
      </div>
    </div>`;
    })
    .join('\n');

  const dotsHTML = slides
    .map(
      (_: any, i: number) =>
        `<button class="hero-dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
    )
    .join('');

  return `
  <!-- HERO SLIDER -->
  <section class="hero-slider" id="hero">
    <div class="hero-slides-wrapper">
      ${slidesHTML}
    </div>
    <div class="hero-dots">
      ${dotsHTML}
    </div>
  </section>`;
}

function renderNavigation(p: Record<string, any>): string {
  const dark = isDarkColor(p.bgColor || '#fff');
  const linkColor = p.linkColor || (dark ? '#ccc' : '#555');
  const menuItems = (p.menuItems || []).filter((m: any) => !m.isCta);
  const ctaItem = (p.menuItems || []).find((m: any) => m.isCta);

  const items = menuItems
    .map(
      (m: any) =>
        `<a href="${escapeAttr(m.url || '#')}" style="color:${linkColor};font-weight:500;font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;transition:color 0.2s;">${escapeHTML(m.label || '')}</a>`
    )
    .join('');

  const ctaBtn = ctaItem
    ? `<a href="${escapeAttr(ctaItem.url || '#')}" style="color:${linkColor};font-weight:500;font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;transition:color 0.2s;">${escapeHTML(ctaItem.label || '')}</a>`
    : '';

  const logoHTML = p.logoIcon
    ? `<div style="display:flex;align-items:center;gap:8px;"><div style="width:36px;height:36px;">${p.logoIcon}</div></div>`
    : `<span style="font-weight:700;font-size:1.25rem;color:${p.textColor || '#1a202c'};letter-spacing:0.1em;">${escapeHTML(p.logoText || 'Brand')}</span>`;

  return `
  <!-- NAVIGATION -->
  <nav style="background:${p.bgColor || '#fff'};padding:16px 0;border-bottom:1px solid ${dark ? '#222' : '#e2e8f0'};${p.isSticky ? 'position:sticky;top:44px;z-index:100;' : ''}">
    <div class="container flex items-center justify-between">
      ${logoHTML}
      <div class="flex gap-24 items-center">${items}${ctaBtn}</div>
    </div>
  </nav>`;
}

function renderFeatures(p: Record<string, any>, primaryColor: string): string {
  const features = p.features || [];
  const colClass = features.length <= 3 ? 'grid-3' : 'grid-4';
  const dark = isDarkColor(p.bgColor || '#ffffff');
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const textColor = dark ? '#a0a0a0' : '#64748b';
  const cardBg = dark ? '#1a1a1a' : '#fff';
  const cardBorder = dark ? '#2a2a2a' : '#e2e8f0';

  const cards = features
    .map(
      (f: any, i: number) =>
        `<div class="card" data-animate style="background:${cardBg};border-color:${cardBorder};">
        <div class="card-icon">${getIconSVG(f.icon, primaryColor)}</div>
        <h3 class="heading-md" style="margin-bottom:10px;color:${titleColor};">${escapeHTML(f.title || '')}</h3>
        <p class="text-md" style="color:${textColor};">${escapeHTML(f.description || '')}</p>
      </div>`
    )
    .join('\n');

  return `
  <!-- FEATURES SECTION -->
  <section class="section" style="background:${p.bgColor || '#ffffff'};" id="services">
    <div class="container">
      <div class="text-center" style="margin-bottom:56px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Features')}</h2>
      </div>
      <div class="${colClass}">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderTestimonials(
  p: Record<string, any>,
  primaryColor: string
): string {
  const testimonials = p.testimonials || [];
  const bgColor = p.bgColor || '#f8fafc';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const quoteColor = dark ? '#cbd5e1' : '#334155';
  const nameColor = dark ? '#ffffff' : '#1a202c';
  const roleColor = dark ? '#a0a0a0' : '#64748b';
  const cardBg = dark ? '#1a1a1a' : '#fff';
  const cardBorder = dark ? '#2a2a2a' : '#e2e8f0';

  const cards = testimonials
    .map((t: any) => {
      const initials = (t.name || 'U')
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      const stars = '★'.repeat(Math.min(t.rating || 5, 5));

      const avatarEl = t.avatar
        ? `<img class="testimonial-avatar" src="${escapeAttr(t.avatar)}" alt="${escapeAttr(t.name || '')}" style="object-fit:cover;" />`
        : `<div class="testimonial-avatar">${initials}</div>`;

      return `<div class="testimonial-card" data-animate style="background:${cardBg};border-color:${cardBorder};">
        <div class="stars" style="margin-bottom:16px;">${stars}</div>
        <p class="text-md" style="color:${quoteColor};margin-bottom:24px;position:relative;z-index:1;">
          "${escapeHTML(t.quote || '')}"
        </p>
        <div class="flex items-center gap-16">
          ${avatarEl}
          <div>
            <p style="font-weight:600;color:${nameColor};">${escapeHTML(t.name || '')}</p>
            <p class="text-sm" style="color:${roleColor};">${escapeHTML(t.role || '')}</p>
          </div>
        </div>
      </div>`;
    })
    .join('\n');

  const colClass = testimonials.length <= 2 ? 'grid-2' : 'grid-3';

  return `
  <!-- TESTIMONIALS SECTION -->
  <section class="section" style="background:${bgColor};">
    <div class="container">
      <div style="margin-bottom:56px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Testimonials')}</h2>
        ${p.subtitle ? `<p style="color:${roleColor};font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;margin-top:8px;">${escapeHTML(p.subtitle)}</p>` : ''}
      </div>
      <div class="${colClass}">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderFAQ(p: Record<string, any>, primaryColor: string): string {
  const questions = p.questions || [];
  const dark = isDarkColor(p.bgColor || '#ffffff');
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const qColor = dark ? '#e2e8f0' : '#1a202c';
  const aColor = dark ? '#a0a0a0' : '#64748b';
  const borderColor = dark ? '#2a2a2a' : '#e2e8f0';

  const items = questions
    .map(
      (q: any, i: number) =>
        `<div class="faq-item${i === 0 ? ' open' : ''}" style="border-color:${borderColor};">
        <button class="faq-question" style="color:${qColor};">
          <span>${escapeHTML(q.question || '')}</span>
          <span class="faq-chevron">&#9662;</span>
        </button>
        <div class="faq-answer" style="color:${aColor};${i === 0 ? 'max-height:400px;padding-bottom:20px;' : ''}">
          ${escapeHTML(q.answer || '')}
        </div>
      </div>`
    )
    .join('\n');

  return `
  <!-- FAQ SECTION -->
  <section class="section" style="background:${p.bgColor || '#ffffff'};">
    <div class="container-sm">
      <div class="text-center" style="margin-bottom:48px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'FAQ')}</h2>
      </div>
      ${items}
    </div>
  </section>`;
}

function renderCTA(p: Record<string, any>, primaryColor: string): string {
  const bg = p.bgGradient || p.bgColor || primaryColor;
  const isGradient = bg.includes('gradient');

  return `
  <!-- CTA SECTION -->
  <section class="section-lg" style="background:${bg};color:#fff;">
    <div class="container text-center" data-animate>
      <h2 class="heading-lg" style="color:#fff;margin-bottom:16px;">${escapeHTML(p.headline || '')}</h2>
      <p class="subtitle" style="color:rgba(255,255,255,0.85);margin-bottom:36px;">${escapeHTML(p.description || '')}</p>
      <a href="${escapeAttr(p.buttonUrl || '#')}" class="btn btn-lg btn-white">${escapeHTML(p.buttonText || 'Get Started')}</a>
    </div>
  </section>`;
}

function renderPricing(p: Record<string, any>, primaryColor: string): string {
  const plans = p.plans || [];
  const dark = isDarkColor(p.bgColor || '#f8fafc');
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const subtitleColor = dark ? '#a0a0a0' : '#64748b';
  const cardBg = dark ? '#1a1a1a' : '#fff';
  const cardBorder = dark ? '#2a2a2a' : '#e2e8f0';
  const nameColor = dark ? '#ffffff' : '#1a202c';
  const descColor = dark ? '#a0a0a0' : '#64748b';
  const featureBorder = dark ? '#222222' : '#f1f5f9';

  const cards = plans
    .map((plan: any) => {
      const highlighted = plan.highlighted;
      const featuresList = (plan.features || [])
        .map(
          (f: any) =>
            `<li style="padding:8px 0;border-bottom:1px solid ${featureBorder};display:flex;align-items:center;gap:8px;color:${descColor};">
        <span style="color:${primaryColor};font-weight:700;">&#10003;</span>
        ${escapeHTML(typeof f === 'string' ? f : f.text || f.name || '')}
      </li>`
        )
        .join('');

      return `<div class="card" style="background:${cardBg};border-color:${highlighted ? primaryColor : cardBorder};${highlighted ? `box-shadow:0 12px 40px ${primaryColor}20;` : ''}" data-animate>
        ${highlighted ? `<div class="badge" style="background:${primaryColor}15;color:${primaryColor};margin-bottom:16px;">Most Popular</div>` : ''}
        <h3 class="heading-md" style="margin-bottom:8px;color:${nameColor};">${escapeHTML(plan.name || '')}</h3>
        <p style="font-size:2.5rem;font-weight:800;color:${primaryColor};margin:16px 0;">
          ${escapeHTML(plan.currency || '$')}${escapeHTML(String(plan.price || '0'))}
          <span class="text-sm" style="font-weight:400;color:${descColor};">/${escapeHTML(plan.period || 'mo')}</span>
        </p>
        <p style="margin-bottom:24px;color:${descColor};">${escapeHTML(plan.description || '')}</p>
        ${featuresList ? `<ul style="list-style:none;margin-bottom:28px;">${featuresList}</ul>` : ''}
        <a href="${escapeAttr(plan.buttonUrl || '#')}" class="btn ${highlighted ? 'btn-primary' : 'btn-outline'}" style="width:100%;">
          ${escapeHTML(plan.buttonText || 'Select')}
        </a>
      </div>`;
    })
    .join('\n');

  const colClass = plans.length <= 2 ? 'grid-2' : 'grid-3';

  return `
  <!-- PRICING SECTION -->
  <section class="section" style="background:${p.bgColor || '#f8fafc'};">
    <div class="container">
      <div class="text-center" style="margin-bottom:56px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Pricing')}</h2>
        ${p.subtitle ? `<p class="subtitle" style="margin-top:12px;color:${subtitleColor};">${escapeHTML(p.subtitle)}</p>` : ''}
      </div>
      <div class="${colClass}" style="max-width:900px;margin:0 auto;">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderFooter(p: Record<string, any>): string {
  const bgColor = p.bgColor || '#0f172a';
  const textColor = p.textColor || '#fff';
  const socials = p.socials || [];
  const socialIcons = socials
    .map((s: any) => {
      const iconMap: Record<string, string> = {
        instagram:
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
        tiktok:
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.17V12a4.85 4.85 0 01-3.41-1.41 4.8 4.8 0 01-1.42-3.44h3.45V6.69h.38z"/></svg>',
        facebook:
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      };
      return `<a href="${escapeAttr(s.url || '#')}" style="color:${textColor};opacity:0.6;transition:opacity 0.2s;" target="_blank" rel="noopener noreferrer">${iconMap[s.platform] || ''}</a>`;
    })
    .join('');

  return `
  <!-- FOOTER -->
  <footer style="background:${bgColor};color:${textColor};padding:32px 0;">
    <div class="container flex items-center justify-between">
      <p style="opacity:0.5;font-size:0.85rem;">${escapeHTML(p.copyright || `© ${new Date().getFullYear()} All rights reserved.`)}</p>
      ${socialIcons ? `<div class="flex gap-16 items-center">${socialIcons}</div>` : ''}
    </div>
  </footer>`;
}

// ========================
// New Section Renderers
// ========================

function renderServicesPricing(
  p: Record<string, any>,
  primaryColor: string
): string {
  const services = p.services || [];
  const bgColor = p.bgColor || '#ffffff';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const subtitleColor = dark ? '#888' : '#64748b';

  const cards = services
    .map(
      (s: any) =>
        `<div class="svc-card" data-animate>
        <div class="svc-card-icon">${getIconSVG(s.icon || 'Scissors', primaryColor)}</div>
        <h3 class="svc-card-title">${escapeHTML(s.title || '')}</h3>
        <p class="svc-card-desc">${escapeHTML(s.description || '')}</p>
        <p class="svc-card-price">${escapeHTML(s.price || '')}</p>
        <button class="svc-card-btn" aria-label="Add ${escapeAttr(s.title || 'service')}">+</button>
      </div>`
    )
    .join('\n');

  const colClass = services.length <= 3 ? 'grid-3' : 'grid-4';

  return `
  <!-- SERVICES PRICING SECTION -->
  <section class="section" style="background:${bgColor};" id="services">
    <div class="container">
      <div style="margin-bottom:48px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Our Services')}</h2>
        ${p.subtitle ? `<p style="color:${subtitleColor};font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;margin-top:8px;">${escapeHTML(p.subtitle)}</p>` : ''}
      </div>
      <div class="${colClass}">
        ${cards}
      </div>
    </div>
  </section>`;
}

function renderAbout(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#111111';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const subtitleColor = dark ? '#888' : '#64748b';
  const textColor = dark ? '#aaa' : '#555';

  const stats = (p.stats || [])
    .map(
      (s: any) =>
        `<div>
        <p class="about-stat-num">${escapeHTML(s.value || '')}</p>
        <p class="about-stat-label">${escapeHTML(s.label || '')}</p>
      </div>`
    )
    .join('');

  const imgHTML = p.image
    ? `<img class="about-img" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title || 'About')}" />`
    : `<div class="about-img" style="display:flex;align-items:center;justify-content:center;color:#555;font-size:0.9rem;">Barbershop Image</div>`;

  return `
  <!-- ABOUT SECTION -->
  <section class="section" style="background:${bgColor};" id="about">
    <div class="container">
      <div class="about-grid">
        <div data-animate>
          <h2 class="heading-lg" style="color:${titleColor};margin-bottom:8px;">${escapeHTML(p.title || 'About Us')}</h2>
          ${p.subtitle ? `<p style="color:${subtitleColor};font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px;">${escapeHTML(p.subtitle)}</p>` : ''}
          <p style="color:${textColor};line-height:1.8;font-size:0.95rem;">${escapeHTML(p.text || '')}</p>
          ${stats ? `<div class="about-stats">${stats}</div>` : ''}
        </div>
        <div data-animate>
          ${imgHTML}
        </div>
      </div>
    </div>
  </section>`;
}

function renderTeam(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#ffffff';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const subtitleColor = dark ? '#888' : '#64748b';
  const nameColor = dark ? '#fff' : '#1a202c';
  const roleColor = primaryColor;

  const members = (p.members || [])
    .map((m: any) => {
      const imgEl = m.image
        ? `<img class="team-img" src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name || '')}" />`
        : `<div class="team-img" style="display:flex;align-items:center;justify-content:center;color:#999;font-size:0.85rem;">${escapeHTML(m.name || 'Team Member')}</div>`;
      return `<div class="team-member" data-animate>
        ${imgEl}
        <p class="team-name" style="color:${nameColor};">${escapeHTML(m.name || '')}</p>
        <p class="team-role" style="color:${roleColor};">${escapeHTML(m.role || '')}</p>
      </div>`;
    })
    .join('\n');

  return `
  <!-- TEAM SECTION -->
  <section class="section" style="background:${bgColor};" id="team">
    <div class="container">
      <div style="margin-bottom:48px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Meet The Team')}</h2>
        ${p.subtitle ? `<p style="color:${subtitleColor};font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;margin-top:8px;">${escapeHTML(p.subtitle)}</p>` : ''}
      </div>
      <div class="team-grid">
        ${members}
      </div>
      ${p.ctaText ? `<div class="text-center" style="margin-top:48px;"><a href="${escapeAttr(p.ctaUrl || '#')}" class="btn btn-outline" style="border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;border-color:#555;color:#555;">${escapeHTML(p.ctaText)}</a></div>` : ''}
    </div>
  </section>`;
}

function renderGallery(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#111111';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';
  const subtitleColor = dark ? '#888' : '#64748b';

  const images = (p.images || [])
    .map((img: any, i: number) => {
      if (img.url) {
        return `<img class="gallery-img" src="${escapeAttr(img.url)}" alt="${escapeAttr(img.alt || 'Gallery ' + (i + 1))}" />`;
      }
      return `<div class="gallery-img" style="display:flex;align-items:center;justify-content:center;color:#666;font-size:0.8rem;">Gallery ${i + 1}</div>`;
    })
    .join('\n');

  return `
  <!-- GALLERY / OUR WORK SECTION -->
  <section class="section" style="background:${bgColor};" id="gallery">
    <div class="container">
      <div style="margin-bottom:48px;">
        <h2 class="heading-lg" style="color:${titleColor};">${escapeHTML(p.title || 'Our Work')}</h2>
        ${p.subtitle ? `<p style="color:${subtitleColor};font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;margin-top:8px;">${escapeHTML(p.subtitle)}</p>` : ''}
      </div>
      <div class="gallery-grid">
        ${images}
      </div>
      ${p.ctaText ? `<div class="text-center" style="margin-top:48px;"><a href="${escapeAttr(p.ctaUrl || '#')}" class="btn btn-outline" style="border-radius:12px;text-transform:uppercase;letter-spacing:0.1em;font-size:0.85rem;border-color:#555;color:#fff;">${escapeHTML(p.ctaText)}</a></div>` : ''}
    </div>
  </section>`;
}

function renderContact(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#111111';
  const dark = isDarkColor(bgColor);
  const titleColor = dark ? '#ffffff' : '#1a202c';

  const contactItems = (p.contactItems || [])
    .map((c: any) => {
      const iconSvg = getIconSVG(c.icon || 'MapPin', dark ? '#888' : '#555');
      return `<div class="contact-item">
        ${iconSvg}
        <span style="color:${dark ? '#ccc' : '#333'};font-size:0.95rem;">${escapeHTML(c.text || '')}</span>
      </div>`;
    })
    .join('');

  const serviceOptions = (p.services || [])
    .map(
      (s: string) =>
        `<option value="${escapeAttr(s)}">${escapeHTML(s)}</option>`
    )
    .join('');

  return `
  <!-- CONTACT SECTION -->
  <section class="section" style="background:${bgColor};" id="contact">
    <div class="container">
      <div class="contact-grid">
        <div data-animate>
          <h2 class="heading-lg" style="color:${titleColor};margin-bottom:32px;">${escapeHTML(p.title || 'Contacts')}</h2>
          ${contactItems}
          <div class="contact-map">
            <div style="width:100%;height:100%;background:#2a2a2a;display:flex;align-items:center;justify-content:center;color:#555;font-size:0.85rem;">Map Placeholder</div>
          </div>
        </div>
        <div data-animate>
          <h2 class="heading-lg" style="color:${titleColor};margin-bottom:32px;">${escapeHTML(p.formTitle || 'Book an Appointment')}</h2>
          <form class="book-form" onsubmit="event.preventDefault();">
            <input type="text" class="book-input" placeholder="Your Name" required />
            <input type="tel" class="book-input" placeholder="Phone Number" />
            <select class="book-select">
              <option value="" disabled selected>Select Service</option>
              ${serviceOptions}
            </select>
            <input type="text" class="book-input" placeholder="Date &amp; Time" onfocus="this.type='datetime-local'" />
            <button type="submit" class="book-btn">${escapeHTML(p.buttonText || 'BOOK NOW')}</button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}

// ============================================================
// Real Estate Template Renderers
// ============================================================

function renderRENavigation(
  p: Record<string, any>,
  primaryColor: string
): string {
  const links = (p.menuItems || [])
    .map(
      (m: any) =>
        `<a href="${escapeAttr(m.url || '#')}" class="re-nav-link">${escapeHTML(m.label || '')}</a>`
    )
    .join('\n');

  return `
  <nav class="re-nav" id="re-nav">
    <a href="#" class="re-nav-brand">
      <svg viewBox="0 0 32 32" fill="currentColor"><polygon points="16,2 30,28 2,28"/></svg>
      ${escapeHTML(p.brand || 'Nexora')}
    </a>
    <div class="re-nav-links">
      ${links}
      ${p.ctaText ? `<a href="${escapeAttr(p.ctaUrl || '#')}" class="re-nav-cta">${escapeHTML(p.ctaText)}</a>` : ''}
    </div>
  </nav>`;
}

function renderREHero(p: Record<string, any>, primaryColor: string): string {
  const filters = (p.searchFilters || [])
    .map(
      (f: string, i: number) =>
        `<button class="re-search-filter${i === 0 ? ' active' : ''}">${escapeHTML(f)}</button>`
    )
    .join('');

  return `
  <section class="re-hero">
    <div class="re-hero-bg" style="background-image:url('${escapeAttr(p.bgImage || '')}');"></div>
    <div class="re-hero-content re-fade-up">
      <h1>${escapeHTML(p.headline || 'AI Driven Real Estate')}</h1>
      <div class="re-hero-btns">
        ${p.cta1Text ? `<a href="${escapeAttr(p.cta1Url || '#')}" class="re-hero-btn re-hero-btn-primary">${escapeHTML(p.cta1Text)}</a>` : ''}
        ${p.cta2Text ? `<a href="${escapeAttr(p.cta2Url || '#')}" class="re-hero-btn re-hero-btn-outline">${escapeHTML(p.cta2Text)}</a>` : ''}
      </div>
      <div class="re-search-bar">
        <div class="re-search-filters">${filters}</div>
        <input class="re-search-input" type="text" placeholder="${escapeAttr(p.searchPlaceholder || 'Search properties...')}" />
        <button class="re-search-submit">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="12.5" y1="12.5" x2="17" y2="17"/></svg>
        </button>
      </div>
    </div>
  </section>`;
}

function renderREIntro(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#ffffff';
  return `
  <section class="re-intro-section" style="background:${bgColor};">
    <div class="re-fade-up">
      <p>${escapeHTML(p.text || '')}</p>
      ${p.ctaText ? `<a href="${escapeAttr(p.ctaUrl || '#')}" class="re-intro-cta">${escapeHTML(p.ctaText)} <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h12M8 2l5 5-5 5"/></svg></a>` : ''}
    </div>
  </section>`;
}

function renderREFeaturedProjects(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#f8f8f8';

  const filters = (p.filters || [])
    .map(
      (f: string, i: number) =>
        `<button class="re-filter-btn${i === 0 ? ' active' : ''}">${escapeHTML(f)}</button>`
    )
    .join('');

  const cards = (p.projects || [])
    .map(
      (proj: any, i: number) => `
    <div class="re-project-card re-fade-up re-stagger-${(i % 4) + 1}">
      <img src="${escapeAttr(proj.image || '')}" alt="${escapeAttr(proj.title || '')}" loading="lazy" />
      <div class="re-project-card-overlay">
        <span class="re-project-loc">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHTML(proj.location || '')}
        </span>
        <button class="re-project-arrow" data-proj-idx="${i}" aria-label="View details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </button>
        <div class="re-project-card-num">${escapeHTML(proj.number || String(i + 1).padStart(2, '0'))}</div>
        <h3>${escapeHTML(proj.title || '')}</h3>
      </div>
    </div>`
    )
    .join('\n');

  return `
  <section class="re-featured" style="background:${bgColor};" id="featured">
    <div class="re-featured-header">
      <div>
        <p style="font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Browse All Properties</p>
        <h2 class="re-fade-up">${escapeHTML(p.title || 'Featured Projects')}</h2>
      </div>
      ${p.totalCount ? `<div class="re-featured-count re-fade-up"><div class="num">${escapeHTML(p.totalCount)}</div><div class="label">${escapeHTML(p.totalLabel || 'Listed Properties')}</div></div>` : ''}
    </div>
    <div class="re-featured-filters re-fade-up">${filters}</div>
    <div class="re-projects-grid">${cards}</div>
    <script type="application/json" id="reProjData">${JSON.stringify(
      (p.projects || []).map((proj: any) => ({
        title: proj.title || '',
        location: proj.location || '',
        price: proj.price || '',
        image: proj.image || '',
        beds: proj.beds || '-',
        baths: proj.baths || '-',
        sqft: proj.sqft || '-',
        description: proj.description || '',
      }))
    )}</script>
    <!-- Project detail modal -->
    <div class="re-proj-modal-backdrop" id="reProjModal">
      <div class="re-proj-modal" style="position:relative;">
        <button class="re-proj-modal-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <img class="re-proj-modal-img" id="reProjModalImg" src="" alt="" />
        <div class="re-proj-modal-body">
          <div class="re-proj-modal-loc" id="reProjModalLoc"></div>
          <div class="re-proj-modal-title" id="reProjModalTitle"></div>
          <div class="re-proj-modal-price" id="reProjModalPrice"></div>
          <div class="re-proj-modal-desc" id="reProjModalDesc"></div>
          <div class="re-proj-modal-specs">
            <div class="re-proj-modal-spec"><div class="val" id="reProjModalBeds">-</div><div class="lbl">Bedrooms</div></div>
            <div class="re-proj-modal-spec"><div class="val" id="reProjModalBaths">-</div><div class="lbl">Bathrooms</div></div>
            <div class="re-proj-modal-spec"><div class="val" id="reProjModalSqft">-</div><div class="lbl">Sq Ft</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderREPropertyDetail(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#111111';

  const thumbs = (p.thumbImages || [])
    .map(
      (src: string) =>
        `<img class="re-pd-thumb" src="${escapeAttr(src)}" alt="Property thumbnail" loading="lazy" />`
    )
    .join('');

  const specs = [
    { val: p.bedrooms ? p.bedrooms + ' Beds' : '', lbl: 'Bedrooms' },
    { val: p.bathrooms ? p.bathrooms + ' Baths' : '', lbl: 'Bathrooms' },
    { val: p.area || '', lbl: 'Total Area' },
    { val: p.type || '', lbl: 'Property Type' },
  ]
    .filter((s) => s.val)
    .map(
      (s) =>
        `<div class="re-pd-spec"><div><div class="val">${escapeHTML(s.val)}</div><div class="lbl">${escapeHTML(s.lbl)}</div></div></div>`
    )
    .join('');

  const features = (p.features || [])
    .map(
      (f: any) =>
        `<div class="re-pd-feature">
      <svg width="16" height="16" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round"><path d="M1 8h14M8 1v14"/></svg>
      ${escapeHTML(f.label || '')}
    </div>`
    )
    .join('');

  const details = (p.details || [])
    .map(
      (d: any) =>
        `<div class="re-pd-detail"><span class="dlbl">${escapeHTML(d.label || '')}</span><span class="dval">${escapeHTML(d.value || '')}</span></div>`
    )
    .join('');

  return `
  <section class="re-property-detail" style="background:${bgColor};" id="projects">
    <div class="re-pd-grid">
      <div class="re-fade-up">
        <img class="re-pd-main-img" src="${escapeAttr(p.mainImage || '')}" alt="${escapeAttr(p.title || '')}" loading="lazy" />
        <div class="re-pd-thumbs">${thumbs}</div>
      </div>
      <div class="re-fade-up re-stagger-2">
        <div class="re-pd-info">
          <h2>${escapeHTML(p.title || '')}</h2>
          <div class="location">
            <svg width="14" height="14" fill="none" stroke="#aaa" stroke-width="2"><path d="M7 1C4.24 1 2 3.13 2 5.75 2 9.5 7 13 7 13s5-3.5 5-7.25C12 3.13 9.76 1 7 1z"/><circle cx="7" cy="5.75" r="1.5"/></svg>
            ${escapeHTML(p.location || '')}
          </div>
          <div class="re-pd-price">${escapeHTML(p.price || '')}</div>
          <div class="re-pd-specs">${specs}</div>
          <div class="re-pd-features">${features}</div>
          ${details ? `<div class="re-pd-details">${details}</div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

function renderREGallery(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#f8f8f8';
  const images = (p.images || [])
    .map(
      (img: any, i: number) =>
        `<img class="re-fade-up re-stagger-${(i % 3) + 1}" src="${escapeAttr(img.url || '')}" alt="${escapeAttr(img.alt || '')}" loading="lazy" />`
    )
    .join('\n');

  return `
  <section style="background:${bgColor};">
    <div class="re-gallery-grid">${images}</div>
  </section>`;
}

function renderREFloorPlans(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#ffffff';
  const plans = p.plans || [];

  const tabs = plans
    .map(
      (plan: any, i: number) =>
        `<button class="re-plan-tab${i === 0 ? ' active' : ''}">${escapeHTML(plan.name || '')}</button>`
    )
    .join('');

  const firstImage = plans[0]?.image || '';

  return `
  <section class="re-plans" style="background:${bgColor};">
    <h2 class="re-fade-up">${escapeHTML(p.title || 'Building Layout')}</h2>
    <div class="re-plan-tabs re-fade-up">${tabs}</div>
    <div class="re-fade-up">
      <img class="re-plan-img" src="${escapeAttr(firstImage)}" alt="Floor plan" loading="lazy" />
    </div>
  </section>`;
}

function renderRELeadership(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#ffffff';
  const members = p.members || [];
  const total = members.length;

  // Positions cycle: index 0 = front, 1 = back-right, 2 = back-left
  const positions = ['front', 'back-right', 'back-left'];
  const photosHTML = members
    .map((m: any, i: number) => {
      const pos = positions[i % 3];
      return `<img class="re-lead-photo" data-member="${i}" data-pos="${pos}" src="${escapeAttr(m.image || '')}" alt="${escapeAttr(m.name || '')}" loading="lazy" />`;
    })
    .join('\n        ');

  const infoSlides = members
    .map(
      (m: any, i: number) => `
      <div class="re-lead-info-slide${i === 0 ? ' active' : ''}" data-member="${i}">
        <div class="re-lead-info-left">
          <div class="re-lead-name">${escapeHTML(m.name || '')}</div>
          <div class="re-lead-role">${escapeHTML(m.role || '')}</div>
          <div class="re-lead-divider"></div>
          <div class="re-lead-bio">${escapeHTML(m.bio || '')}</div>
        </div>
        <div class="re-lead-info-right">
          ${m.experience ? `<div><div class="re-lead-stat-label">Experience</div><div class="re-lead-stat-value">${escapeHTML(m.experience)}</div></div>` : ''}
          ${m.focus ? `<div><div class="re-lead-stat-label">Areas of Focus</div><div class="re-lead-stat-value">${escapeHTML(m.focus)}</div></div>` : ''}
        </div>
      </div>`
    )
    .join('\n');

  return `
  <section class="re-leadership" style="background:${bgColor};" id="about">
    <h2 class="re-fade-up">${escapeHTML(p.title || 'Leadership')}</h2>
    <div class="re-lead-pagination re-fade-up"><span class="re-lead-current">1</span>/${total}</div>
    <div class="re-lead-body re-fade-up">
      <div class="re-lead-photos">
        ${photosHTML}
      </div>
    </div>
    <div class="re-lead-info re-fade-up">
      ${infoSlides}
      <button class="re-lead-arrow" aria-label="Next leader">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2v14M2 9l7 7 7-7"/></svg>
      </button>
    </div>
  </section>`;
}

function renderREPartners(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#ffffff';
  const logos = (p.partners || [])
    .map(
      (name: string) =>
        `<span class="re-partner-logo">${escapeHTML(name)}</span>`
    )
    .join('\n');

  return `
  <section class="re-partners" style="background:${bgColor};">
    <div class="re-partners-title">${escapeHTML(p.title || 'Our valued partners')}</div>
    <div class="re-partners-logos re-fade-up">${logos}</div>
  </section>`;
}

function renderREInsights(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#ffffff';

  const cats = (p.categories || [])
    .map(
      (c: string, i: number) =>
        `<span class="re-insights-cat${i === 0 ? ' active' : ''}">${escapeHTML(c)}</span>`
    )
    .join('');

  const articles = (p.articles || [])
    .map(
      (a: any, i: number) => `
    <div class="re-article-card re-fade-up re-stagger-${(i % 3) + 1}">
      <img src="${escapeAttr(a.image || '')}" alt="${escapeAttr(a.title || '')}" loading="lazy" />
      <div class="re-article-body">
        <div class="re-article-cat">${escapeHTML(a.category || '')}</div>
        <div class="re-article-title">${escapeHTML(a.title || '')}</div>
        <div class="re-article-date">${escapeHTML(a.date || '')}</div>
      </div>
    </div>`
    )
    .join('\n');

  return `
  <section class="re-insights" style="background:${bgColor};" id="insights">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;margin-bottom:40px;">
      <h2 class="re-fade-up">${escapeHTML(p.title || 'Latest Insights')}</h2>
      <div class="re-insights-cats re-fade-up">${cats}</div>
    </div>
    <div class="re-articles-grid">${articles}</div>
  </section>`;
}

function renderRETestimonials(
  p: Record<string, any>,
  primaryColor: string
): string {
  const bgColor = p.bgColor || '#ffffff';
  const testimonials = p.testimonials || [];
  const total = testimonials.length;

  // Pick first 3 unique avatars for the social stack
  const avatarStack = testimonials
    .slice(0, 3)
    .map((t: any) =>
      t.avatar
        ? `<img src="${escapeAttr(t.avatar)}" alt="${escapeAttr(t.name || '')}" loading="lazy" />`
        : ''
    )
    .join('');

  const slides = testimonials
    .map(
      (t: any, i: number) => `
      <div class="re-testi-slide${i === 0 ? ' active' : ''}" data-testi="${i}">
        <div class="re-testi-quote">${escapeHTML(t.quote || '')}</div>
        <div class="re-testi-divider"></div>
        <div class="re-testi-author">
          ${t.avatar ? `<img class="re-testi-avatar" src="${escapeAttr(t.avatar)}" alt="${escapeAttr(t.name || '')}" loading="lazy" />` : ''}
          <div>
            <div class="re-testi-name">${escapeHTML(t.name || '')}</div>
            <div class="re-testi-role">${escapeHTML(t.role || '')}</div>
          </div>
        </div>
      </div>`
    )
    .join('\n');

  return `
  <section class="re-testi" style="background:${bgColor};">
    <h2 class="re-fade-up">${escapeHTML(p.title || 'What Our Clients Say')}</h2>
    <div class="re-testi-body re-fade-up">
      <div class="re-testi-left">
        <div class="re-testi-social">
          <div class="re-testi-arrow-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </div>
          <div class="re-testi-avatars">
            ${avatarStack}
          </div>
          <div class="re-testi-review-count">
            <span class="num">${escapeHTML(p.reviewCount || '125+')}</span>
            <span class="lbl">Reviews</span>
          </div>
        </div>
      </div>
      <div class="re-testi-right">
        <div class="re-testi-quote-icon">&ldquo;</div>
        <div class="re-testi-slides">
          ${slides}
        </div>
        <div class="re-testi-nav">
          <button class="re-testi-nav-btn" data-dir="prev" aria-label="Previous review">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M5 12l6-6M5 12l6 6"/></svg>
          </button>
          <button class="re-testi-nav-btn dark" data-dir="next" aria-label="Next review">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M19 12l-6-6M19 12l-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </section>`;
}

function renderREContact(p: Record<string, any>, primaryColor: string): string {
  const bgColor = p.bgColor || '#ffffff';

  const fields = (p.fields || [])
    .map((f: any) => {
      if (f.type === 'select') {
        const options = (f.options || [])
          .map(
            (o: string) =>
              `<option value="${escapeAttr(o)}">${escapeHTML(o)}</option>`
          )
          .join('');
        return `<div class="re-form-group">
        <label class="re-form-label">${escapeHTML(f.label || '')}</label>
        <select class="re-form-select"><option value="">${escapeHTML(f.placeholder || 'Select...')}</option>${options}</select>
      </div>`;
      }
      return `<div class="re-form-group">
      <label class="re-form-label">${escapeHTML(f.label || '')}</label>
      <input class="re-form-input" type="${escapeAttr(f.type || 'text')}" placeholder="${escapeAttr(f.placeholder || '')}" />
    </div>`;
    })
    .join('\n');

  return `
  <section class="re-contact" style="background:${bgColor};" id="contact">
    <div class="re-contact-grid">
      <div class="re-fade-up">
        <h2>${escapeHTML(p.title || 'Contact us')}</h2>
        <form class="re-contact-form" onsubmit="event.preventDefault();">
          ${fields}
          <div class="re-form-group full">
            <button type="submit" class="re-form-submit">${escapeHTML(p.buttonText || 'Submit')}</button>
          </div>
        </form>
        ${p.note ? `<p class="re-contact-note" style="margin-top:16px;">${escapeHTML(p.note)}</p>` : ''}
      </div>
      <div class="re-contact-right re-fade-up re-stagger-2">
        <div class="re-contact-map">
          <iframe
            width="100%" height="100%" style="border:0; border-radius:16px;" loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=55.1,25.1,55.4,25.3&layer=mapnik"
            title="Map"></iframe>
        </div>
      </div>
    </div>
  </section>`;
}

function renderREFooter(p: Record<string, any>, primaryColor: string): string {
  const columns = (p.columns || [])
    .map((col: any) => {
      const links = (col.links || [])
        .map(
          (l: any) =>
            `<a href="${escapeAttr(l.url || '#')}" class="re-footer-link">${escapeHTML(l.label || '')}</a>`
        )
        .join('\n');
      return `<div>
      <div class="re-footer-col-title">${escapeHTML(col.title || '')}</div>
      ${links}
    </div>`;
    })
    .join('\n');

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';
      case 'twitter':
        return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
      case 'linkedin':
        return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
      case 'facebook':
        return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
      default:
        return '';
    }
  };

  const socials = (p.socials || [])
    .map(
      (s: any) =>
        `<a href="${escapeAttr(s.url || '#')}" class="re-footer-social" target="_blank" rel="noopener noreferrer">${getSocialIcon(s.platform)}</a>`
    )
    .join('');

  return `
  <footer class="re-footer">
    <div class="re-footer-grid">
      <div>
        <div class="re-footer-brand">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor"><polygon points="16,2 30,28 2,28"/></svg>
          ${escapeHTML(p.brand || 'Nexora')}
        </div>
        <div class="re-footer-tagline">${escapeHTML(p.tagline || '')}</div>
      </div>
      ${columns}
    </div>
    <div class="re-footer-bottom">
      <span class="re-footer-copy">${escapeHTML(p.copyright || '')}</span>
      <div class="re-footer-socials">${socials}</div>
    </div>
  </footer>`;
}

// ========================
// Smartwatch Section Renderers
// ========================

function renderSWNavigation(
  p: Record<string, any>,
  primaryColor: string
): string {
  const links = (p.links || [])
    .map((l: any) => {
      const label = typeof l === 'string' ? l : l.label || '';
      const href = typeof l === 'string' ? '#' : l.href || '#';
      return `<a href="${escapeAttr(href)}">${escapeHTML(label)}</a>`;
    })
    .join('');
  return `<nav class="sw-nav">
    <a class="sw-nav-logo" href="#">${escapeHTML(p.logo || 'Timeshop')}</a>
    <div class="sw-nav-links">${links}</div>
    <button class="sw-nav-hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    <a class="sw-nav-cta" href="#">${escapeHTML(p.ctaText || 'Buy Now')}</a>
  </nav>`;
}

function renderSWHero(p: Record<string, any>, primaryColor: string): string {
  const headlineLines = (p.headline || '').replace(/\\n/g, '\n').split('\n');
  const highlight = p.highlight || '';
  const headlineHtml =
    headlineLines.map((line: string) => escapeHTML(line)).join('<br/>') +
    (highlight
      ? `<br/><span class="sw-hl">${escapeHTML(highlight)}</span>`
      : '');

  const heroImg = p.image || (p.images && p.images[0]) || '';
  const arrowSvg =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  return `<section class="sw-hero">
    <div class="sw-hero-left sw-fade-left">
      <h1 class="sw-hero-headline">${headlineHtml}</h1>
      <p class="sw-hero-desc">${escapeHTML(p.description || '')}</p>
      <a class="sw-hero-cta" href="${escapeAttr(p.ctaUrl || '#')}">${escapeHTML(p.ctaText || 'Explore More')} ${arrowSvg}</a>
    </div>
    <div class="sw-hero-right sw-fade-right">
      <img class="sw-hero-img" src="${escapeAttr(heroImg)}" alt="Smartwatch" />
      ${p.badge ? `<div class="sw-hero-badge"><strong>${escapeHTML(p.badge.replace(/^Get Up To /, ''))}</strong>${escapeHTML(p.badge.includes('Off') ? 'Get Up To' : '')}</div>` : ''}
    </div>
  </section>`;
}

function renderSWFeatures(
  p: Record<string, any>,
  primaryColor: string
): string {
  const featureIcons: Record<string, string> = {
    shipping:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    support:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    secure:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };
  const cards = (p.features || [])
    .map(
      (f: any, i: number) =>
        `<div class="sw-feature-card sw-fade-up sw-delay-${i + 1}">
      <div class="sw-feature-icon">${featureIcons[f.icon] || featureIcons.shipping}</div>
      <div>
        <div class="sw-feature-title">${escapeHTML(f.title || '')}</div>
        <div class="sw-feature-desc">${escapeHTML(f.description || f.desc || '')}</div>
      </div>
    </div>`
    )
    .join('');
  return `<section class="sw-features" id="features">${cards}</section>`;
}

function renderSWProducts(
  p: Record<string, any>,
  primaryColor: string
): string {
  const starFull =
    '<svg viewBox="0 0 20 20" fill="#f59e0b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  const starEmpty =
    '<svg viewBox="0 0 20 20" fill="#e5e7eb"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  const heartSvg =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';

  const cards = (p.products || [])
    .map((pr: any, i: number) => {
      const rating = Math.round(pr.rating || 5);
      const stars = Array.from({ length: 5 }, (_, si) =>
        si < rating ? starFull : starEmpty
      ).join('');
      return `<div class="sw-product-card" data-index="${i}">
      <div class="sw-product-img-wrap">
        <img src="${escapeAttr(pr.image || '')}" alt="${escapeAttr(pr.name || '')}" />
      </div>
      <div class="sw-product-body">
        <div class="sw-product-name">${escapeHTML(pr.name || '')}</div>
        <div class="sw-product-color">${escapeHTML(pr.color || '')}</div>
        <div class="sw-product-meta">
          <span class="sw-product-price">${escapeHTML(pr.price || '')}</span>
          <span class="sw-product-stars">${stars}<span class="sw-product-reviews">(${pr.reviews || 0})</span></span>
        </div>
        <div class="sw-product-actions">
          <button class="sw-btn-buy">Buy Now</button>
          <button class="sw-btn-fav">${heartSvg}</button>
        </div>
      </div>
    </div>`;
    })
    .join('');

  const total = (p.products || []).length;
  const dots = Array.from(
    { length: total },
    (_, i) =>
      `<button class="sw-products-dot${i === 1 ? ' sw-dot-active' : ''}" data-dot="${i}"></button>`
  ).join('');

  const sectionLabel = escapeHTML(p.subtitle || 'Our Product');
  const headline = p.headline || 'Take Our <span>Product</span>';

  const arrowLeft =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  const arrowRight =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

  return `<section class="sw-products" id="products">
    <p class="sw-section-label sw-fade-up">${sectionLabel}</p>
    <h2 class="sw-fade-up">${headline}</h2>
    <p class="sw-products-sub sw-fade-up">${escapeHTML(p.description || '')}</p>
    <div class="sw-products-track-wrap">
      <div class="sw-products-track">${cards}</div>
    </div>
    <div class="sw-products-arrows">
      <button class="sw-products-arrow" data-dir="prev">${arrowLeft}</button>
      <button class="sw-products-arrow" data-dir="next">${arrowRight}</button>
    </div>
    <div class="sw-products-dots">${dots}</div>
  </section>`;
}

function renderSWShowcase(
  p: Record<string, any>,
  primaryColor: string
): string {
  const specs = (p.specs || [])
    .map(
      (s: any) =>
        `<div class="sw-spec"><span class="sw-spec-dot"></span><span class="sw-spec-label">${escapeHTML(s.label || '')}</span><span class="sw-spec-val">${escapeHTML(s.value || '')}</span></div>`
    )
    .join('');
  return `<section class="sw-showcase">
    <div class="sw-showcase-info sw-fade-left">
      <p class="sw-section-label">${escapeHTML(p.subtitle || 'Smartwatch')}</p>
      <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      <p class="sw-showcase-desc">${escapeHTML(p.description || '')}</p>
      <div class="sw-specs-grid">${specs}</div>
    </div>
    <div class="sw-showcase-img sw-fade-right"><img src="${escapeAttr(p.image || '')}" alt="Watch Showcase" /></div>
  </section>`;
}

function renderSWChoice(p: Record<string, any>, primaryColor: string): string {
  const checks = (p.checks || [])
    .map(
      (c: string) =>
        `<div class="sw-check">
      <span class="sw-check-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
      ${escapeHTML(c)}
    </div>`
    )
    .join('');
  return `<section class="sw-choice">
    <div class="sw-choice-img sw-fade-left"><img src="${escapeAttr(p.image || '')}" alt="Choice Watch" /></div>
    <div class="sw-choice-info sw-fade-right">
      <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      <p class="sw-choice-desc">${escapeHTML(p.description || '')}</p>
      <div class="sw-checks">${checks}</div>
    </div>
  </section>`;
}

function renderSWOffer(p: Record<string, any>, primaryColor: string): string {
  const cards = (p.products || [])
    .map(
      (pr: any, i: number) =>
        `<div class="sw-offer-card sw-fade-up sw-delay-${i + 1}">
      <div class="sw-offer-card-img">
        <img src="${escapeAttr(pr.image || '')}" alt="${escapeAttr(pr.name || '')}" />
      </div>
      <div class="sw-offer-card-body">
        <span class="sw-offer-badge">${escapeHTML(pr.badge || pr.discount || 'Sell 45% Off')}</span>
        <button class="sw-offer-card-btn">Buy Now</button>
      </div>
    </div>`
    )
    .join('');
  return `<section class="sw-offer" id="offer">
    <p class="sw-section-label sw-fade-up">${escapeHTML(p.subtitle || 'Limited Time')}</p>
    <h2 class="sw-fade-up">${escapeHTML(p.headline || p.title || '')}</h2>
    <p class="sw-offer-desc sw-fade-up">${escapeHTML(p.description || '')}</p>
    <div class="sw-offer-grid">${cards}</div>
  </section>`;
}

function renderSWVideo(p: Record<string, any>, primaryColor: string): string {
  const playSvg =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  const videoSrc = p.video || '';
  const thumbSrc = p.thumbnail || '';
  return `<section class="sw-video">
    <div class="sw-video-bg"></div>
    <div class="sw-video-inner">
      <p class="sw-section-label sw-fade-up">${escapeHTML(p.subtitle || 'Product Demo')}</p>
      <h2 class="sw-fade-up">${escapeHTML(p.headline || p.title || '')}</h2>
      <p class="sw-video-desc sw-fade-up">${escapeHTML(p.description || '')}</p>
      <div class="sw-video-wrap sw-fade-up">
        <video autoplay muted loop playsinline${thumbSrc ? ` poster="${escapeAttr(thumbSrc)}"` : ''}${videoSrc ? ` src="${escapeAttr(videoSrc)}"` : ''}></video>
        <div class="sw-video-play"><button class="sw-video-play-btn">${playSvg}</button></div>
      </div>
    </div>
    <div class="sw-video-spacer"></div>
  </section>`;
}

function renderSWTestimonials(
  p: Record<string, any>,
  primaryColor: string
): string {
  const starSvg =
    '<svg viewBox="0 0 20 20" fill="#f59e0b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  const quoteSvg =
    '<svg class="sw-testi-quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>';
  const cards = (p.testimonials || [])
    .map((t: any, i: number) => {
      const stars = Array.from({ length: t.rating || 5 }, () => starSvg).join(
        ''
      );
      return `<div class="sw-testi-card sw-fade-up sw-delay-${i + 1}">
      ${quoteSvg}
      <p class="sw-testi-text">${escapeHTML(t.quote || '')}</p>
      <div class="sw-testi-author">
        <img class="sw-testi-avatar" src="${escapeAttr(t.avatar || '')}" alt="${escapeAttr(t.name || '')}" />
        <div>
          <div class="sw-testi-name">${escapeHTML(t.name || '')}</div>
          <div class="sw-testi-role">${escapeHTML(t.role || '')}</div>
          <div class="sw-testi-stars">${stars}</div>
        </div>
      </div>
    </div>`;
    })
    .join('');
  return `<section class="sw-testi">
    <p class="sw-section-label sw-fade-up">${escapeHTML(p.subtitle || 'Our Testimonial')}</p>
    <h2 class="sw-fade-up">${escapeHTML(p.headline || p.title || '')}</h2>
    <p class="sw-testi-desc sw-fade-up">${escapeHTML(p.description || '')}</p>
    <div class="sw-testi-grid">${cards}</div>
  </section>`;
}

function renderSWFooter(p: Record<string, any>, primaryColor: string): string {
  const columns = (p.columns || [])
    .map((col: any) => {
      const links = (col.links || [])
        .map((l: any) => {
          const label = typeof l === 'string' ? l : l.label || '';
          const href = typeof l === 'string' ? '#' : l.href || '#';
          return `<a href="${escapeAttr(href)}">${escapeHTML(label)}</a>`;
        })
        .join('');
      return `<div class="sw-footer-col"><h4>${escapeHTML(col.title || '')}</h4>${links}</div>`;
    })
    .join('');
  return `<footer class="sw-footer" id="contact">
    <div class="sw-footer-grid">
      <div class="sw-footer-brand">
        <div class="sw-footer-logo">${escapeHTML(p.logo || 'Timeshop')}</div>
        <div class="sw-footer-tagline">${escapeHTML(p.tagline || '')}</div>
      </div>
      ${columns}
    </div>
    <div class="sw-footer-bottom">&copy; ${new Date().getFullYear()} ${escapeHTML(p.logo || 'Timeshop')}. All rights reserved.</div>
  </footer>`;
}

// ========================
// Dental Clinic Section Renderers
// ========================

function renderDCNavigation(
  p: Record<string, any>,
  primaryColor: string
): string {
  const links = (p.links || [])
    .map(
      (l: any) =>
        `<a href="${escapeAttr(l.href || '#')}">${escapeHTML(l.label)}</a>`
    )
    .join('');
  return `<nav class="dc-nav">
    <a class="dc-nav-logo" href="#">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
      ${escapeHTML(p.logo || 'ApexCare')}
    </a>
    <div class="dc-nav-links">${links}</div>
    <div class="dc-nav-right">
      <button class="dc-nav-icon" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
      <button class="dc-nav-icon dc-nav-hamburger-icon" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
    </div>
    <button class="dc-nav-hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
  </nav>`;
}

function renderDCHero(p: Record<string, any>, primaryColor: string): string {
  // Patient recovery badge (top right glassmorphism)
  const badge = p.patientBadge || {};
  const avatars = (badge.avatars || [])
    .map((a: string) => `<img src="${escapeAttr(a)}" alt="" loading="lazy"/>`)
    .join('');
  const patientBadgeHTML = `<div class="dc-hero-patient-badge dc-fade-up">
    <div class="dc-hero-patient-avatars">${avatars}</div>
    <div class="dc-hero-patient-info">
      <div class="dc-hero-patient-value">${escapeHTML(badge.value || '150K +')}
        <span class="dc-hero-patient-check"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></span>
      </div>
      <div class="dc-hero-patient-label">${escapeHTML(badge.label || 'Patient Recover')}</div>
    </div>
  </div>`;

  // Stats bar (bottom glassmorphism)
  const stats = (p.stats || [])
    .map(
      (s: any, i: number) =>
        `<div class="dc-hero-stat dc-fade-up dc-delay-${i + 1}">
      <div class="dc-hero-stat-value">${escapeHTML(s.value || '')}</div>
      <div class="dc-hero-stat-label">${escapeHTML(s.label || '')}</div>
    </div>`
    )
    .join('');

  return `<section class="dc-hero">
    <div class="dc-hero-bg">
      <img src="${escapeAttr(p.bgImage || 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1400&q=80')}" alt="" loading="eager"/>
    </div>
    ${patientBadgeHTML}
    <div class="dc-hero-inner">
      <div class="dc-fade-up">
        <h1 class="dc-hero-headline">${escapeHTML(p.headline || 'Compassionate care, exceptional results.')}</h1>
        <div class="dc-hero-sub-row">
          <span class="dc-hero-brand-label">${escapeHTML(p.brandLabel || 'Pro Health')}</span>
          <p class="dc-hero-subheadline">${escapeHTML(p.subheadline || '')}</p>
        </div>
        <a class="dc-hero-video-cta" href="#">
          <span class="dc-hero-play-btn"><svg viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"/></svg></span>
          ${escapeHTML(p.videoCtaText || 'See how we work')}
        </a>
      </div>
    </div>
    <div class="dc-hero-stats-bar">${stats}</div>
  </section>`;
}

function renderDCAbout(p: Record<string, any>, primaryColor: string): string {
  return `<section class="dc-about">
    <div class="dc-about-info dc-fade-left">
      ${p.badge ? `<span class="dc-badge"># ${escapeHTML(p.badge)}</span>` : ''}
      <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      <p class="dc-about-desc">${escapeHTML(p.description || '')}</p>
      <a class="dc-about-cta" href="#">${escapeHTML(p.ctaText || p.cta || 'Meet a Doctor')}
        <span class="dc-about-cta-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></span>
      </a>
    </div>
    <div class="dc-about-visual dc-fade-right">
      <div class="dc-about-frame">
        <div class="dc-about-frame-icon dc-about-frame-icon--top">
          <svg viewBox="0 0 24 24" fill="${primaryColor}" stroke="none"><path d="M12 2C8.5 2 6 4.5 6 7c0 2 1 3.5 2 5s2 3.5 2 5h4c0-1.5 1-3.5 2-5s2-3 2-5c0-2.5-2.5-5-6-5zm-2 18h4v1a2 2 0 01-4 0v-1z"/></svg>
        </div>
        <img src="${escapeAttr(p.image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600')}" alt="About" loading="lazy" />
        <div class="dc-about-frame-icon dc-about-frame-icon--bottom">
          <svg viewBox="0 0 24 24" fill="${primaryColor}" stroke="none"><path d="M12 2v4m0 12v4m-8-10H0m24 0h-4m-1.34-7.07l2.83-2.83M4.51 19.49l2.83-2.83m0-9.32L4.51 4.51m14.98 14.98l-2.83-2.83"/></svg>
        </div>
      </div>
    </div>
  </section>`;
}

function renderDCReasons(p: Record<string, any>, primaryColor: string): string {
  const iconMap: Record<string, string> = {
    tooth:
      '<svg viewBox="0 0 24 24" fill="none" stroke="' +
      primaryColor +
      '" stroke-width="2"><path d="M12 2C8.5 2 6 4.5 6 7c0 2 1 3.5 2 5s2 3.5 2 5h4c0-1.5 1-3.5 2-5s2-3 2-5c0-2.5-2.5-5-6-5zm-2 18h4v1a2 2 0 01-4 0v-1z"/></svg>',
    tech:
      '<svg viewBox="0 0 24 24" fill="none" stroke="' +
      primaryColor +
      '" stroke-width="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0-4h18"/></svg>',
    family:
      '<svg viewBox="0 0 24 24" fill="none" stroke="' +
      primaryColor +
      '" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>',
  };
  const reasons = (p.reasons || [])
    .map(
      (r: any, i: number) =>
        `<div class="dc-reason-card dc-fade-up dc-delay-${i + 1}">
      <div class="dc-reason-icon">${iconMap[r.icon] || iconMap.tooth}</div>
      <h3>${escapeHTML(r.title || '')}</h3>
      <p>${escapeHTML(r.description || r.desc || '')}</p>
    </div>`
    )
    .join('');

  const imgCard = p.imageCard
    ? `<div class="dc-reason-img-card dc-fade-up dc-delay-4">
    <img src="${escapeAttr(p.imageCard.image || '')}" alt="" loading="lazy"/>
    <div class="dc-reason-img-card-text">${escapeHTML(p.imageCard.title || '')}</div>
  </div>`
    : '';

  const cert = p.certification
    ? `<div class="dc-reasons-cert dc-fade-right">
    <div class="dc-reasons-cert-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><circle cx="12" cy="9" r="6"/><path d="M9 9l2 2 4-4"/></svg></div>
    <div>
      <div class="dc-reasons-cert-text">${escapeHTML(p.certification)}</div>
      <a class="dc-reasons-cert-link" href="#">${escapeHTML(p.certCta || 'Schedule Your Visit')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
    </div>
  </div>`
    : '';

  return `<section class="dc-reasons">
    <div class="dc-reasons-header">
      <div class="dc-reasons-header-left dc-fade-left">
        ${p.badge ? `<span class="dc-badge"># ${escapeHTML(p.badge)}</span>` : ''}
        <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      </div>
      ${cert}
    </div>
    <div class="dc-reasons-grid">
      ${reasons}
      ${imgCard}
    </div>
  </section>`;
}

function renderDCServices(
  p: Record<string, any>,
  primaryColor: string
): string {
  const starSvg =
    '<svg viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  const arrowSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
  const services = (p.services || [])
    .map((s: any, i: number) => {
      const num = String(i + 1).padStart(2, '0');
      const name = typeof s === 'string' ? s : s.name || '';
      const desc = typeof s === 'string' ? '' : s.desc || '';
      return `<div class="dc-service-row dc-fade-up">
      <span class="dc-service-num">${num}</span>
      <div class="dc-service-info">
        <div class="dc-service-name">${escapeHTML(name)}</div>
        ${desc ? `<div class="dc-service-desc">${escapeHTML(desc)}</div>` : ''}
      </div>
    </div>`;
    })
    .join('');

  const rc = p.reviewCard || p.review;
  const reviewCard = rc
    ? `<div class="dc-services-review-card">
    <img src="${escapeAttr(p.image || '')}" alt="" loading="lazy" />
    <div class="dc-services-review-inner">
      <div class="dc-services-review-stars">${starSvg.repeat(rc.rating || 5)}</div>
      <div class="dc-services-review-text">"${escapeHTML(rc.text || '')}"</div>
      <div class="dc-services-review-meta">
        <div>
          <div class="dc-services-review-name">${escapeHTML(rc.author || '')}</div>
          <div class="dc-services-review-role">${escapeHTML(rc.role || '')}</div>
        </div>
      </div>
    </div>
  </div>`
    : '';

  return `<section class="dc-services">
    <div class="dc-services-header">
      <div>
        ${p.badge ? `<span class="dc-badge">${escapeHTML(p.badge)}</span>` : ''}
        <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      </div>
      <a href="#" class="dc-services-more-btn">${escapeHTML(p.moreCtaText || 'More Service')} ${arrowSvg}</a>
    </div>
    <div class="dc-services-body">
      <div class="dc-services-list dc-fade-left">${services}</div>
      <div class="dc-services-visual dc-fade-right">
        <div class="dc-services-photo">
          <img src="${escapeAttr(p.image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80')}" alt="Dental services" loading="lazy" />
        </div>
        ${reviewCard}
      </div>
    </div>
  </section>`;
}

function renderDCBooking(p: Record<string, any>, primaryColor: string): string {
  const fields = (p.fields || [])
    .map((f: any) => {
      const fullClass = f.fullWidth ? ' dc-full-width' : '';
      if (f.type === 'textarea') {
        return `<div class="dc-form-group${fullClass} dc-fade-up">
        <label>${escapeHTML(f.label || '')}</label>
        <textarea placeholder="${escapeAttr(f.placeholder || '')}" rows="3"></textarea>
      </div>`;
      }
      return `<div class="dc-form-group${fullClass} dc-fade-up">
      <label>${escapeHTML(f.label || '')}</label>
      <input type="${escapeAttr(f.type || 'text')}" placeholder="${escapeAttr(f.placeholder || '')}" />
    </div>`;
    })
    .join('');
  return `<section class="dc-booking">
    <div class="dc-booking-form dc-fade-left">
      ${p.badge ? `<span class="dc-badge">${escapeHTML(p.badge)}</span>` : ''}
      <h2>${escapeHTML(p.headline || p.title || '')}</h2>
      <div class="dc-form-grid">${fields}</div>
      <button class="dc-booking-submit">${escapeHTML(p.ctaText || p.cta || 'Reserve Your Spot')}</button>
    </div>
    <div class="dc-booking-img dc-fade-right">
      <img src="${escapeAttr(p.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=80')}" alt="Dental team" loading="lazy" />
    </div>
  </section>`;
}

function renderDCTestimonial(
  p: Record<string, any>,
  primaryColor: string
): string {
  return `<section class="dc-testimonial">
    <div class="dc-testimonial-left dc-fade-left">
      <img src="${escapeAttr(p.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400')}" alt="${escapeAttr(p.author || 'Patient')}" loading="lazy" />
    </div>
    <div class="dc-testimonial-right dc-fade-right">
      <svg class="dc-testimonial-quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
      <p class="dc-testimonial-text">${escapeHTML(p.quote || '')}</p>
      <div class="dc-testimonial-author">
        <img class="dc-testimonial-avatar" src="${escapeAttr(p.avatar || p.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80')}" alt="" />
        <div>
          <div class="dc-testimonial-name">${escapeHTML(p.author || '')}</div>
          <div class="dc-testimonial-role">${escapeHTML(p.role || 'Patient')}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderDCTeam(p: Record<string, any>, primaryColor: string): string {
  const doctors = (p.doctors || [])
    .map(
      (d: any, i: number) =>
        `<div class="dc-doctor-card dc-fade-up dc-delay-${(i % 4) + 1}">
      <img src="${escapeAttr(d.image || '')}" alt="${escapeAttr(d.name || '')}" loading="lazy" />
      <div class="dc-doctor-name">${escapeHTML(d.name || '')}</div>
      <div class="dc-doctor-role">${escapeHTML(d.role || '')}</div>
    </div>`
    )
    .join('');
  return `<section class="dc-team">
    <div class="dc-team-header">
      <div>
        ${p.badge ? `<span class="dc-badge">${escapeHTML(p.badge)}</span>` : ''}
        <h2>${escapeHTML(p.title || '')}</h2>
      </div>
      <a class="dc-team-cta" href="#">${escapeHTML(p.cta || 'View Doctor Today')}
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </a>
    </div>
    <div class="dc-team-grid">${doctors}</div>
  </section>`;
}

function renderDCBlog(p: Record<string, any>, primaryColor: string): string {
  const posts = (p.posts || [])
    .map(
      (post: any, i: number) =>
        `<div class="dc-blog-card dc-fade-up dc-delay-${i + 1}">
      <img src="${escapeAttr(post.image || '')}" alt="${escapeAttr(post.title || '')}" loading="lazy" />
      <div class="dc-blog-card-body">
        <div class="dc-blog-date">${escapeHTML(post.date || '')}</div>
        <h3>${escapeHTML(post.title || '')}</h3>
        <p>${escapeHTML(post.excerpt || '')}</p>
      </div>
    </div>`
    )
    .join('');
  return `<section class="dc-blog">
    <div class="dc-blog-header dc-fade-up">
      <h2>${escapeHTML(p.title || '')}</h2>
      <a class="dc-blog-cta" href="#">Read All Posts
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </a>
    </div>
    <div class="dc-blog-grid">${posts}</div>
  </section>`;
}

function renderDCFooter(p: Record<string, any>, primaryColor: string): string {
  const links = (p.quickLinks || [])
    .map(
      (l: any) =>
        `<a href="${escapeAttr(l.href || '#')}">${escapeHTML(l.label)}</a>`
    )
    .join('');
  const socials = (p.social || [])
    .map((s: any) => {
      const iconMap: Record<string, string> = {
        facebook:
          '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>',
        twitter:
          '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
        instagram:
          '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
        linkedin:
          '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
      };
      const icon = iconMap[(s.platform || '').toLowerCase()] || iconMap.twitter;
      return `<a href="${escapeAttr(s.href || '#')}" aria-label="${escapeAttr(s.platform || '')}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>
    </a>`;
    })
    .join('');
  return `<footer class="dc-footer">
    <div class="dc-footer-grid">
      <div>
        <div class="dc-footer-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2C8 2 5 5 5 8c0 4 3 7 5 10 .4.6 1 1.6 2 2 1-.4 1.6-1.4 2-2 2-3 5-6 5-10 0-3-3-6-7-6z"/></svg>
          ${escapeHTML(p.logo || 'ApexCare')}
        </div>
        <p class="dc-footer-tagline">${escapeHTML(p.tagline || 'Your trusted partner in dental care.')}</p>
        <div class="dc-footer-contact">
          ${p.address ? `<div>${escapeHTML(p.address)}</div>` : ''}
          ${p.phone ? `<div>${escapeHTML(p.phone)}</div>` : ''}
          ${p.email ? `<div><a href="mailto:${escapeAttr(p.email)}">${escapeHTML(p.email)}</a></div>` : ''}
        </div>
      </div>
      <div class="dc-footer-col">
        <h4>Quick Links</h4>
        ${links}
      </div>
      <div class="dc-footer-col">
        <h4>Follow Us</h4>
        <div class="dc-footer-social">${socials}</div>
      </div>
      <div class="dc-footer-col">
        <h4>Newsletter</h4>
        <p style="font-size:0.78rem;color:#9ca3af;margin-bottom:14px;">${escapeHTML(p.newsletterText || 'Subscribe for dental tips and updates.')}</p>
        <div class="dc-footer-newsletter">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
    <div class="dc-footer-bottom">${escapeHTML(p.copyright || '© 2024 ApexCare. All rights reserved.')}</div>
  </footer>`;
}

// ================================================================
// TPL-011  —  SUGARBOMB  Luxury Perfume  Renderers
// ================================================================

function renderSBNavigation(
  p: Record<string, any>,
  primaryColor: string
): string {
  const links = (p.links || [])
    .map((l: string) => `<a href="#">${escapeHTML(l)}</a>`)
    .join('');
  return `<nav class="sb-nav" id="sb-nav">
    <a href="#" class="sb-nav-logo">${escapeHTML(p.logo || 'Sugarbomb')}</a>
    <div class="sb-nav-links">${links}</div>
    <div class="sb-nav-right">
      ${p.cartIcon ? `<button class="sb-nav-cart" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></button>` : ''}
      ${p.ctaText ? `<button class="sb-nav-cta">${escapeHTML(p.ctaText)}</button>` : ''}
    </div>
  </nav>`;
}

function renderSBHero(p: Record<string, any>, primaryColor: string): string {
  const fp = p.featuredProduct;
  const featCard = fp
    ? `<div class="sb-hero-featured sb-fade-up">
    <img src="${escapeAttr(fp.image || '')}" alt="${escapeAttr(fp.name || '')}" />
    <div>
      <div class="sb-hero-feat-name">${escapeHTML(fp.name || '')}</div>
      <div class="sb-hero-feat-price">${escapeHTML(fp.price || '')}</div>
    </div>
  </div>`
    : '';
  return `<section class="sb-hero">
    <div class="sb-hero-bg"><img src="${escapeAttr(p.bgImage || '')}" alt="" loading="eager" /></div>
    <div class="sb-hero-content">
      <h1 class="sb-fade-up">${escapeHTML(p.headline || '')}</h1>
      <p class="sb-hero-sub sb-fade-up">${escapeHTML(p.subheadline || '')}</p>
      <a href="#" class="sb-hero-cta sb-fade-up">${escapeHTML(p.ctaText || 'View Our Collections')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
    ${featCard}
  </section>`;
}

function renderSBAbout(p: Record<string, any>, primaryColor: string): string {
  return `<section class="sb-about sb-fade-up">
    <span class="sb-about-badge">${escapeHTML(p.badge || 'ABOUT US')}</span>
    <div class="sb-about-text">
      <strong>${escapeHTML(p.text || '')}</strong> ${escapeHTML(p.textContinued || '')}
    </div>
  </section>`;
}

function renderSBPopular(p: Record<string, any>, primaryColor: string): string {
  const plusSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const downArrow =
    '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  const upArrow =
    '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  const products = p.products || [];
  const cardsHTML: string[] = [];
  products.forEach((prod: any, i: number) => {
    cardsHTML.push(`<div class="sb-popular-card sb-fade-up">
      <div class="sb-popular-card-img">
        <img src="${escapeAttr(prod.image || '')}" alt="${escapeAttr(prod.name || '')}" loading="lazy" />
      </div>
      <div class="sb-popular-card-bottom">
        <span class="sb-popular-card-name">${escapeHTML(prod.name || '')}</span>
        <button class="sb-popular-card-add" aria-label="Add">${plusSvg}</button>
      </div>
    </div>`);
    if (i < products.length - 1) {
      cardsHTML.push(`<div class="sb-popular-between">
        <span class="sb-popular-between-btn">${downArrow}</span>
        <span class="sb-popular-between-btn">${upArrow}</span>
      </div>`);
    }
  });
  return `<section class="sb-popular">
    <div class="sb-popular-left sb-fade-left">
      <h2>${escapeHTML(p.headline || 'Our Popular\nProduct')}</h2>
      ${p.description ? `<p class="sb-popular-desc">${escapeHTML(p.description)}</p>` : ''}
      <div class="sb-popular-arrows">
        <button aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="sb-arrow-active" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg></button>
      </div>
    </div>
    <div class="sb-popular-grid">${cardsHTML.join('')}</div>
  </section>`;
}

function renderSBBanner(p: Record<string, any>, primaryColor: string): string {
  const lines = (p.lines || [])
    .map((l: string) => `<span>${escapeHTML(l)}</span>`)
    .join('');
  const prodImgs = (p.productImages || [])
    .map(
      (src: string) =>
        `<img src="${escapeAttr(src)}" alt="Product" loading="lazy" />`
    )
    .join('');
  return `<section class="sb-banner sb-fade-up">
    <div class="sb-banner-bg"><img src="${escapeAttr(p.bgImage || '')}" alt="" loading="lazy" /></div>
    <div class="sb-banner-text">${lines}</div>
    <div class="sb-banner-products">${prodImgs}</div>
    <div class="sb-banner-dots"><span class="active"></span><span></span></div>
  </section>`;
}

function renderSBCategories(
  p: Record<string, any>,
  primaryColor: string
): string {
  const cats = (p.categories || [])
    .map(
      (c: string) =>
        `<div class="sb-cat-item${c === p.activeCategory ? ' sb-cat-active' : ''}">${escapeHTML(c)}</div>`
    )
    .join('');
  return `<section class="sb-categories sb-fade-up">
    <div class="sb-categories-image">
      <img src="${escapeAttr(p.image || '')}" alt="Category products" loading="lazy" />
    </div>
    <div class="sb-categories-content">
      <div class="sb-categories-badge">${escapeHTML(p.badge || '')}</div>
      <div class="sb-categories-list">${cats}</div>
      <div class="sb-cat-detail">
        <div>
          <div class="sb-cat-detail-title">${escapeHTML(p.categoryTitle || '')}</div>
          <div class="sb-cat-detail-desc">${escapeHTML(p.categoryDesc || '')}</div>
          <a href="#" class="sb-cat-cta">${escapeHTML(p.ctaText || 'View Our Collections')}</a>
        </div>
        <div class="sb-cat-detail-img">
          <img src="${escapeAttr(p.image || '')}" alt="" loading="lazy" />
        </div>
      </div>
    </div>
  </section>`;
}

function renderSBCollections(
  p: Record<string, any>,
  primaryColor: string
): string {
  const cards = (p.products || [])
    .map(
      (prod: any) =>
        `<div class="sb-col-card${prod.featured ? ' sb-featured' : ''} sb-fade-up">
      <div class="sb-col-card-price">${escapeHTML(prod.price || '')}</div>
      <div class="sb-col-card-img${prod.imageType === 'landscape' ? ' sb-landscape' : ''}">
        <img src="${escapeAttr(prod.image || '')}" alt="${escapeAttr(prod.name || '')}" loading="lazy" />
      </div>
      <div class="sb-col-card-name">${escapeHTML(prod.name || '')}</div>
      <a href="#" class="sb-col-card-buy">Buy Now</a>
    </div>`
    )
    .join('');
  return `<section class="sb-collections">
    <h2 class="sb-fade-up">${escapeHTML(p.headline || 'Our Collections')}</h2>
    <div class="sb-collections-grid">${cards}</div>
    <div class="sb-collections-cta sb-fade-up">
      <a href="#">${escapeHTML(p.ctaText || 'View Our Collections')}</a>
    </div>
  </section>`;
}

function renderSBStory(p: Record<string, any>, primaryColor: string): string {
  return `<section class="sb-story">
    <div class="sb-story-bg"><img src="${escapeAttr(p.bgImage || '')}" alt="" loading="lazy" /></div>
    <div class="sb-story-inner sb-fade-up">
      <div class="sb-story-play">
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <h2>${escapeHTML(p.headline || 'Watch Our Story')}</h2>
    </div>
  </section>`;
}

function renderSBTestimonials(
  p: Record<string, any>,
  primaryColor: string
): string {
  const starFull =
    '<svg viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  const starHalf =
    '<svg viewBox="0 0 24 24" fill="none" stroke="none"><defs><linearGradient id="hg"><stop offset="50%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#d4d4d4"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#hg)"/></svg>';
  const cards = (p.reviews || [])
    .map((r: any) => {
      const rating = r.rating || 5;
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 >= 0.5;
      const starsHTML = starFull.repeat(fullStars) + (hasHalf ? starHalf : '');
      return `<div class="sb-test-card sb-fade-up">
      <div class="sb-test-stars">${starsHTML}</div>
      <div class="sb-test-text">${escapeHTML(r.text || '')}</div>
      <div class="sb-test-meta">
        ${r.avatar ? `<img class="sb-test-avatar" src="${escapeAttr(r.avatar)}" alt="" loading="lazy" />` : ''}
        <div>
          <div class="sb-test-author">${escapeHTML(r.author || '')}</div>
          ${r.date ? `<div class="sb-test-date">${escapeHTML(r.date)}</div>` : ''}
        </div>
      </div>
    </div>`;
    })
    .join('');
  return `<section class="sb-testimonials">
    <div class="sb-testimonials-header sb-fade-up">
      <div>
        <div class="sb-test-badge">${escapeHTML(p.badge || 'RATINGS')}</div>
        <h2>${escapeHTML(p.headline || 'What Our\\nCustomers Say')}</h2>
      </div>
    </div>
    <div class="sb-testimonials-cards">${cards}</div>
  </section>`;
}

function renderSBNewsletter(
  p: Record<string, any>,
  primaryColor: string
): string {
  return `<section class="sb-newsletter">
    <div class="sb-newsletter-img sb-fade-left">
      <img src="${escapeAttr(p.bgImage || '')}" alt="" loading="lazy" />
    </div>
    <div class="sb-newsletter-content sb-fade-right">
      <h2>${escapeHTML(p.headline || 'Join Sugarbomb Brotherhood')}</h2>
      <p class="sb-newsletter-sub">${escapeHTML(p.subtext || '')}</p>
      <div class="sb-newsletter-form">
        <input class="sb-newsletter-input" type="email" placeholder="${escapeAttr(p.placeholder || 'Your email address')}" />
        <button class="sb-newsletter-btn">${escapeHTML(p.ctaText || 'Join our community')}</button>
      </div>
    </div>
  </section>`;
}

function renderSBFooter(p: Record<string, any>, primaryColor: string): string {
  const cols = (p.columns || [])
    .map(
      (col: any) =>
        `<div class="sb-footer-col">
      ${(col.links || []).map((l: string) => `<a href="#">${escapeHTML(l)}</a>`).join('')}
    </div>`
    )
    .join('');
  return `<footer class="sb-footer">
    <div class="sb-footer-top">
      ${cols}
      ${p.tagline ? `<div class="sb-footer-tagline">${escapeHTML(p.tagline)}</div>` : ''}
    </div>
    <div class="sb-footer-brand">${escapeHTML(p.logo || 'Sugarbomb')}</div>
    <div class="sb-footer-copy">${escapeHTML(p.copyright || '')}</div>
  </footer>
  <script>
  (function(){
    // SB scroll animations
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('sb-visible'); });
    }, {threshold:0.12});
    document.querySelectorAll('.sb-fade-up,.sb-fade-left,.sb-fade-right').forEach(function(el){ obs.observe(el); });
    // SB nav scroll
    var nav = document.getElementById('sb-nav');
    if(nav){ window.addEventListener('scroll', function(){ nav.classList.toggle('sb-scrolled', window.scrollY > 60); }); }
  })();
  </script>`;
}

// ========================
// Helpers
// ========================

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function isDarkColor(color: string): boolean {
  const dark = ['#1a', '#0f', '#0a', '#00', '#11', '#22', '#33'];
  return dark.some((d) => color.toLowerCase().startsWith(d));
}

function getIconSVG(iconName: string, color: string): string {
  const icons: Record<string, string> = {
    Zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    Shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    BarChart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    Users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    Cloud: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    Lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    Truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    RefreshCw: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    Award: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    CreditCard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    Code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    Layout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    Database: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    Sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>`,
    TrendingUp: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    Target: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    Mic: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    BookOpen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    MapPin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    Palette: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="${color}"/><circle cx="17.5" cy="10.5" r="0.5" fill="${color}"/><circle cx="8.5" cy="7.5" r="0.5" fill="${color}"/><circle cx="6.5" cy="12.5" r="0.5" fill="${color}"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    Smartphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    Scissors: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    Clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  };

  return (
    icons[iconName] ||
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  );
}
