import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this project.' },
        { status: 403 }
      );
    }

    // Delete from published_pages
    const { error: deleteError } = await supabase
      .from('published_pages')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
    }

    // Update project status
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        status: 'draft',
        published_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to unpublish project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project unpublished successfully'
    });

  } catch (error) {
    console.error('Unpublish error:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish project' },
      { status: 500 }
    );
  }
}
