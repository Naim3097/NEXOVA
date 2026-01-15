import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const projectId = params.id;

    // Get project details including published page slug before deletion
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id, slug')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this project.' },
        { status: 403 }
      );
    }

    // Get published page slug to revalidate cache
    const { data: publishedPage } = await supabase
      .from('published_pages')
      .select('slug')
      .eq('project_id', projectId)
      .single();

    // Delete the project (cascade will handle published_pages, products, etc.)
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    // Revalidate the published page cache if it existed
    if (publishedPage?.slug) {
      try {
        revalidatePath(`/p/${publishedPage.slug}`);
      } catch (revalidateError) {
        console.error('Cache revalidation error:', revalidateError);
        // Continue even if revalidation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
