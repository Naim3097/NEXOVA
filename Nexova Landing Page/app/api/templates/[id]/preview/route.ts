import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateHTML } from '@/lib/publishing/html-generator';
import type { Project, Element } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  // Fetch template
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !template) {
    return new NextResponse('Template not found', { status: 404 });
  }

  // Build a mock project from template data
  const mockProject: Project = {
    id: template.id,
    user_id: '',
    name: template.name,
    slug: template.slug,
    description: template.description,
    status: 'published',
    element_count: template.data?.elements?.length || 0,
    current_version: 1,
    published_url: null,
    seo_settings: template.data?.seo_settings || {},
    integrations: {},
    created_at: template.created_at,
    updated_at: template.updated_at,
  };

  // Build mock elements from template data
  const mockElements: Element[] = (template.data?.elements || []).map(
    (el: any, idx: number) => ({
      id: `template-element-${idx}`,
      project_id: template.id,
      type: el.type,
      order: el.order ?? idx,
      props: el.props || {},
      version: 1,
      created_at: template.created_at,
      updated_at: template.updated_at,
    })
  );

  const html = generateHTML(mockProject, mockElements);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
