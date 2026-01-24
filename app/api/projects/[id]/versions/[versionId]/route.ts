import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/projects/[id]/versions/[versionId]
 * Get details of a specific version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const { id, versionId } = params;
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

    // Get the version
    const { data: version, error: versionError } = await supabase
      .from('project_versions')
      .select('*')
      .eq('id', versionId)
      .eq('project_id', id)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]/versions/[versionId]
 * Update version label
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const { id, versionId } = params;
    const body = await request.json();
    const { label } = body;

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

    // Update version label
    const { error: updateError } = await supabase
      .from('project_versions')
      .update({ label })
      .eq('id', versionId)
      .eq('project_id', id);

    if (updateError) {
      console.error('Error updating version label:', updateError);
      return NextResponse.json(
        { error: 'Failed to update version label' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Version label updated',
    });
  } catch (error) {
    console.error('Error updating version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]/versions/[versionId]
 * Delete a version
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const { id, versionId } = params;
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

    // Don't allow deleting version 0 (initial version)
    const { data: version } = await supabase
      .from('project_versions')
      .select('version_number')
      .eq('id', versionId)
      .single();

    if (version && version.version_number === 0) {
      return NextResponse.json(
        { error: 'Cannot delete initial version' },
        { status: 400 }
      );
    }

    // Delete version
    const { error: deleteError } = await supabase
      .from('project_versions')
      .delete()
      .eq('id', versionId)
      .eq('project_id', id);

    if (deleteError) {
      console.error('Error deleting version:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete version' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Version deleted',
    });
  } catch (error) {
    console.error('Error deleting version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
