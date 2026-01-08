import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

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

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(publishedPage.html_content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'img', 'a', 'button',
      'section', 'article', 'header', 'footer', 'nav', 'ul', 'ol', 'li', 'table',
      'thead', 'tbody', 'tr', 'td', 'th', 'form', 'input', 'textarea', 'label',
      'select', 'option', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 'svg', 'path',
      'script', 'style' // Allow inline scripts and styles for functionality
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'style', 'class', 'id', 'type', 'name', 'value',
      'placeholder', 'required', 'onclick', 'onsubmit', 'target', 'rel',
      'width', 'height', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width',
      'data-*', 'action', 'method', 'for', 'checked', 'disabled', 'role', 'aria-*'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['style', 'script'], // Allow these tags but sanitize their content
    FORCE_BODY: false
  });

  // Return the sanitized HTML content
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
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
    title: seo.title || project.name,
    description: seo.description || project.description,
    openGraph: {
      title: seo.ogTitle || seo.title || project.name,
      description: seo.ogDescription || seo.description || project.description,
      images: seo.ogImage ? [seo.ogImage] : [],
      type: seo.ogType || 'website',
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.ogTitle || seo.title || project.name,
      description: seo.ogDescription || seo.description || project.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
  };
}
