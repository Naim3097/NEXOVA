import { NextRequest, NextResponse } from 'next/server';
import { getLeanXBankList } from '@/lib/leanx';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/payments/banks?projectId=xxx
 * Fetch available banks for LeanX Silent Bill payment method
 * Requires projectId to fetch user's LeanX credentials from database
 */
export async function GET(request: NextRequest) {
  try {
    // Get project ID from query params
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project ID is required',
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get project and verify it exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get user's LeanX credentials from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_collection_uuid, leanx_enabled')
      .eq('id', project.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check if LeanX is enabled and configured
    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: 'LeanX payment gateway not configured. Please configure your LeanX credentials in settings.'
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
    console.error('Bank list fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
