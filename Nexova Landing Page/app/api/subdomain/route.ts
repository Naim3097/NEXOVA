import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  addSubdomainAlias,
  removeSubdomainAlias,
  getSubdomainAlias,
} from '@/lib/vercel-domains';

// GET: Check current subdomain
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subdomain')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      subdomain: profile?.subdomain || null,
    });
  } catch (error) {
    console.error('Error fetching subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subdomain' },
      { status: 500 }
    );
  }
}

// POST: Check if subdomain is available
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subdomain } = await request.json();

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({
        available: false,
        error:
          'Invalid subdomain format. Use lowercase letters, numbers, and hyphens (3-63 characters).',
      });
    }

    // Reserved subdomains
    const reserved = [
      'www',
      'api',
      'app',
      'admin',
      'dashboard',
      'mail',
      'ftp',
      'blog',
      'shop',
      'store',
      'help',
      'support',
      'docs',
      'dev',
      'staging',
      'test',
    ];
    if (reserved.includes(subdomain)) {
      return NextResponse.json({
        available: false,
        error: 'This subdomain is reserved.',
      });
    }

    // Check if subdomain is already taken
    const { data: existing, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('subdomain', subdomain)
      .neq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is good - means available)
      throw error;
    }

    return NextResponse.json({
      available: !existing,
      error: existing ? 'This subdomain is already taken.' : null,
    });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to check subdomain availability' },
      { status: 500 }
    );
  }
}

// PUT: Update subdomain
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subdomain } = await request.json();

    // Get current subdomain to potentially remove its Vercel alias
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('subdomain')
      .eq('id', user.id)
      .single();

    const currentSubdomain = currentProfile?.subdomain;

    // Allow null/empty to remove subdomain
    if (subdomain) {
      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
      if (!subdomainRegex.test(subdomain)) {
        return NextResponse.json(
          {
            error:
              'Invalid subdomain format. Use lowercase letters, numbers, and hyphens (3-63 characters).',
          },
          { status: 400 }
        );
      }

      // Reserved subdomains
      const reserved = [
        'www',
        'api',
        'app',
        'admin',
        'dashboard',
        'mail',
        'ftp',
        'blog',
        'shop',
        'store',
        'help',
        'support',
        'docs',
        'dev',
        'staging',
        'test',
      ];
      if (reserved.includes(subdomain)) {
        return NextResponse.json(
          {
            error: 'This subdomain is reserved.',
          },
          { status: 400 }
        );
      }

      // Check if subdomain is already taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('subdomain', subdomain)
        .neq('id', user.id)
        .single();

      if (existing) {
        return NextResponse.json(
          {
            error: 'This subdomain is already taken.',
          },
          { status: 400 }
        );
      }

      // Add subdomain alias to Vercel (creates subdomain.nexova.my)
      const aliasResult = await addSubdomainAlias(subdomain);
      if (!aliasResult.success) {
        return NextResponse.json(
          {
            error: aliasResult.error || 'Failed to create subdomain alias.',
          },
          { status: 400 }
        );
      }
    }

    // Remove old subdomain alias if changing or removing
    if (currentSubdomain && currentSubdomain !== subdomain) {
      await removeSubdomainAlias(currentSubdomain);
    }

    // Update subdomain in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subdomain: subdomain || null })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Return the full domain URL for the new format
    const fullDomain = subdomain ? getSubdomainAlias(subdomain) : null;

    return NextResponse.json({
      success: true,
      subdomain: subdomain || null,
      fullDomain,
    });
  } catch (error) {
    console.error('Error updating subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to update subdomain' },
      { status: 500 }
    );
  }
}
