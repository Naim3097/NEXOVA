import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/projects/[id]/versions
 * Get all versions for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

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

    // Get all versions
    const { data: versions, error: versionsError } = await supabase
      .from('project_versions')
      .select('id, version_number, snapshot_type, is_auto_save, label, created_at')
      .eq('project_id', id)
      .order('version_number', { ascending: false });

    if (versionsError) {
      console.error('Error fetching versions:', versionsError);
      return NextResponse.json(
        { error: 'Failed to fetch versions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/versions
 * Create a new version snapshot
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { label, is_auto_save } = body;

    const supabase = await createClient();

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

    // Get current elements
    const { data: elements, error: elementsError } = await supabase
      .from('elements')
      .select('*')
      .eq('project_id', id)
      .order('order');

    if (elementsError) {
      console.error('Error fetching elements:', elementsError);
      return NextResponse.json(
        { error: 'Failed to fetch project elements' },
        { status: 500 }
      );
    }

    // Get project SEO settings
    const { data: projectData, error: projectDataError } = await supabase
      .from('projects')
      .select('seo_settings')
      .eq('id', id)
      .single();

    if (projectDataError) {
      console.error('Error fetching project data:', projectDataError);
      return NextResponse.json(
        { error: 'Failed to fetch project data' },
        { status: 500 }
      );
    }

    // Get the latest version number
    const { data: latestVersion } = await supabase
      .from('project_versions')
      .select('version_number')
      .eq('project_id', id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1;

    // Create snapshot data
    const snapshotData = {
      elements: elements || [],
      seo_settings: projectData.seo_settings,
      timestamp: new Date().toISOString(),
    };

    // Insert new version
    const { data: newVersion, error: insertError } = await supabase
      .from('project_versions')
      .insert({
        project_id: id,
        version_number: nextVersionNumber,
        snapshot_type: 'full',
        data: snapshotData,
        created_by: user.id,
        is_auto_save: is_auto_save !== undefined ? is_auto_save : false,
        label: label || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating version:', insertError);
      return NextResponse.json(
        { error: 'Failed to create version' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      version: {
        id: newVersion.id,
        version_number: newVersion.version_number,
        label: newVersion.label,
        is_auto_save: newVersion.is_auto_save,
        created_at: newVersion.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
