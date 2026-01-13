import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getLeanXBankList } from '@/lib/leanx';

/**
 * POST /api/payments/public-banks
 * Fetch banks for published pages (no auth required, uses project_id)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id } = body;

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get project to find user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get user's LeanX credentials
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

    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 400 }
      );
    }

    // Fetch banks using LeanX helper
    const result = await getLeanXBankList({
      authToken: profile.leanx_api_key,
      collectionUuid: profile.leanx_collection_uuid,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to fetch banks',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      banks: result.banks,
    });
  } catch (error) {
    console.error('Public bank list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
