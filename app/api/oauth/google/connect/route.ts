import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthorizationUrl } from '@/lib/oauth/google-oauth';
import crypto from 'crypto';

/**
 * Initiate Google OAuth flow
 * This endpoint starts the OAuth process by redirecting to Google
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get auth token from cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ||
                  request.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
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
