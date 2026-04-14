import { NextResponse } from 'next/server';
import { getAuthorizationUrl, getOAuth2Client } from '@/lib/oauth/google-oauth';

/**
 * Test endpoint to view OAuth configuration
 * Access: /api/oauth/google/test-config
 */
export async function GET() {
  try {
    const oauth2Client = getOAuth2Client();
    const testState = 'test-state-123';
    const authUrl = getAuthorizationUrl(testState);

    // Parse the URL to extract parameters
    const urlObj = new URL(authUrl);
    const params = Object.fromEntries(urlObj.searchParams.entries());

    return NextResponse.json({
      success: true,
      config: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID?.substring(0, 30) + '...',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ? '***SET***' : 'NOT SET',
        redirectUriEnv: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      authUrl: {
        full: authUrl,
        host: urlObj.host,
        pathname: urlObj.pathname,
        params: params,
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
