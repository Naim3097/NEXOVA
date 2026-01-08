import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/projects/[id]/versions/[versionId]/restore
 * Restore a project to a specific version
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const { id, versionId } = params;
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

    // Get the version to restore
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

    const snapshotData = version.data as any;

    // Delete current elements
    const { error: deleteError } = await supabase
      .from('elements')
      .delete()
      .eq('project_id', id);

    if (deleteError) {
      console.error('Error deleting elements:', deleteError);
      return NextResponse.json(
        { error: 'Failed to restore version' },
        { status: 500 }
      );
    }

    // Restore elements from snapshot
    if (snapshotData.elements && snapshotData.elements.length > 0) {
      const elementsToInsert = snapshotData.elements.map((element: any) => ({
        project_id: id,
        type: element.type,
        order: element.order,
        props: element.props,
        version: (element.version || 0) + 1,
      }));

      const { error: insertError } = await supabase
        .from('elements')
        .insert(elementsToInsert);

      if (insertError) {
        console.error('Error restoring elements:', insertError);
        return NextResponse.json(
          { error: 'Failed to restore version' },
          { status: 500 }
        );
      }
    }

    // Update project SEO settings
    if (snapshotData.seo_settings) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ seo_settings: snapshotData.seo_settings })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating SEO settings:', updateError);
      }
    }

    // Create a new version snapshot marking the restore
    const { data: latestVersion } = await supabase
      .from('project_versions')
      .select('version_number')
      .eq('project_id', id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1;

    await supabase.from('project_versions').insert({
      project_id: id,
      version_number: nextVersionNumber,
      snapshot_type: 'full',
      data: snapshotData,
      created_by: user.id,
      is_auto_save: false,
      label: `Restored from version ${version.version_number}`,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully restored to version ${version.version_number}`,
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
