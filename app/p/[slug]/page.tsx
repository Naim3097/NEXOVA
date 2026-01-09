import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface PublishedPageProps {
  params: {
    slug: string;
  };
}

export default async function PublishedPage({ params }: PublishedPageProps) {
  const { slug } = params;

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
    notFound();
  }

  // Sanitize HTML content before rendering to prevent XSS attacks
  const sanitizedHtml = sanitizeHtml(publishedPage.html_content);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PublishedPageProps) {
  const { slug } = params;

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

  const { data: publishedPage } = await supabase
    .from('published_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!publishedPage) {
    return {
      title: 'Page Not Found',
    };
  }

  // Fetch project separately
  const { data: project } = await supabase
    .from('projects')
    .select('name, description, seo_settings')
    .eq('id', publishedPage.project_id)
    .single();

  const seo = project?.seo_settings || {};

  return {
    title: seo.title || project?.name || 'Product Page',
    description: seo.description || project?.description || '',
    openGraph: {
      title: seo.ogTitle || seo.title || project?.name || 'Product Page',
      description: seo.ogDescription || seo.description || project?.description || '',
      images: seo.ogImage ? [seo.ogImage] : [],
      type: seo.ogType || 'website',
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.ogTitle || seo.title || project?.name || 'Product Page',
      description: seo.ogDescription || seo.description || project?.description || '',
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
  };
}
