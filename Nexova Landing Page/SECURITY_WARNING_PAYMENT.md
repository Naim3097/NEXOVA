# CRITICAL SECURITY WARNING: Payment Card Data Handling

## ⚠️ PCI-DSS Compliance Violation

**Location:** `app/api/payments/process/route.ts`

The current payment processing implementation **VIOLATES PCI-DSS compliance** by handling raw credit card data (card number, CVV, expiry date) directly on the server.

### Current Implementation Issues

```typescript
// INSECURE - DO NOT USE IN PRODUCTION
const {
  cardNumber,
  expiryDate,
  cvv,
} = body;
```

### Why This Is Dangerous

1. **PCI-DSS Non-Compliance**: Handling raw card data requires PCI-DSS Level 1 compliance, which involves:
   - Annual on-site security assessments
   - Quarterly network vulnerability scans
   - Strict server security requirements
   - Extensive documentation and processes
   - Significant costs (often $10,000+ annually)

2. **Data Breach Liability**: If card data is compromised:
   - Your organization is liable for fraud
   - Potential fines from card networks ($5,000 - $100,000+ per month)
   - Legal liability and lawsuits
   - Reputation damage

3. **Logging Risks**: Card data could be exposed in:
   - Server logs
   - Error tracking systems (Sentry, etc.)
   - Database backups
   - Memory dumps

## ✅ Recommended Solution: Use LeanX Hosted Checkout

### Implementation Steps

1. **Remove Direct Card Handling**
   - Delete or deprecate `app/api/payments/process/route.ts`
   - Never accept `cardNumber`, `cvv`, or `expiryDate` in your API

2. **Implement LeanX Hosted Checkout Page**

   ```typescript
   // In your payment creation endpoint
   import { createLeanXCheckoutSession } from '@/lib/leanx';

   export async function POST(request: NextRequest) {
     // Create a checkout session with LeanX
     const checkoutSession = await createLeanXCheckoutSession({
       amount: transaction.amount,
       currency: transaction.currency,
       customerEmail: customer.email,
       orderId: transaction.id,
       successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
       cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
       webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/leanx`,
     });

     // Return the checkout URL to redirect the customer
     return NextResponse.json({
       checkoutUrl: checkoutSession.url,
     });
   }
   ```

3. **Redirect Customer to LeanX**

   ```typescript
   // In your frontend payment component
   async function handlePayment() {
     const response = await fetch('/api/payments/create', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ transactionId }),
     });

     const { checkoutUrl } = await response.json();

     // Redirect to LeanX hosted checkout
     window.location.href = checkoutUrl;
   }
   ```

4. **Handle Payment Completion via Webhooks**

   ```typescript
   // In app/api/webhooks/leanx/route.ts
   import { verifyLeanXWebhook } from '@/lib/leanx';

   export async function POST(request: NextRequest) {
     const payload = await request.text();
     const signature = request.headers.get('x-leanx-signature');

     // Verify webhook signature
     if (!verifyLeanXWebhook(payload, signature)) {
       return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
     }

     const event = JSON.parse(payload);

     if (event.type === 'payment.succeeded') {
       // Update transaction status in database
       await updateTransactionStatus(event.data.orderId, 'completed');
     }

     return NextResponse.json({ received: true });
   }
   ```

### Alternative: Tokenization

If you must collect card data in your UI, use **LeanX Tokenization**:

```javascript
// Frontend - Tokenize card before sending to server
const token = await leanx.tokenizeCard({
  cardNumber,
  expiryDate,
  cvv,
});

// Send only the token to your server
await fetch('/api/payments/process', {
  method: 'POST',
  body: JSON.stringify({
    transactionId,
    cardToken: token, // Only token, never raw card data
  }),
});
```

## 🔒 Immediate Action Required

1. **Disable Production Payment Processing**
   - Add a feature flag to disable card processing
   - Display a maintenance message to users

2. **Audit Logs**
   - Check all logs for leaked card data
   - Rotate any compromised credentials
   - Notify your security team

3. **Implement Hosted Checkout**
   - Follow the steps above
   - Test thoroughly in LeanX sandbox environment
   - Deploy with proper webhook handling

4. **Security Review**
   - Have a security professional review the new implementation
   - Document your PCI-DSS compliance approach
   - Set up monitoring for payment failures/fraud

## 📚 Resources

- [LeanX Hosted Checkout Documentation](https://docs.leanx.com/hosted-checkout)
- [PCI-DSS Quick Reference](https://www.pcisecuritystandards.org/pci_security/)
- [LeanX Tokenization Guide](https://docs.leanx.com/tokenization)

## Questions?

Contact LeanX support for implementation guidance:
- Email: support@leanx.com
- Docs: https://docs.leanx.com

---

**Last Updated:** 2026-01-09
**Severity:** CRITICAL
**Status:** REQUIRES IMMEDIATE ACTION
