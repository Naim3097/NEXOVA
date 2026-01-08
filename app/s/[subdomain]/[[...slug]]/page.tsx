import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubdomainPageProps {
  params: {
    subdomain: string;
    slug?: string[];
  };
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain, slug } = params;

  // Get the specific project slug or default to homepage
  const projectSlug = slug && slug.length > 0 ? slug[0] : null;

  // Find user by subdomain
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('subdomain', subdomain)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // If no project slug, we could show a user portfolio/homepage
  // For now, we'll fetch their first published project
  let publishedPage;

  if (projectSlug) {
    // Fetch specific project by slug
    const { data, error } = await supabase
      .from('published_pages')
      .select(`
        html_content,
        project_id,
        projects!inner (
          user_id,
          slug
        )
      `)
      .eq('slug', projectSlug)
      .eq('projects.user_id', profile.id)
      .single();

    if (error || !data) {
      notFound();
    }

    publishedPage = data;
  } else {
    // Fetch user's latest published project
    const { data: projects } = await supabase
      .from('projects')
      .select(`
        id,
        slug,
        published_pages!inner (
          html_content
        )
      `)
      .eq('user_id', profile.id)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (!projects || !projects.published_pages) {
      // Show a nice "coming soon" page
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center max-w-md px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {profile.display_name || subdomain}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Coming soon! This page is under construction.
            </p>
            <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg">
              <span className="text-gray-500">✨ Built with X.IDE</span>
            </div>
          </div>
        </div>
      );
    }

    publishedPage = {
      html_content: Array.isArray(projects.published_pages)
        ? projects.published_pages[0]?.html_content
        : (projects.published_pages as any)?.html_content,
    };
  }

  if (!publishedPage || !publishedPage.html_content) {
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
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: SubdomainPageProps) {
  const { subdomain, slug } = params;
  const projectSlug = slug && slug.length > 0 ? slug[0] : null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('subdomain', subdomain)
    .single();

  if (!profile) {
    return { title: 'Page Not Found' };
  }

  // Fetch project for metadata
  let project;

  if (projectSlug) {
    const { data } = await supabase
      .from('projects')
      .select('name, description, seo_settings')
      .eq('slug', projectSlug)
      .eq('user_id', profile.id)
      .single();

    project = data;
  } else {
    const { data } = await supabase
      .from('projects')
      .select('name, description, seo_settings')
      .eq('user_id', profile.id)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    project = data;
  }

  if (!project) {
    return {
      title: `${profile.display_name || subdomain} | X.IDE`,
      description: `Visit ${profile.display_name || subdomain}'s page`,
    };
  }

  const seo = project.seo_settings || {};

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

// Enable dynamic rendering for subdomain pages
export const dynamic = 'force-dynamic';
export const revalidate = 60;
