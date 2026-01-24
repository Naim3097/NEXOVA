import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  addDomainToVercel,
  removeDomainFromVercel,
  verifyDomainOnVercel,
  getDomainStatus,
} from '@/lib/vercel-domains';

// GET: Get current custom domain settings
export async function GET() {
  try {
    const supabase = await createClient();
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

    // If user has a custom domain, get its status from Vercel
    let vercelStatus = null;
    let dnsRecords = null;

    if (profile?.custom_domain) {
      const status = await getDomainStatus(profile.custom_domain);
      vercelStatus = {
        exists: status.exists,
        verified: status.verified,
        verification: status.verification,
        misconfigured: status.config?.misconfigured,
      };

      // Build DNS records to show user
      if (status.exists) {
        const isApex = !profile.custom_domain.includes('.') ||
          profile.custom_domain.split('.').length === 2;

        dnsRecords = [];

        if (isApex) {
          dnsRecords.push({
            type: 'A',
            name: '@',
            value: '76.76.21.21',
          });
        } else {
          const parts = profile.custom_domain.split('.');
          const subdomain = parts[0];
          dnsRecords.push({
            type: 'CNAME',
            name: subdomain,
            value: 'cname.vercel-dns.com',
          });
        }

        // Add TXT verification if not verified
        if (!status.verified && status.verification && status.verification.length > 0) {
          const txtVerification = status.verification.find(v => v.type === 'TXT');
          if (txtVerification) {
            dnsRecords.push({
              type: 'TXT',
              name: '_vercel',
              value: txtVerification.value,
            });
          }
        }
      }

      // Update verified status in database if it changed
      if (status.verified !== profile.custom_domain_verified) {
        await supabase
          .from('profiles')
          .update({ custom_domain_verified: status.verified })
          .eq('id', user.id);
      }
    }

    return NextResponse.json({
      success: true,
      customDomain: profile?.custom_domain || null,
      verified: vercelStatus?.verified || profile?.custom_domain_verified || false,
      vercelStatus,
      dnsRecords,
    });
  } catch (error) {
    console.error('Error fetching custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom domain settings' },
      { status: 500 }
    );
  }
}

// POST: Check if custom domain is available and add to Vercel
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain, action } = await request.json();

    // Handle verify action
    if (action === 'verify') {
      if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
      }

      const verifyResult = await verifyDomainOnVercel(domain);

      if (verifyResult.verified) {
        // Update database
        await supabase
          .from('profiles')
          .update({ custom_domain_verified: true })
          .eq('id', user.id);
      }

      return NextResponse.json({
        success: verifyResult.success,
        verified: verifyResult.verified,
        error: verifyResult.error,
      });
    }

    // Default action: check availability
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

    // Check if domain is already taken by another user in our database
    const { data: existing, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('custom_domain', domain.toLowerCase())
      .neq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (existing) {
      return NextResponse.json({
        available: false,
        error: 'This domain is already registered by another user.',
      });
    }

    return NextResponse.json({
      available: true,
      error: null,
    });
  } catch (error) {
    console.error('Error checking domain:', error);
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    );
  }
}

// PUT: Save custom domain (add to Vercel and save to database)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await request.json();

    // Get current domain to remove from Vercel if changing
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('custom_domain')
      .eq('id', user.id)
      .single();

    if (domain) {
      // Validate domain format
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json({
          error: 'Invalid domain format. Please enter a valid domain (e.g., www.example.com)',
        }, { status: 400 });
      }

      // Check if domain is already taken by another user
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

      // Remove old domain from Vercel if exists
      if (currentProfile?.custom_domain && currentProfile.custom_domain !== domain.toLowerCase()) {
        await removeDomainFromVercel(currentProfile.custom_domain);
      }

      // Add new domain to Vercel
      const vercelResult = await addDomainToVercel(domain.toLowerCase());

      if (!vercelResult.success) {
        return NextResponse.json({
          error: vercelResult.error || 'Failed to add domain to Vercel.',
        }, { status: 400 });
      }

      // Update database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          custom_domain: domain.toLowerCase(),
          custom_domain_verified: vercelResult.domain?.verified || false,
        })
        .eq('id', user.id);

      if (updateError) {
        // Try to rollback Vercel domain
        await removeDomainFromVercel(domain.toLowerCase());
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        customDomain: domain.toLowerCase(),
        verified: vercelResult.domain?.verified || false,
        dnsRecords: vercelResult.dnsRecords,
        verification: vercelResult.domain?.verification,
      });
    } else {
      // Removing domain
      if (currentProfile?.custom_domain) {
        await removeDomainFromVercel(currentProfile.custom_domain);
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
        customDomain: null,
        verified: false,
      });
    }
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
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current domain to remove from Vercel
    const { data: profile } = await supabase
      .from('profiles')
      .select('custom_domain')
      .eq('id', user.id)
      .single();

    if (profile?.custom_domain) {
      // Remove from Vercel
      const removeResult = await removeDomainFromVercel(profile.custom_domain);
      if (!removeResult.success) {
        console.error('Failed to remove domain from Vercel:', removeResult.error);
        // Continue anyway to clear database
      }
    }

    // Clear from database
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
