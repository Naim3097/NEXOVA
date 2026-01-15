import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { disconnectGoogleSheets } from '@/lib/oauth/google-oauth';

/**
 * Disconnect Google Sheets integration
 * This endpoint allows users to revoke access
 */
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: request.headers.get('authorization') || '',
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
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
