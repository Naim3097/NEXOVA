import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface TrackingPixelsConfig {
  facebook?: {
    enabled: boolean;
    pixelId: string | null;
    enableConversionsAPI?: boolean;
    conversionsAPIToken?: string | null;
    testEventCode?: string | null;
  };
}

interface CAPIEventData {
  eventName: string;
  eventData: Record<string, any>;
  userData: Record<string, any>;
  eventSourceUrl: string;
  userAgent: string;
  eventId: string;
}

// Hash a value using SHA-256 (server-side)
function hashValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Get client IP address from request
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

// Send event to Meta Conversions API
async function sendToMetaCAPI(
  pixelId: string,
  accessToken: string,
  event: {
    event_name: string;
    event_time: number;
    event_id: string;
    event_source_url: string;
    action_source: string;
    user_data: Record<string, any>;
    custom_data?: Record<string, any>;
  },
  testEventCode?: string | null
): Promise<{ success: boolean; error?: string }> {
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

  const payload: any = {
    data: [event],
    access_token: accessToken,
  };

  // Add test event code if provided
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error response:', result);
      return {
        success: false,
        error: result.error?.message || 'Failed to send event to Meta',
      };
    }

    console.log('[Meta CAPI] Event sent successfully:', {
      event_name: event.event_name,
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id,
    });

    return { success: true };
  } catch (error) {
    console.error('[Meta CAPI] Network error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CAPIEventData = await request.json();
    const {
      eventName,
      eventData,
      userData,
      eventSourceUrl,
      userAgent,
      eventId,
    } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Get the pixel configuration from the referrer's project owner
    // For now, we'll need to pass the user ID or get it from the page
    const supabase = await createClient();

    // Try to get tracking config from the request origin
    const origin =
      request.headers.get('origin') || request.headers.get('referer');
    let trackingConfig: TrackingPixelsConfig | null = null;

    if (origin) {
      // Extract subdomain or project info from the origin
      const url = new URL(origin);
      const hostname = url.hostname;

      // Check if it's a subdomain (e.g., usersubdomain.xide.app)
      if (hostname.endsWith('.xide.app') || hostname.endsWith('.vercel.app')) {
        const subdomain = hostname.split('.')[0];

        // Find user by subdomain
        const { data: profile } = await supabase
          .from('profiles')
          .select('tracking_pixels')
          .eq('subdomain', subdomain)
          .single();

        if (profile?.tracking_pixels) {
          trackingConfig = profile.tracking_pixels as TrackingPixelsConfig;
        }
      }
    }

    // If no config found from subdomain, try to get from authenticated user
    if (!trackingConfig) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tracking_pixels')
          .eq('id', user.id)
          .single();

        if (profile?.tracking_pixels) {
          trackingConfig = profile.tracking_pixels as TrackingPixelsConfig;
        }
      }
    }

    // Check if Facebook CAPI is enabled
    if (
      !trackingConfig?.facebook?.enabled ||
      !trackingConfig.facebook.pixelId ||
      !trackingConfig.facebook.enableConversionsAPI ||
      !trackingConfig.facebook.conversionsAPIToken
    ) {
      return NextResponse.json(
        { error: 'Meta Conversions API is not configured' },
        { status: 400 }
      );
    }

    const { pixelId, conversionsAPIToken, testEventCode } =
      trackingConfig.facebook;

    // Get client IP
    const clientIP = getClientIP(request);

    // Build user_data object with hashed values
    const hashedUserData: Record<string, any> = {
      client_ip_address: clientIP,
      client_user_agent: userAgent,
    };

    // Add hashed user identifiers if provided
    if (userData.em) hashedUserData.em = [userData.em]; // Already hashed from client
    if (userData.ph) hashedUserData.ph = [userData.ph];
    if (userData.fn) hashedUserData.fn = [userData.fn];
    if (userData.ln) hashedUserData.ln = [userData.ln];

    // Get fbp and fbc from cookies if available
    const cookies = request.cookies;
    const fbp = cookies.get('_fbp')?.value;
    const fbc = cookies.get('_fbc')?.value;

    if (fbp) hashedUserData.fbp = fbp;
    if (fbc) hashedUserData.fbc = fbc;

    // Build the event payload
    const event = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id:
        eventId ||
        `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event_source_url: eventSourceUrl,
      action_source: 'website' as const,
      user_data: hashedUserData,
      custom_data: {} as Record<string, any>,
    };

    // Add custom data based on event type
    if (eventData.value) event.custom_data.value = eventData.value;
    if (eventData.currency) event.custom_data.currency = eventData.currency;
    if (eventData.content_name)
      event.custom_data.content_name = eventData.content_name;
    if (eventData.content_type)
      event.custom_data.content_type = eventData.content_type;
    if (eventData.content_ids)
      event.custom_data.content_ids = eventData.content_ids;
    if (eventData.num_items) event.custom_data.num_items = eventData.num_items;

    // Remove empty custom_data
    if (Object.keys(event.custom_data).length === 0) {
      delete (event as any).custom_data;
    }

    // Send to Meta CAPI
    const result = await sendToMetaCAPI(
      pixelId!,
      conversionsAPIToken!,
      event,
      testEventCode
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      event_name: eventName,
      event_id: event.event_id,
    });
  } catch (error) {
    console.error('[Meta CAPI] Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
