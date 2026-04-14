import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TEMPLATES } from '@/lib/publishing/preview-templates';
import { generateFullTemplateHTML } from '@/lib/publishing/full-html-generator';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const template = MOCK_TEMPLATES.find((t) => t.slug === params.slug);

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const html = generateFullTemplateHTML(template);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
