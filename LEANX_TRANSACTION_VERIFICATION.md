# LeanX Transaction Verification API

## Overview

The transaction verification API implements **LeanX Step 2: Getting Transaction Status** as documented in the LeanX API documentation. This allows you to manually verify payment status with LeanX, which is useful for:

- **Webhook Failure Recovery**: Check payment status when webhooks fail to process
- **Manual Reconciliation**: Verify transactions for accounting purposes
- **Admin Verification**: Manually check payment status from the dashboard
- **Fallback Mechanism**: Automatically verify on payment success page

## Implementation Details

### 1. Core Verification Function

**File**: `lib/leanx.ts`

```typescript
export async function verifyLeanXPayment(
  config: LeanXConfig,
  billNoOrInvoiceRef: string,
  queryType: 'bill_no' | 'invoice_ref' = 'bill_no'
): Promise<PaymentResponse>
```

**Features**:
- Calls LeanX API endpoint: `POST /api/v1/merchant/transaction-status`
- Supports querying by both `bill_no` (LeanX transaction ID) and `invoice_ref` (your order ID)
- Maps LeanX status codes to internal status
- Returns structured payment response with status and transaction details

**LeanX Status Mapping**:
- `success`, `paid` → `completed`
- `pending`, `processing` → `processing`
- `failed`, `declined` → `failed`
- `cancelled` → `cancelled`
- `refunded` → `refunded`

### 2. API Endpoint

**File**: `app/api/payments/verify/route.ts`

**Endpoint**: `POST /api/payments/verify`

**Request Body**:
```json
{
  "transactionId": "BILL-123456",  // LeanX bill_no (optional)
  "orderId": "ORD-123456"          // Your invoice_ref (optional)
}
```

**Note**: You must provide either `transactionId` OR `orderId`

**Response** (Success):
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "transaction": {
    "id": "uuid",
    "orderId": "ORD-123456",
    "transactionId": "BILL-123456",
    "previousStatus": "pending",
    "currentStatus": "completed",
    "statusChanged": true,
    "amount": 100.00,
    "currency": "MYR",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "createdAt": "2024-01-10T10:00:00Z",
    "completedAt": "2024-01-10T10:05:00Z"
  }
}
```

**Response** (Error):
```json
{
  "error": "Transaction not found",
  "transaction": {
    "id": "uuid",
    "orderId": "ORD-123456",
    "transactionId": "BILL-123456",
    "currentStatus": "pending"
  }
}
```

**Security Features**:
- CSRF protection required
- Rate limiting (moderate tier)
- Validates user owns the transaction via project ownership
- Requires LeanX credentials to be configured

### 3. Automatic Verification on Success Page

**File**: `app/payment/success/page.tsx`

The payment success page now automatically verifies the transaction status when loaded:

**Flow**:
1. User is redirected to `/payment/success?order=ORD-123456` after payment
2. Page waits 2 seconds to allow webhook to process
3. Calls `/api/payments/verify` to check actual status
4. Updates UI based on verification result:
   - **Verifying**: Shows loading spinner
   - **Completed**: Shows success message
   - **Processing/Pending**: Shows processing message
   - **Failed**: Shows failure message with retry option

**Benefits**:
- Handles webhook failures gracefully
- Provides accurate status even if webhook is delayed
- Better user experience with real-time verification

## Usage Examples

### Example 1: Manual Verification from Dashboard

```typescript
// In your admin dashboard or transaction page
const verifyTransaction = async (orderId: string) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('Current status:', data.transaction.currentStatus);
    console.log('Status changed:', data.transaction.statusChanged);

    if (data.transaction.statusChanged) {
      // Update UI to reflect new status
      alert(`Payment status updated to: ${data.transaction.currentStatus}`);
    }
  } else {
    console.error('Verification failed:', data.error);
  }
};
```

### Example 2: Scheduled Status Check (Cron Job)

```typescript
// In a server-side cron job or background worker
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { verifyLeanXPayment } from '@/lib/leanx';

async function checkPendingTransactions() {
  const supabase = getSupabaseAdmin();

  // Get all pending transactions older than 10 minutes
  const { data: pendingTransactions } = await supabase
    .from('transactions')
    .select('*, projects(user_id), profiles(leanx_api_key, leanx_collection_uuid)')
    .eq('status', 'pending')
    .lt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .limit(100);

  for (const transaction of pendingTransactions || []) {
    const result = await verifyLeanXPayment(
      {
        authToken: transaction.profiles.leanx_api_key,
        collectionUuid: transaction.profiles.leanx_collection_uuid,
      },
      transaction.transaction_id,
      'bill_no'
    );

    if (result.success && result.status !== transaction.status) {
      // Update transaction status
      await supabase
        .from('transactions')
        .update({
          status: result.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      console.log(`Updated transaction ${transaction.id} to ${result.status}`);
    }
  }
}
```

### Example 3: Webhook Failure Recovery

```typescript
// In your webhook handler or error monitoring
async function recoverFailedWebhook(transactionId: string) {
  const supabase = getSupabaseAdmin();

  const { data: transaction } = await supabase
    .from('transactions')
    .select('*, projects(user_id), profiles(leanx_api_key, leanx_collection_uuid)')
    .eq('transaction_id', transactionId)
    .single();

  if (!transaction) return;

  // Verify with LeanX
  const result = await verifyLeanXPayment(
    {
      authToken: transaction.profiles.leanx_api_key,
      collectionUuid: transaction.profiles.leanx_collection_uuid,
    },
    transactionId,
    'bill_no'
  );

  if (result.success) {
    // Update transaction with verified status
    await supabase
      .from('transactions')
      .update({
        status: result.status,
        updated_at: new Date().toISOString(),
        webhook_recovery: true, // Flag for tracking
      })
      .eq('id', transaction.id);
  }
}
```

## Configuration

Ensure your environment variables are set:

```env
# LeanX API Configuration
LEANX_API_HOST=https://api.leanx.io
LEANX_WEBHOOK_SECRET=your_webhook_secret_here

# App URL for callbacks
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

User profiles must have the following fields configured:
- `leanx_api_key`: Your LeanX auth token
- `leanx_collection_uuid`: Your LeanX collection UUID
- `leanx_enabled`: Set to `true`

## Error Handling

The verification API handles various error scenarios:

1. **Transaction Not Found**: Returns 404 with error message
2. **LeanX Not Configured**: Returns 400 if credentials are missing
3. **LeanX API Error**: Returns error from LeanX with breakdown details
4. **Network Error**: Returns 500 with generic error message
5. **Rate Limiting**: Returns 429 with retry-after information

## Best Practices

1. **Use as Fallback**: Webhooks are the primary method, use verification as backup
2. **Rate Limit Awareness**: Don't poll too frequently, respect rate limits
3. **Status Change Detection**: Check `statusChanged` field to avoid unnecessary updates
4. **Error Logging**: Log verification failures for debugging
5. **User Communication**: Inform users when status is being verified
6. **Scheduled Checks**: Run periodic verification for pending transactions

## Testing

To test the verification API:

1. **Create a test payment** through your application
2. **Note the order ID** from the response
3. **Call verification API** with the order ID:
   ```bash
   curl -X POST http://localhost:3001/api/payments/verify \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: your-csrf-token" \
     -d '{"orderId": "ORD-1234567890-ABC"}'
   ```
4. **Check response** for status and transaction details

## Monitoring

Monitor these metrics for verification API:
- Verification success rate
- Average verification time
- Status change frequency
- Error rates by type
- Webhook vs. verification discrepancies

## Support

For LeanX-specific issues, refer to:
- LeanX API Documentation: https://docs.leanx.io
- LeanX Support: Contact your LeanX account manager

For implementation issues:
- Check server logs for detailed error messages
- Verify LeanX credentials are correct
- Ensure webhook secret matches LeanX configuration
- Test with LeanX sandbox environment first
