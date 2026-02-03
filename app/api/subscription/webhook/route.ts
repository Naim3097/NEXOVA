import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyLeanXWebhook } from '@/lib/leanx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Get webhook secret from environment (REQUIRED - no hardcoded fallback)
    const webhookSecret = process.env.LEANX_SYSTEM_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error(
        'CRITICAL: Webhook secret not configured - rejecting all webhooks'
      );
      return NextResponse.json(
        { error: 'Webhook verification unavailable' },
        { status: 503 }
      );
    }

    // Signature header is REQUIRED - fail closed
    const signature = request.headers.get('x-leanx-signature');
    if (!signature) {
      console.error('Missing webhook signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify webhook signature
    if (!verifyLeanXWebhook(body, signature)) {
      console.error('Invalid subscription webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    // Log only non-sensitive identifiers
    console.log('Subscription webhook received:', {
      bill_no: webhookData.bill_no,
      invoice_ref: webhookData.invoice_ref,
      status: webhookData.status,
    });

    // LeanX webhook format
    const { bill_no, invoice_ref, status, amount } = webhookData;

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

    // Find subscription by order ID (stored in metadata) or leanx_subscription_id
    const { data: subscription, error: findError } = await supabase
      .from('subscriptions')
      .select('*')
      .or(
        `leanx_subscription_id.eq.${bill_no},metadata->order_id.eq.${invoice_ref}`
      )
      .eq('status', 'pending')
      .single();

    if (findError || !subscription) {
      console.error('Subscription not found for webhook:', {
        bill_no,
        invoice_ref,
      });
      // Return 200 to prevent webhook retry for unknown subscriptions
      return NextResponse.json({
        success: true,
        message: 'Subscription not found',
      });
    }

    // Map LeanX status to our status
    let internalStatus = status;
    if (status === 'success' || status === 'paid' || status === 'completed') {
      internalStatus = 'active';
    } else if (status === 'failed' || status === 'declined') {
      internalStatus = 'failed';
    } else if (status === 'pending' || status === 'processing') {
      internalStatus = 'pending';
    }

    if (internalStatus === 'active') {
      // Payment successful - activate subscription
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // Update subscription to active
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          leanx_subscription_id: bill_no,
          current_period_start: currentDate.toISOString(),
          current_period_end: endDate.toISOString(),
        })
        .eq('id', subscription.id);

      // Update user profile to premium
      await supabase
        .from('profiles')
        .update({
          subscription_plan: 'premium',
          subscription_status: 'active',
        })
        .eq('id', subscription.user_id);

      // Handle coupon usage tracking if coupon was applied
      if (subscription.coupon_id) {
        // Get coupon details
        const { data: coupon } = await supabase
          .from('coupons')
          .select('code, used_count')
          .eq('id', subscription.coupon_id)
          .single();

        if (coupon) {
          // Record coupon usage
          await supabase.from('coupon_uses').insert({
            coupon_id: subscription.coupon_id,
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            original_amount:
              subscription.original_amount || subscription.amount,
            discount_amount: subscription.discount_amount || 0,
            final_amount: subscription.amount,
          });

          // Increment coupon used_count
          await supabase
            .from('coupons')
            .update({ used_count: (coupon.used_count || 0) + 1 })
            .eq('id', subscription.coupon_id);

          console.log('Coupon usage recorded:', {
            couponCode: coupon.code,
            userId: subscription.user_id,
          });
        }
      }

      // Generate invoice number
      const { data: invoiceNumberData } = await supabase.rpc(
        'generate_invoice_number'
      );
      const invoiceNumber = invoiceNumberData || `INV-${Date.now()}`;

      // Build description with coupon info if applicable
      let description = 'Premium Plan - Monthly Subscription';
      const metadata = subscription.metadata || {};
      if (metadata.coupon_code) {
        description += ` (Discount: ${metadata.coupon_code})`;
      }

      // Create billing history record
      await supabase.from('billing_history').insert({
        user_id: subscription.user_id,
        subscription_id: subscription.id,
        invoice_number: invoiceNumber,
        description,
        amount: amount || subscription.amount,
        currency: 'MYR',
        status: 'paid',
        payment_method: 'fpx',
        leanx_transaction_id: bill_no,
        invoice_date: new Date().toISOString(),
        paid_at: new Date().toISOString(),
        metadata: metadata.coupon_code
          ? {
              coupon_code: metadata.coupon_code,
              original_amount: subscription.original_amount,
              discount_amount: subscription.discount_amount,
            }
          : null,
      });

      console.log('Subscription activated for user:', subscription.user_id);
    } else if (internalStatus === 'failed') {
      // Payment failed - mark subscription as failed
      await supabase
        .from('subscriptions')
        .update({ status: 'failed' })
        .eq('id', subscription.id);

      console.log(
        'Subscription payment failed for user:',
        subscription.user_id
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for return URL verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order');
  const status = searchParams.get('status');

  // Redirect to dashboard with status
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  return NextResponse.redirect(
    `${baseUrl}/dashboard?subscription=${status || 'pending'}&order=${orderId}`
  );
}
