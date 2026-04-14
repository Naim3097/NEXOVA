/**
 * Analytics Tracking Script
 * This script generates the client-side analytics tracking code
 * that will be embedded in published pages
 */

export function generateTrackingScript(projectId: string): string {
  return `
<script>
(function() {
  'use strict';

  // Configuration
  const PROJECT_ID = '${projectId}';
  const API_ENDPOINT = '/api/analytics/track';

  // Session management
  function getSessionId() {
    const SESSION_KEY = 'xide_session_id';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    let sessionData = localStorage.getItem(SESSION_KEY);
    let sessionId, timestamp;

    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        sessionId = parsed.id;
        timestamp = parsed.timestamp;

        // Check if session expired
        if (Date.now() - timestamp > SESSION_DURATION) {
          sessionId = generateId();
          timestamp = Date.now();
        }
      } catch (e) {
        sessionId = generateId();
        timestamp = Date.now();
      }
    } else {
      sessionId = generateId();
      timestamp = Date.now();
    }

    // Update localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, timestamp }));
    return sessionId;
  }

  // Generate unique ID
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Device detection
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Get referrer source
  function getReferrerSource() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';

    try {
      const url = new URL(referrer);
      const hostname = url.hostname;

      // Check for common search engines
      if (hostname.includes('google')) return 'google';
      if (hostname.includes('bing')) return 'bing';
      if (hostname.includes('yahoo')) return 'yahoo';
      if (hostname.includes('facebook')) return 'facebook';
      if (hostname.includes('twitter') || hostname.includes('t.co')) return 'twitter';
      if (hostname.includes('linkedin')) return 'linkedin';
      if (hostname.includes('instagram')) return 'instagram';

      // Return hostname for other referrers
      return hostname;
    } catch (e) {
      return 'unknown';
    }
  }

  // Get UTM parameters
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmTerm: params.get('utm_term') || undefined,
      utmContent: params.get('utm_content') || undefined,
    };
  }

  // Track event
  function trackEvent(eventType, metadata = {}) {
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const utmParams = getUtmParams();

    const eventData = {
      project_id: PROJECT_ID,
      event_type: eventType,
      session_id: sessionId,
      device_type: deviceType,
      metadata: {
        ...metadata,
        ...utmParams,
        url: window.location.href,
        referrer: getReferrerSource(),
        timestamp: new Date().toISOString(),
      },
    };

    // Send event to API
    if (navigator.sendBeacon) {
      // Use sendBeacon for better reliability
      const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
      navigator.sendBeacon(API_ENDPOINT, blob);
    } else {
      // Fallback to fetch
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        keepalive: true,
      }).catch(function(err) {
        console.error('Analytics tracking error:', err);
      });
    }
  }

  // Track page view
  function trackPageView() {
    trackEvent('page_view', {
      title: document.title,
      path: window.location.pathname,
    });
  }

  // Track button clicks
  function trackButtonClick(event) {
    const target = event.target.closest('button, a[role="button"], .cta-button');
    if (!target) return;

    const text = target.textContent.trim();
    const elementId = target.id || target.getAttribute('data-element-id');

    trackEvent('button_click', {
      element_id: elementId,
      text: text,
      href: target.href || undefined,
    });
  }

  // Track form interactions
  function trackFormView(formElement) {
    const formId = formElement.id || formElement.getAttribute('data-form-id');
    if (!formId) return;

    trackEvent('form_view', {
      form_id: formId,
    });
  }

  function trackFormSubmit(event) {
    const formElement = event.target;
    const formId = formElement.id || formElement.getAttribute('data-form-id');
    if (!formId) return;

    trackEvent('form_submit', {
      form_id: formId,
      success: true,
    });
  }

  // Initialize tracking
  function init() {
    // Track initial page view
    trackPageView();

    // Track button clicks
    document.addEventListener('click', trackButtonClick);

    // Track form views (when form comes into viewport)
    if ('IntersectionObserver' in window) {
      const formObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            trackFormView(entry.target);
            formObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('form').forEach(function(form) {
        formObserver.observe(form);
      });
    }

    // Track form submissions
    document.addEventListener('submit', trackFormSubmit);

    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        trackEvent('page_exit', {
          duration: Date.now() - window.xidePageLoadTime,
        });
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', function() {
      trackEvent('page_exit', {
        duration: Date.now() - window.xidePageLoadTime,
      });
    });
  }

  // Store page load time
  window.xidePageLoadTime = Date.now();

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
  `.trim();
}
