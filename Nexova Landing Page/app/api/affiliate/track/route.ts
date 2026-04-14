import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role to insert referral records (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/affiliate/track - Record a referral after signup
export async function POST(request: NextRequest) {
  try {
    const { referred_id, affiliate_code } = await request.json();

    if (!referred_id || !affiliate_code) {
      return NextResponse.json(
        { error: 'Missing referred_id or affiliate_code' },
        { status: 400 }
      );
    }

    // Find the referrer by affiliate code
    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('affiliate_code', affiliate_code)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: 'Invalid affiliate code' },
        { status: 400 }
      );
    }

    // Don't allow self-referral
    if (referrer.id === referred_id) {
      return NextResponse.json(
        { error: 'Self-referral not allowed' },
        { status: 400 }
      );
    }

    // Check if this user was already referred
    const { data: existing } = await supabaseAdmin
      .from('affiliate_referrals')
      .select('id')
      .eq('referred_id', referred_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'User already referred' },
        { status: 409 }
      );
    }

    // Insert referral record
    const { error: insertError } = await supabaseAdmin
      .from('affiliate_referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id,
        affiliate_code,
        status: 'signed_up',
      });

    if (insertError) {
      console.error('Failed to insert referral:', insertError);
      return NextResponse.json(
        { error: 'Failed to record referral' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Affiliate track error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
