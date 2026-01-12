/**
 * LeanX Payment Gateway Integration
 *
 * This module handles integration with LeanX payment gateway.
 * Based on LeanX API documentation for redirect-based payments.
 */

const LEANX_API_HOST = process.env.LEANX_API_HOST || 'https://api.leanx.io';

interface LeanXConfig {
  authToken: string;
  collectionUuid: string;
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  productName: string;
  productDescription?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  callbackUrl: string;
  returnUrl: string;
  paymentServiceId?: string; // Bank ID for Silent Bill method
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  status?: string;
  message?: string;
  error?: string;
}

/**
 * LeanX API Request Body
 */
interface LeanXPaymentRequest {
  collection_uuid: string;
  amount: number;
  invoice_ref: string;
  full_name: string;
  email: string;
  phone_number: string;
  redirect_url: string;
  callback_url: string;
  payment_service_id?: string; // Required for Silent Bill method
}

/**
 * LeanX API Response
 */
interface LeanXPaymentResponse {
  response_code: number;
  description: string;
  data?: {
    redirect_url: string;
    bill_no: string;
    invoice_ref: string;
  };
  breakdown_errors?: string;
}

/**
 * LeanX Bank List Response
 */
interface LeanXBankListResponse {
  response_code: number;
  description: string;
  data?: Array<{
    payment_service_id: string;
    payment_service_name: string;
    payment_service_logo?: string;
  }>;
  breakdown_errors?: string;
}

/**
 * Bank information for display
 */
export interface Bank {
  id: string;
  name: string;
  logo?: string;
}

/**
 * Fetch available banks from LeanX for Silent Bill method
 */
export async function getLeanXBankList(
  config: LeanXConfig
): Promise<{ success: boolean; banks?: Bank[]; error?: string }> {
  try {
    console.log('Fetching LeanX bank list:', {
      host: LEANX_API_HOST,
    });

    const response = await fetch(`${LEANX_API_HOST}/api/v1/merchant/bank-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': config.authToken,
      },
      body: JSON.stringify({
        collection_uuid: config.collectionUuid,
      }),
    });

    const result: LeanXBankListResponse = await response.json();

    console.log('LeanX bank list response:', {
      response_code: result.response_code,
      description: result.description,
      bank_count: result.data?.length || 0,
    });

    // Success response code is 2000
    if (result.response_code === 2000 && result.data) {
      const banks: Bank[] = result.data.map(bank => ({
        id: bank.payment_service_id,
        name: bank.payment_service_name,
        logo: bank.payment_service_logo,
      }));

      return {
        success: true,
        banks,
      };
    } else {
      return {
        success: false,
        error: result.breakdown_errors || result.description || 'Failed to fetch bank list',
      };
    }

  } catch (error) {
    console.error('LeanX Bank List Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a payment with LeanX using the Silent Bill method
 * Requires payment_service_id (bank ID) for direct bank redirect
 */
export async function createLeanXPayment(
  config: LeanXConfig,
  payment: PaymentRequest
): Promise<PaymentResponse> {
  try {
    // Validate required payment_service_id for Silent Bill method
    if (!payment.paymentServiceId) {
      return {
        success: false,
        error: 'payment_service_id is required for Silent Bill method',
      };
    }

    const payload: LeanXPaymentRequest = {
      collection_uuid: config.collectionUuid,
      amount: payment.amount,
      invoice_ref: payment.orderId,
      full_name: payment.customerName || 'Customer',
      email: payment.customerEmail || '',
      phone_number: payment.customerPhone || '',
      redirect_url: payment.returnUrl,
      callback_url: payment.callbackUrl,
      payment_service_id: payment.paymentServiceId,
    };

    console.log('Creating LeanX payment (Silent Bill):', {
      host: LEANX_API_HOST,
      collection_uuid: config.collectionUuid,
      amount: payment.amount,
      invoice_ref: payment.orderId,
      payment_service_id: payment.paymentServiceId,
    });

    const response = await fetch(`${LEANX_API_HOST}/api/v1/merchant/create-bill-silent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': config.authToken,
      },
      body: JSON.stringify(payload),
    });

    const result: LeanXPaymentResponse = await response.json();

    console.log('LeanX API response:', {
      response_code: result.response_code,
      description: result.description,
      has_data: !!result.data,
    });

    // Success response code is 2000
    if (result.response_code === 2000 && result.data) {
      return {
        success: true,
        transactionId: result.data.bill_no,
        paymentUrl: result.data.redirect_url,
        status: 'pending',
        message: 'Payment created successfully',
      };
    } else {
      return {
        success: false,
        error: result.breakdown_errors || result.description || 'Payment creation failed',
      };
    }

  } catch (error) {
    console.error('LeanX API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * LeanX Transaction Status Response
 */
interface LeanXTransactionStatusResponse {
  response_code: number;
  description: string;
  data?: {
    bill_no: string;
    invoice_ref: string;
    amount: number;
    status: string;
    payment_method?: string;
    created_at?: string;
    updated_at?: string;
    completed_at?: string;
  };
  breakdown_errors?: string;
}

/**
 * Verify payment status with LeanX
 * Uses LeanX Transaction Status API to check payment status
 */
export async function verifyLeanXPayment(
  config: LeanXConfig,
  billNoOrInvoiceRef: string,
  queryType: 'bill_no' | 'invoice_ref' = 'bill_no'
): Promise<PaymentResponse> {
  try {
    const payload = queryType === 'bill_no'
      ? { bill_no: billNoOrInvoiceRef }
      : { invoice_ref: billNoOrInvoiceRef };

    console.log('Verifying LeanX payment:', {
      host: LEANX_API_HOST,
      queryType,
      value: billNoOrInvoiceRef,
    });

    const response = await fetch(`${LEANX_API_HOST}/api/v1/merchant/transaction-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': config.authToken,
      },
      body: JSON.stringify(payload),
    });

    const result: LeanXTransactionStatusResponse = await response.json();

    console.log('LeanX status check response:', {
      response_code: result.response_code,
      description: result.description,
      has_data: !!result.data,
    });

    // Success response code is 2000
    if (result.response_code === 2000 && result.data) {
      // Map LeanX status to our internal status
      let internalStatus = result.data.status;
      if (result.data.status === 'success' || result.data.status === 'paid') {
        internalStatus = 'completed';
      } else if (result.data.status === 'pending' || result.data.status === 'processing') {
        internalStatus = 'processing';
      } else if (result.data.status === 'failed' || result.data.status === 'declined') {
        internalStatus = 'failed';
      } else if (result.data.status === 'cancelled') {
        internalStatus = 'cancelled';
      } else if (result.data.status === 'refunded') {
        internalStatus = 'refunded';
      }

      return {
        success: true,
        transactionId: result.data.bill_no,
        status: internalStatus,
        message: 'Payment verified successfully',
      };
    } else {
      return {
        success: false,
        error: result.breakdown_errors || result.description || 'Transaction status check failed',
      };
    }

  } catch (error) {
    console.error('LeanX Verification Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Process payment (for demo/testing)
 * In production, payments are processed via LeanX checkout page
 */
export async function processLeanXPayment(
  config: LeanXConfig,
  transactionId: string,
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }
): Promise<PaymentResponse> {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock validation
    if (paymentDetails.cardNumber.length !== 16) {
      return {
        success: false,
        error: 'Invalid card number',
        status: 'failed',
      };
    }

    // MOCK SUCCESS RESPONSE
    return {
      success: true,
      transactionId: transactionId,
      status: 'completed',
      message: 'Payment processed successfully',
    };

  } catch (error) {
    console.error('LeanX Payment Processing Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed',
    };
  }
}

/**
 * Validate LeanX webhook signature
 * Uses HMAC SHA256 with timing-safe comparison to prevent timing attacks
 */
export function validateLeanXWebhook(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  try {
    const crypto = require('crypto');

    // Generate expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    // timingSafeEqual requires buffers of equal length
    if (signature.length !== expectedSignature.length) {
      return false;
    }

    const signatureBuffer = Buffer.from(signature, 'utf-8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');

    // Timing-safe comparison
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  } catch (error) {
    console.error('Webhook validation error:', error);
    return false;
  }
}

/**
 * Verify LeanX webhook signature
 */
export function verifyLeanXWebhook(
  payload: string,
  signature: string
): boolean {
  try {
    const secretKey = process.env.LEANX_WEBHOOK_SECRET;
    if (!secretKey) {
      console.error('LEANX_WEBHOOK_SECRET not configured - rejecting webhook');
      return false; // Fail closed - reject webhooks when secret is not configured
    }

    return validateLeanXWebhook(payload, signature, secretKey);
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

/**
 * Process subscription payment through LeanX
 */
interface SubscriptionPaymentRequest {
  user_id: string;
  plan: string;
  amount: number;
  currency: string;
  billing_interval: string;
  payment_method: {
    card_number: string;
    card_name: string;
    expiry_date: string;
    cvv: string;
  };
  email: string;
  leanx_api_key?: string;
  leanx_secret_key?: string;
}

interface SubscriptionPaymentResponse {
  success: boolean;
  subscription_id?: string;
  customer_id?: string;
  transaction_id?: string;
  error?: string;
}

export async function processLeanXSubscription(
  request: SubscriptionPaymentRequest
): Promise<SubscriptionPaymentResponse> {
  try {
    // TODO: Replace with actual LeanX subscription API call
    // const response = await fetch('https://api.leanx.com/v1/subscriptions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${request.leanx_api_key}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     plan: request.plan,
    //     amount: request.amount,
    //     currency: request.currency,
    //     interval: request.billing_interval,
    //     customer_email: request.email,
    //     payment_method: request.payment_method,
    //   }),
    // });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    const cardNumber = request.payment_method.card_number.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      return {
        success: false,
        error: 'Invalid card number',
      };
    }

    // MOCK SUCCESS RESPONSE
    const crypto = require('crypto');
    const randomString1 = crypto.randomBytes(8).toString('hex').toUpperCase();
    const randomString2 = crypto.randomBytes(8).toString('hex').toUpperCase();
    const mockSubscriptionId = `SUB-${Date.now()}-${randomString1}`;
    const mockCustomerId = `CUST-${request.user_id.substring(0, 8).toUpperCase()}`;
    const mockTransactionId = `TXN-${Date.now()}-${randomString2}`;

    return {
      success: true,
      subscription_id: mockSubscriptionId,
      customer_id: mockCustomerId,
      transaction_id: mockTransactionId,
    };

  } catch (error) {
    console.error('LeanX subscription processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cancel LeanX subscription
 */
interface CancelSubscriptionRequest {
  subscription_id: string;
  leanx_api_key?: string;
  leanx_secret_key?: string;
}

interface CancelSubscriptionResponse {
  success: boolean;
  error?: string;
}

export async function cancelLeanXSubscription(
  request: CancelSubscriptionRequest
): Promise<CancelSubscriptionResponse> {
  try {
    // TODO: Replace with actual LeanX cancellation API call
    // const response = await fetch(`https://api.leanx.com/v1/subscriptions/${request.subscription_id}/cancel`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${request.leanx_api_key}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // MOCK SUCCESS RESPONSE
    console.log('Mock: Cancelling subscription', request.subscription_id);

    return {
      success: true,
    };

  } catch (error) {
    console.error('LeanX subscription cancellation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
