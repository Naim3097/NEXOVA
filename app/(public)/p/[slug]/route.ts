import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  // Create Supabase client for public access
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  // Fetch published page
  const { data: publishedPage, error } = await supabase
    .from('published_pages')
    .select('html_content, project_id')
    .eq('slug', slug)
    .single();

  if (error || !publishedPage) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Page Not Found</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f3f4f6; }
    .container { text-align: center; padding: 2rem; }
    h1 { color: #1f2937; margin-bottom: 0.5rem; }
    p { color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
</body>
</html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }

  // Return the raw HTML content directly
  // This ensures the full HTML document (including <head> with tracking scripts) is served properly
  return new NextResponse(publishedPage.html_content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
