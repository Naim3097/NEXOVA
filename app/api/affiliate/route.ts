import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

function generateAffiliateCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/affiliate - Get affiliate stats for current user
export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile with affiliate_code
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('affiliate_code')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // Get referral stats
    const { data: referrals, error: referralsError } = await supabase
      .from('affiliate_referrals')
      .select(
        `
        id,
        status,
        created_at,
        referred:referred_id (
          display_name,
          email,
          subscription_plan,
          created_at
        )
      `
      )
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (referralsError) {
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500 }
      );
    }

    const totalReferrals = referrals?.length || 0;
    const activeReferrals =
      referrals?.filter((r) => r.status === 'active').length || 0;
    const signedUpReferrals =
      referrals?.filter((r) => r.status === 'signed_up').length || 0;

    return NextResponse.json({
      affiliate_code: profile.affiliate_code,
      stats: {
        total: totalReferrals,
        active: activeReferrals,
        signed_up: signedUpReferrals,
      },
      referrals: referrals || [],
    });
  } catch (error) {
    console.error('Affiliate GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/affiliate - Generate affiliate code for current user
export async function POST() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has an affiliate code
    const { data: profile } = await supabase
      .from('profiles')
      .select('affiliate_code')
      .eq('id', user.id)
      .single();

    if (profile?.affiliate_code) {
      return NextResponse.json({ affiliate_code: profile.affiliate_code });
    }

    // Generate a unique code with retry
    let code = generateAffiliateCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('affiliate_code', code)
        .single();

      if (!existing) break;
      code = generateAffiliateCode();
      attempts++;
    }

    // Update profile with new code
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ affiliate_code: code })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to generate affiliate code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ affiliate_code: code });
  } catch (error) {
    console.error('Affiliate POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
