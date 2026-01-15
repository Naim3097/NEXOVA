import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  getUserInfo,
  storeUserTokens,
} from '@/lib/oauth/google-oauth';

/**
 * Google OAuth callback handler
 * This endpoint receives the authorization code from Google and exchanges it for tokens
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(
          `/dashboard/settings/payments?oauth_error=${encodeURIComponent(error)}`,
          request.url
        )
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/payments?oauth_error=missing_parameters',
          request.url
        )
      );
    }

    // Verify state parameter (CSRF protection)
    const stateCookie = request.cookies.get('oauth_state')?.value;
    if (!stateCookie || stateCookie !== state) {
      console.error('State mismatch:', { cookie: stateCookie, param: state });
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/payments?oauth_error=invalid_state',
          request.url
        )
      );
    }

    // Extract user ID from state
    const [userId] = state.split(':');
    if (!userId) {
      return NextResponse.redirect(
        new URL(
          '/dashboard/settings/payments?oauth_error=invalid_state',
          request.url
        )
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);

    // Store tokens in database
    await storeUserTokens(userId, tokens, userInfo);

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL('/dashboard/settings/payments?oauth_success=true', request.url)
    );
    response.cookies.delete('oauth_state');

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error';

    return NextResponse.redirect(
      new URL(
        `/dashboard/settings/payments?oauth_error=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}
