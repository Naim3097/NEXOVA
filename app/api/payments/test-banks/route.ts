import { NextResponse } from 'next/server';
import { getLeanXBankList } from '@/lib/leanx';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/payments/test-banks
 * Fetch available banks for test checkout using current user's credentials
 * Used by the payment settings test checkout modal
 */
export async function GET() {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Get user's LeanX credentials from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_collection_uuid, leanx_enabled')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found',
        },
        { status: 404 }
      );
    }

    // Check if LeanX is enabled and configured
    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: 'LeanX payment gateway not configured. Please configure your LeanX credentials in settings.',
        },
        { status: 400 }
      );
    }

    // Fetch banks from LeanX using user's credentials
    const result = await getLeanXBankList({
      authToken: profile.leanx_api_key,
      collectionUuid: profile.leanx_collection_uuid,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to fetch bank list',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      banks: result.banks,
    });
  } catch (error) {
    console.error('Test bank list fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
