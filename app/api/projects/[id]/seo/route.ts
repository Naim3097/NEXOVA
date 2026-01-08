import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEOSettings } from '@/types';

/**
 * GET /api/projects/[id]/seo
 * Get SEO settings for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createClient();

    // Verify user owns the project
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, seo_settings')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      seo_settings: project.seo_settings,
    });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/seo
 * Update SEO settings for a project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { seo_settings } = body;

    if (!seo_settings) {
      return NextResponse.json(
        { error: 'Missing seo_settings in request body' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify user owns the project
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update SEO settings
    const { error: updateError } = await supabase
      .from('projects')
      .update({ seo_settings })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating SEO settings:', updateError);
      return NextResponse.json(
        { error: 'Failed to update SEO settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      seo_settings,
    });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
