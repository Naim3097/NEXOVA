import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getAuthorizationUrl } from '@/lib/oauth/google-oauth';
import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Initiate Google OAuth flow
 * This endpoint starts the OAuth process by redirecting to Google
 */
export async function GET() {
  try {
    // Create Supabase client with proper cookie handling for server-side auth
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error in OAuth connect:', authError);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Generate state parameter for CSRF protection
    // Format: userId:timestamp:randomString
    const state = `${user.id}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;

    // Store state in a temporary table or cookie for verification
    // For simplicity, we'll use a cookie here
    const stateExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Generate authorization URL
    const authUrl = getAuthorizationUrl(state);

    // Create response with state cookie
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: stateExpiry,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to initiate OAuth flow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
