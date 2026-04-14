import { createClient } from '@/lib/supabase/server';
import { generateHTML } from '@/lib/publishing/html-generator';
import { notFound, redirect } from 'next/navigation';
import type { Project, Element } from '@/types';

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;

  // Create authenticated Supabase client
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch project data
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Verify user owns the project
  if (project.user_id !== user.id) {
    notFound();
  }

  // Fetch project elements
  const { data: elements, error: elementsError } = await supabase
    .from('elements')
    .select('*')
    .eq('project_id', id)
    .order('order');

  if (elementsError) {
    notFound();
  }

  // Generate HTML for preview
  const html = generateHTML(project as Project, (elements || []) as Element[]);

  // Return the HTML content directly
  return (
    <div>
      {/* Preview header with close button */}
      <div className="fixed top-0 left-0 right-0 bg-[#455263] text-white px-4 py-3 flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#5FC7CD]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="font-semibold">Preview Mode</span>
          </div>
          <span className="text-[#969696] text-sm hidden md:inline">
            {project.name}
          </span>
        </div>
        <a
          href={`/projects/${id}/edit`}
          className="flex items-center gap-2 bg-white text-[#455263] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="hidden sm:inline">Close Preview</span>
          <span className="sm:hidden">Close</span>
        </a>
      </div>

      {/* Preview content with top padding to account for fixed header */}
      <div className="pt-14">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

// Disable caching for preview to always show latest content
export const dynamic = 'force-dynamic';
export const revalidate = 0;
