import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Get current custom domain settings
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('custom_domain, custom_domain_verified')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      customDomain: profile?.custom_domain || null,
      verified: profile?.custom_domain_verified || false,
    });
  } catch (error) {
    console.error('Error fetching custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom domain settings' },
      { status: 500 }
    );
  }
}

// POST: Check if custom domain is available
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Validate domain format
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json({
        available: false,
        error: 'Invalid domain format. Please enter a valid domain (e.g., www.example.com)',
      });
    }

    // Check if domain is already taken by another user
    const { data: existing, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_domain', domain.toLowerCase())
      .neq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      available: !existing,
      error: existing ? 'This domain is already registered by another user.' : null,
    });
  } catch (error) {
    console.error('Error checking domain:', error);
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    );
  }
}

// PUT: Save custom domain
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await request.json();

    if (domain) {
      // Validate domain format
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json({
          error: 'Invalid domain format. Please enter a valid domain (e.g., www.example.com)',
        }, { status: 400 });
      }

      // Check if domain is already taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('custom_domain', domain.toLowerCase())
        .neq('id', user.id)
        .single();

      if (existing) {
        return NextResponse.json({
          error: 'This domain is already registered by another user.',
        }, { status: 400 });
      }
    }

    // Update custom domain (reset verification status when domain changes)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        custom_domain: domain ? domain.toLowerCase() : null,
        custom_domain_verified: false,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      customDomain: domain ? domain.toLowerCase() : null,
      verified: false,
    });
  } catch (error) {
    console.error('Error updating custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to update custom domain' },
      { status: 500 }
    );
  }
}

// DELETE: Remove custom domain
export async function DELETE() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        custom_domain: null,
        custom_domain_verified: false,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error removing custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to remove custom domain' },
      { status: 500 }
    );
  }
}
