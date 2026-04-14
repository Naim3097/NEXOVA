import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateHTML } from '@/lib/publishing/html-generator';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { getSubdomainAlias } from '@/lib/vercel-domains';
import type { Project, Element } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.MODERATE);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many publish requests. Please try again later.',
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.MODERATE.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
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

    // Create authenticated Supabase client
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify user owns the project
    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch project elements
    const { data: elements, error: elementsError } = await supabase
      .from('elements')
      .select('*')
      .eq('project_id', projectId)
      .order('order');

    if (elementsError) {
      return NextResponse.json(
        { error: 'Failed to fetch elements' },
        { status: 500 }
      );
    }

    // Get user profile to fetch tracking pixels and subscription plan
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_plan, subdomain, tracking_pixels')
      .eq('id', project.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Determine tracking pixels configuration
    // Use project-specific override if exists, otherwise use account defaults
    const trackingPixels =
      (project as any).tracking_pixels_override ||
      profile.tracking_pixels ||
      null;

    // Generate HTML with tracking pixels
    const html = generateHTML(
      project as Project,
      (elements || []) as Element[],
      trackingPixels
    );

    // Generate unique slug if not exists
    let slug = project.slug;
    if (!slug) {
      slug = generateSlug(project.name);

      // Check if slug exists, if so, append random suffix
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .neq('id', projectId)
        .single();

      if (existingProject) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }

    // Save to published_pages table
    const { error: upsertError } = await supabase
      .from('published_pages')
      .upsert(
        {
          project_id: projectId,
          html_content: html,
          slug: slug,
          published_at: new Date().toISOString(),
        },
        {
          onConflict: 'project_id',
        }
      );

    if (upsertError) {
      console.warn('Error saving to published_pages:', upsertError);
    }

    // Generate published URL based on subdomain availability
    // Use request origin for production, with fallback to env var or hardcoded production URL
    const requestOrigin =
      request.headers.get('origin') || request.headers.get('host');
    const baseUrl = requestOrigin?.includes('localhost')
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://www.nexova.my'
      : `https://${requestOrigin?.replace(/^https?:\/\//, '')}` ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'https://www.nexova.my';

    let publishedUrl: string;
    let urlType: 'path' | 'subdomain' | 'custom';

    if (profile.subdomain) {
      // Both Free and Pro users: Use subdomain if available
      // Format: subdomain.nexova.my
      const subdomainDomain = getSubdomainAlias(profile.subdomain);
      publishedUrl = `https://${subdomainDomain}`;
      urlType = 'subdomain';
    } else {
      // Fallback: Use path-based URL if no subdomain
      publishedUrl = `${baseUrl}/p/${slug}`;
      urlType = 'path';
    }

    // Update project status and published URL
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        status: 'published',
        slug: slug,
        published_url: publishedUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update project status' },
        { status: 500 }
      );
    }

    // Revalidate the published page cache to show latest changes immediately
    try {
      // Revalidate path-based URL
      revalidatePath(`/p/${slug}`);

      // Revalidate subdomain-based URL if exists
      if (profile.subdomain) {
        revalidatePath(`/s/${profile.subdomain}`);
      }

      console.log('Cache revalidated for published page:', slug);
    } catch (revalidateError) {
      console.warn('Cache revalidation failed:', revalidateError);
      // Don't fail the publish if cache revalidation fails
    }

    return NextResponse.json({
      success: true,
      publishedUrl,
      slug,
      urlType,
      subscriptionPlan: profile.subscription_plan,
      message: 'Project published successfully',
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish project' },
      { status: 500 }
    );
  }
}

/**
 * Generate URL-friendly slug from project name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}
