import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyLeanXWebhook } from '@/lib/leanx';

// Disable body parsing to access raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-leanx-signature');

    // Verify webhook signature
    if (!verifyLeanXWebhook(body, signature || '')) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    const { event_type, data } = webhookData;

    // Initialize Supabase admin client (bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    switch (event_type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(supabase, data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabase, data);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(supabase, data);
        break;

      case 'payment.succeeded':
        await handlePaymentSucceeded(supabase, data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(supabase, data);
        break;

      default:
        console.log('Unhandled webhook event:', event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(supabase: any, data: any) {
  const { subscription_id, customer_id, status, current_period_end } = data;

  // Find subscription by LeanX subscription ID
  const { data: subscription, error: findError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('leanx_subscription_id', subscription_id)
    .single();

  if (findError || !subscription) {
    console.error('Subscription not found:', subscription_id);
    return;
  }

  // Update subscription
  await supabase
    .from('subscriptions')
    .update({
      status,
      current_period_end,
      leanx_customer_id: customer_id,
    })
    .eq('id', subscription.id);
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
  const { subscription_id, cancelled_at, ends_at } = data;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('leanx_subscription_id', subscription_id)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscription_id);
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at,
      ended_at: ends_at,
    })
    .eq('id', subscription.id);

  // Update profile
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      subscription_cancelled_at: cancelled_at,
    })
    .eq('id', subscription.user_id);
}

async function handleSubscriptionExpired(supabase: any, data: any) {
  const { subscription_id, ended_at } = data;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('leanx_subscription_id', subscription_id)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscription_id);
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      ended_at,
    })
    .eq('id', subscription.id);

  // Downgrade user to free plan
  await supabase
    .from('profiles')
    .update({
      subscription_plan: 'free',
      subscription_status: 'active',
    })
    .eq('id', subscription.user_id);

  // Create free subscription record
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  await supabase.from('subscriptions').insert({
    user_id: subscription.user_id,
    plan: 'free',
    status: 'active',
    amount: 0,
    currency: 'MYR',
    billing_interval: 'monthly',
    current_period_start: currentDate.toISOString(),
    current_period_end: endDate.toISOString(),
  });
}

async function handlePaymentSucceeded(supabase: any, data: any) {
  const {
    subscription_id,
    transaction_id,
    amount,
    currency,
    payment_method,
    paid_at,
  } = data;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('leanx_subscription_id', subscription_id)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscription_id);
    return;
  }

  // Generate invoice number
  const { data: invoiceNumberData } = await supabase.rpc(
    'generate_invoice_number'
  );

  const invoiceNumber = invoiceNumberData || `INV-${Date.now()}`;

  // Create billing history record
  await supabase.from('billing_history').insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    invoice_number: invoiceNumber,
    description: `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan - ${
      subscription.billing_interval === 'monthly' ? 'Monthly' : 'Yearly'
    } Subscription`,
    amount,
    currency: currency || 'MYR',
    status: 'paid',
    payment_method: payment_method || 'credit_card',
    leanx_transaction_id: transaction_id,
    invoice_date: new Date().toISOString(),
    paid_at: paid_at || new Date().toISOString(),
  });
}

async function handlePaymentFailed(supabase: any, data: any) {
  const { subscription_id, reason } = data;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('leanx_subscription_id', subscription_id)
    .single();

  if (!subscription) {
    console.error('Subscription not found:', subscription_id);
    return;
  }

  // Update subscription to past_due
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      metadata: {
        ...(subscription.metadata || {}),
        last_payment_error: reason,
        last_payment_error_at: new Date().toISOString(),
      },
    })
    .eq('id', subscription.id);

  // Update profile status
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', subscription.user_id);

  // TODO: Send email notification about failed payment
}
