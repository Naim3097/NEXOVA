import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { disconnectGoogleSheets } from '@/lib/oauth/google-oauth';
import { cookies } from 'next/headers';

/**
 * Disconnect Google Sheets integration
 * This endpoint allows users to revoke access
 */
export async function POST() {
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
      console.error('Auth error in OAuth disconnect:', authError);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Disconnect integration
    await disconnectGoogleSheets(user.id);

    return NextResponse.json({
      success: true,
      message: 'Google Sheets integration disconnected',
    });

  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json(
      {
        error: 'Failed to disconnect',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
