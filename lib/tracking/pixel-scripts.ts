/**
 * Generate tracking pixel scripts for various platforms
 */

interface TrackingPixelsConfig {
  facebook?: {
    enabled: boolean;
    pixelId: string | null;
    enableConversionsAPI?: boolean;
  };
  tiktok?: {
    enabled: boolean;
    pixelId: string | null;
    enableEventsAPI?: boolean;
  };
  google_ads?: {
    enabled: boolean;
    tagId: string | null;
    conversionLabel?: string | null;
  };
  google_analytics?: {
    enabled: boolean;
    measurementId: string | null;
  };
}

/**
 * Generate Facebook Pixel script
 */
function generateFacebookPixelScript(pixelId: string): string {
  return `
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->`;
}

/**
 * Generate TikTok Pixel script
 */
function generateTikTokPixelScript(pixelId: string): string {
  return `
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->`;
}

/**
 * Generate Google Analytics 4 script
 */
function generateGoogleAnalyticsScript(measurementId: string): string {
  return `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>
<!-- End Google Analytics 4 -->`;
}

/**
 * Generate Google Ads Conversion Tracking script
 */
function generateGoogleAdsScript(tagId: string, conversionLabel?: string | null): string {
  const baseScript = `
<!-- Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${tagId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${tagId}');
</script>`;

  // If conversion label is provided, add conversion tracking setup
  if (conversionLabel) {
    return baseScript + `
<script>
  // Google Ads Conversion Tracking
  window.gtag_report_conversion = function(url) {
    gtag('event', 'conversion', {
      'send_to': '${conversionLabel}',
      'event_callback': function() {
        if (typeof(url) != 'undefined') {
          window.location = url;
        }
      }
    });
    return false;
  }
</script>
<!-- End Google Ads -->`;
  }

  return baseScript + '\n<!-- End Google Ads -->';
}

/**
 * Generate conversion event tracking helper functions
 */
function generateConversionHelpers(config: TrackingPixelsConfig): string {
  let helpers = `
<script>
  // Conversion tracking helper functions
  window.trackPurchase = function(transactionData) {
    const { orderId, value, currency, productName } = transactionData;

    try {`;

  // Facebook Pixel purchase event
  if (config.facebook?.enabled && config.facebook.pixelId) {
    helpers += `
      // Facebook Pixel Purchase Event
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          value: value,
          currency: currency || 'MYR',
          content_name: productName,
          content_type: 'product'
        });
        console.log('[Tracking] Facebook Pixel: Purchase tracked');
      }`;
  }

  // TikTok Pixel purchase event
  if (config.tiktok?.enabled && config.tiktok.pixelId) {
    helpers += `
      // TikTok Pixel Purchase Event
      if (typeof ttq !== 'undefined') {
        ttq.track('CompletePayment', {
          value: value,
          currency: currency || 'MYR',
          content_name: productName,
          content_type: 'product'
        });
        console.log('[Tracking] TikTok Pixel: Purchase tracked');
      }`;
  }

  // Google Analytics 4 purchase event
  if (config.google_analytics?.enabled && config.google_analytics.measurementId) {
    helpers += `
      // Google Analytics 4 Purchase Event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: orderId,
          value: value,
          currency: currency || 'MYR',
          items: [{
            item_name: productName,
            price: value
          }]
        });
        console.log('[Tracking] Google Analytics: Purchase tracked');
      }`;
  }

  // Google Ads conversion
  if (config.google_ads?.enabled && config.google_ads.conversionLabel) {
    helpers += `
      // Google Ads Conversion
      if (typeof gtag_report_conversion !== 'undefined') {
        gtag_report_conversion();
        console.log('[Tracking] Google Ads: Conversion tracked');
      }`;
  }

  helpers += `
    } catch (error) {
      console.error('[Tracking] Error tracking purchase:', error);
    }
  };

  // Lead form submission tracking
  window.trackLead = function(formData) {
    try {`;

  if (config.facebook?.enabled && config.facebook.pixelId) {
    helpers += `
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
        console.log('[Tracking] Facebook Pixel: Lead tracked');
      }`;
  }

  if (config.tiktok?.enabled && config.tiktok.pixelId) {
    helpers += `
      if (typeof ttq !== 'undefined') {
        ttq.track('SubmitForm');
        console.log('[Tracking] TikTok Pixel: Lead tracked');
      }`;
  }

  if (config.google_analytics?.enabled && config.google_analytics.measurementId) {
    helpers += `
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead');
        console.log('[Tracking] Google Analytics: Lead tracked');
      }`;
  }

  helpers += `
    } catch (error) {
      console.error('[Tracking] Error tracking lead:', error);
    }
  };

  // Add to cart tracking
  window.trackAddToCart = function(productData) {
    const { productName, value, currency } = productData;
    try {`;

  if (config.facebook?.enabled && config.facebook.pixelId) {
    helpers += `
      if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
          content_name: productName,
          value: value,
          currency: currency || 'MYR'
        });
      }`;
  }

  if (config.tiktok?.enabled && config.tiktok.pixelId) {
    helpers += `
      if (typeof ttq !== 'undefined') {
        ttq.track('AddToCart', {
          content_name: productName,
          value: value,
          currency: currency || 'MYR'
        });
      }`;
  }

  if (config.google_analytics?.enabled && config.google_analytics.measurementId) {
    helpers += `
      if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
          items: [{
            item_name: productName,
            price: value
          }]
        });
      }`;
  }

  helpers += `
    } catch (error) {
      console.error('[Tracking] Error tracking add to cart:', error);
    }
  };

  console.log('[Tracking] Conversion tracking initialized');
</script>`;

  return helpers;
}

/**
 * Main function to generate all tracking pixel scripts
 */
export function generateTrackingPixelScripts(config: TrackingPixelsConfig | null): string {
  if (!config) return '';

  let scripts = '';

  // Facebook Pixel
  if (config.facebook?.enabled && config.facebook.pixelId) {
    scripts += generateFacebookPixelScript(config.facebook.pixelId);
  }

  // TikTok Pixel
  if (config.tiktok?.enabled && config.tiktok.pixelId) {
    scripts += generateTikTokPixelScript(config.tiktok.pixelId);
  }

  // Google Analytics 4
  if (config.google_analytics?.enabled && config.google_analytics.measurementId) {
    scripts += generateGoogleAnalyticsScript(config.google_analytics.measurementId);
  }

  // Google Ads
  if (config.google_ads?.enabled && config.google_ads.tagId) {
    scripts += generateGoogleAdsScript(
      config.google_ads.tagId,
      config.google_ads.conversionLabel
    );
  }

  // Add conversion tracking helpers if any pixels are enabled
  const hasAnyPixel =
    (config.facebook?.enabled && config.facebook.pixelId) ||
    (config.tiktok?.enabled && config.tiktok.pixelId) ||
    (config.google_analytics?.enabled && config.google_analytics.measurementId) ||
    (config.google_ads?.enabled && config.google_ads.tagId);

  if (hasAnyPixel) {
    scripts += generateConversionHelpers(config);
  }

  return scripts;
}

/**
 * Export config type for use in other modules
 */
export type { TrackingPixelsConfig };
