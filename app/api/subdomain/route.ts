import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Check current subdomain
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

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
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subdomain } = await request.json();

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({
        available: false,
        error: 'Invalid subdomain format. Use lowercase letters, numbers, and hyphens (3-63 characters).',
      });
    }

    // Reserved subdomains
    const reserved = ['www', 'api', 'app', 'admin', 'dashboard', 'mail', 'ftp', 'blog', 'shop', 'store', 'help', 'support', 'docs', 'dev', 'staging', 'test'];
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
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subdomain } = await request.json();

    // Allow null/empty to remove subdomain
    if (subdomain) {
      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
      if (!subdomainRegex.test(subdomain)) {
        return NextResponse.json({
          error: 'Invalid subdomain format. Use lowercase letters, numbers, and hyphens (3-63 characters).',
        }, { status: 400 });
      }

      // Reserved subdomains
      const reserved = ['www', 'api', 'app', 'admin', 'dashboard', 'mail', 'ftp', 'blog', 'shop', 'store', 'help', 'support', 'docs', 'dev', 'staging', 'test'];
      if (reserved.includes(subdomain)) {
        return NextResponse.json({
          error: 'This subdomain is reserved.',
        }, { status: 400 });
      }

      // Check if subdomain is already taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('subdomain', subdomain)
        .neq('id', user.id)
        .single();

      if (existing) {
        return NextResponse.json({
          error: 'This subdomain is already taken.',
        }, { status: 400 });
      }
    }

    // Update subdomain
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subdomain: subdomain || null })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      subdomain: subdomain || null,
    });
  } catch (error) {
    console.error('Error updating subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to update subdomain' },
      { status: 500 }
    );
  }
}
