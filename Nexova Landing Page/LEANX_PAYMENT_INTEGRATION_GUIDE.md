# LeanX Payment Gateway - Complete Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Authentication Setup](#authentication-setup)
4. [Integration Flow](#integration-flow)
5. [Code Implementation](#code-implementation)
6. [Payment Verification](#payment-verification)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Production Checklist](#production-checklist)

---

## Overview

This guide documents the complete implementation of the LeanX payment gateway using the **"API Own Page"** (Silent Bill) method. This approach allows you to:

- Host the bank selection page on your own website
- Maintain full control over the user interface
- Redirect users directly to their selected bank for authentication
- Support both FPX (Online Banking) and E-Wallet payments
- Handle both B2C and B2B payment models

### Key Benefits
- White-label payment experience
- Seamless UI integration
- Support for all major Malaysian banks and e-wallets
- Automatic detection of available payment channels

---

## Prerequisites

### 1. LeanX Account Setup
You need to obtain the following credentials from your LeanX Portal:

| Credential | Location | Format | Purpose |
|------------|----------|--------|---------|
| **Auth Token** | API Page in Portal | `LP-XXXXXXX-MM\|uuid\|hash` | API authentication |
| **Collection UUID** | Collections Page | `Dc-XXXXXXXX-Lx` | Identifies your revenue bucket |
| **Hash Key** | API Page | 64-character hex string | JWT callback verification |

### 2. API Endpoints

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.leanx.io/api/v1/merchant/` |
| Sandbox | `https://api.leanx.io/api/v1/merchant/` |

**Note:** LeanX uses the same base URL for both environments. The mode is determined by your account settings in the portal.

---

## Authentication Setup

All API requests require the Auth Token in the header:

```javascript
headers: {
  'Content-Type': 'application/json',
  'auth-token': 'YOUR_AUTH_TOKEN_HERE'
}
```

### Security Considerations

**Client-Side vs Server-Side:**
- **Development/Testing:** Can call APIs directly from frontend (suitable for merchant dashboards)
- **Production (Consumer-Facing):** Should proxy through your backend to hide credentials
- **CORS:** May require backend proxy to avoid CORS issues

---

## Integration Flow

The integration follows a 4-step process:

```
┌─────────────────┐
│ 1. Fetch Banks  │ → Retrieve available payment methods
└────────┬────────┘
         ↓
┌─────────────────┐
│ 2. User Selects │ → Customer chooses bank/e-wallet
└────────┬────────┘
         ↓
┌─────────────────┐
│ 3. Create Bill  │ → Generate payment and get redirect URL
└────────┬────────┘
         ↓
┌─────────────────┐
│ 4. Verify      │ → Check payment status on return
└─────────────────┘
```

---

## Code Implementation

### Step 1: Fetch Available Banks

The LeanX API has different response structures for B2C and B2B accounts. The solution is to query all combinations in parallel and auto-detect what's available.

```javascript
async function fetchAvailableBanks(authToken) {
  const apiUrl = 'https://api.leanx.io/api/v1/merchant/list-payment-services';

  // Query all possible combinations
  const combinations = [
    { type: 'WEB_PAYMENT', model: 1, label: 'FPX B2C' },
    { type: 'WEB_PAYMENT', model: 2, label: 'FPX B2B' },
    { type: 'DIGITAL_PAYMENT', model: 1, label: 'E-Wallet B2C' },
    { type: 'DIGITAL_PAYMENT', model: 2, label: 'E-Wallet B2B' }
  ];

  let allBanks = [];

  // Execute all queries in parallel
  await Promise.all(combinations.map(async (combo) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({
          payment_type: combo.type,
          payment_status: 'active',
          payment_model_reference_id: combo.model
        })
      });

      const data = await response.json();

      // Parse response (handles multiple response structures)
      let banks = parsePaymentServices(data, combo.type);

      if (banks.length > 0) {
        // Tag banks with metadata
        banks = banks.map(bank => ({
          payment_service_id: bank.payment_service_id,
          payment_service_name: cleanBankName(bank.name || bank.payment_service_name),
          type: combo.type,
          icon: combo.type === 'WEB_PAYMENT' ? 'bank-icon' : 'wallet-icon'
        }));

        allBanks = [...allBanks, ...banks];
      }
    } catch (error) {
      console.warn(`Failed to fetch ${combo.label}:`, error);
    }
  }));

  // Remove duplicates (by payment_service_id)
  return Array.from(
    new Map(allBanks.map(bank => [bank.payment_service_id, bank])).values()
  );
}

// Helper: Parse different response structures
function parsePaymentServices(data, paymentType) {
  let extracted = [];

  // Case 1: Standard array response (common for B2C)
  if (Array.isArray(data.data)) {
    extracted = data.data;
  }
  // Case 2: Nested in payment_services property
  else if (data.data?.payment_services && Array.isArray(data.data.payment_services)) {
    extracted = data.data.payment_services;
  }
  // Case 3: Deep nested structure (common for B2B/Enterprise)
  // Structure: data.data.list.data[0].WEB_PAYMENT or data.data.list.data[0].DIGITAL_PAYMENT
  else if (data.data?.list?.data && Array.isArray(data.data.list.data)) {
    const firstItem = data.data.list.data[0];
    if (firstItem) {
      if (paymentType === 'WEB_PAYMENT' && Array.isArray(firstItem.WEB_PAYMENT)) {
        extracted = firstItem.WEB_PAYMENT;
      } else if (paymentType === 'DIGITAL_PAYMENT' && Array.isArray(firstItem.DIGITAL_PAYMENT)) {
        extracted = firstItem.DIGITAL_PAYMENT;
      }
    }
  }

  return extracted;
}

// Helper: Clean bank names (remove "B2B" suffix)
function cleanBankName(name) {
  return name.replace(/ B2B$/i, '').trim();
}
```

### Step 2: Display Bank Selection UI

```html
<!-- Example: Simple bank selection grid -->
<div id="bank-list" class="bank-grid">
  <!-- Will be populated dynamically -->
</div>

<script>
async function displayBanks() {
  const banks = await fetchAvailableBanks(YOUR_AUTH_TOKEN);
  const container = document.getElementById('bank-list');

  if (banks.length === 0) {
    container.innerHTML = '<p>No payment methods available</p>';
    return;
  }

  container.innerHTML = banks.map(bank => `
    <button
      class="bank-button"
      onclick="selectBank(${bank.payment_service_id}, '${bank.payment_service_name}')"
    >
      <i class="${bank.icon}"></i>
      <span>${bank.payment_service_name}</span>
    </button>
  `).join('');
}

let selectedBankId = null;
let selectedBankName = '';

function selectBank(id, name) {
  selectedBankId = id;
  selectedBankName = name;

  // Update UI to show selection
  document.querySelectorAll('.bank-button').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.closest('.bank-button').classList.add('selected');
}
</script>

<style>
.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.bank-button {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.bank-button:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.bank-button.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}
</style>
```

### Step 3: Create Payment (Silent Bill)

```javascript
async function createPayment(authToken, collectionUuid, orderDetails) {
  if (!selectedBankId) {
    alert('Please select a payment method');
    return;
  }

  // Generate unique invoice reference
  const invoiceRef = `INV-${Date.now()}`;

  // Store invoice reference for verification later
  localStorage.setItem('last_invoice_ref', invoiceRef);

  const payload = {
    collection_uuid: collectionUuid,
    payment_service_id: selectedBankId,
    amount: orderDetails.amount.toFixed(2), // Must be string with 2 decimals
    invoice_ref: invoiceRef,
    full_name: orderDetails.customerName,
    email: orderDetails.customerEmail,
    phone_number: orderDetails.customerPhone,
    redirect_url: window.location.origin + '/payment-return',
    callback_url: window.location.origin + '/api/payment-callback' // Your webhook endpoint
  };

  try {
    const response = await fetch(
      'https://api.leanx.io/api/v1/merchant/create-bill-silent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.response_code === 2000 && data.data?.redirect_url) {
      // Success - redirect user to bank
      window.location.href = data.data.redirect_url;
    } else {
      // Error handling
      const errorMsg = data.message || data.description || 'Payment creation failed';
      alert(`Error: ${errorMsg}`);
      console.error('Payment creation error:', data);
    }

  } catch (error) {
    console.error('Network error:', error);
    alert('Unable to connect to payment gateway. Please try again.');
  }
}

// Example usage
const orderDetails = {
  amount: 99.00,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '0123456789'
};

createPayment(YOUR_AUTH_TOKEN, YOUR_COLLECTION_UUID, orderDetails);
```

---

## Payment Verification

After the customer completes (or cancels) payment at the bank, they are redirected back to your `redirect_url`. You need to verify the payment status.

### Method 1: URL Parameters (Primary)

Some banks append status parameters to the redirect URL:

```javascript
// On your payment return page
function checkPaymentFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Check various possible parameter names
  const status = params.get('status') ||
                 params.get('bill_status') ||
                 params.get('response_code') ||
                 params.get('status_id');

  // Success indicators
  const successValues = ['1', '00', 'success', 'SUCCESS', '2000'];
  const isSuccess = successValues.some(val => status?.includes(val));

  if (isSuccess) {
    showSuccessPage();
  } else if (status) {
    showFailurePage();
  } else {
    // No status in URL - use fallback method
    verifyPaymentManually();
  }
}
```

### Method 2: Manual Verification (Fallback)

If URL parameters are missing, verify using the invoice reference:

```javascript
async function verifyPaymentManually() {
  const invoiceRef = localStorage.getItem('last_invoice_ref');

  if (!invoiceRef) {
    showFailurePage();
    return;
  }

  try {
    const verifyUrl = `https://api.leanx.io/api/v1/merchant/manual-checking-transaction?invoice_no=${invoiceRef}`;

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': YOUR_AUTH_TOKEN
      }
    });

    const data = await response.json();

    // Check response structure
    if (data?.data?.transaction_details?.invoice_status === 'SUCCESS') {
      showSuccessPage(data.data.transaction_details);
    } else {
      showFailurePage();
    }

    // Clean up stored reference
    localStorage.removeItem('last_invoice_ref');

  } catch (error) {
    console.error('Verification failed:', error);
    showFailurePage();
  }
}
```

### Method 3: Webhook Callback (Server-Side)

LeanX sends a POST request to your `callback_url` with a JWT payload:

```javascript
// Backend endpoint (Node.js example)
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

app.post('/api/payment-callback', express.json(), (req, res) => {
  try {
    // The payload is a JWT string
    const token = req.body.token || req.body;

    // Verify and decode using your Hash Key
    const decoded = jwt.verify(token, YOUR_HASH_KEY);

    console.log('Payment callback:', decoded);

    // decoded structure:
    // {
    //   invoice_no: "BP1701155880uBMwB9q0",
    //   invoice_status: "SUCCESS", // or "FAILED" or "PENDING"
    //   amount: "456.20",
    //   fpx_transaction_id: "2505061440020644"
    // }

    if (decoded.invoice_status === 'SUCCESS') {
      // Update your database
      updateOrderStatus(decoded.invoice_no, 'paid', decoded);
    } else {
      updateOrderStatus(decoded.invoice_no, 'failed', decoded);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Callback verification failed:', error);
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

---

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **"Authentication Failed"** | Invalid or expired Auth Token | Verify token from portal; regenerate if needed |
| **"0 Active Banks"** | Querying wrong payment model | Use the parallel query method (queries all models) |
| **"Validation Failed"** | Missing or invalid parameters | Check `payment_model_reference_id` is 1 or 2 |
| **"Collection not found"** | Invalid Collection UUID | Verify UUID from Collections page in portal |
| **CORS Error** | Direct API call from browser | Implement backend proxy for production |
| **No redirect URL in response** | Payment creation failed | Check response for error messages |

### Implementation: Robust Error Display

```javascript
function handlePaymentError(error, data) {
  let message = 'An error occurred. Please try again.';

  // Parse API error
  if (data?.description) {
    message = data.description;
  } else if (data?.message) {
    message = data.message;
  } else if (data?.error?.message) {
    message = data.error.message;
  }

  // Authentication errors
  if (message.toLowerCase().includes('auth') || message.toLowerCase().includes('token')) {
    message = 'Authentication error. Please contact support.';
  }

  // Display to user
  showErrorModal(message);

  // Log for debugging
  console.error('Payment Error:', {
    error,
    response: data,
    timestamp: new Date().toISOString()
  });
}
```

---

## Testing

### Test Checklist

#### 1. Bank List Fetching
- [ ] All active banks appear in the list
- [ ] Both FPX and E-Wallet options show (if enabled)
- [ ] B2B banks appear (if applicable)
- [ ] Loading state displays during fetch
- [ ] Error message shows if fetch fails

#### 2. Payment Creation
- [ ] Selected bank is highlighted
- [ ] Amount displays correctly with 2 decimals
- [ ] Customer details are captured
- [ ] Invoice reference is unique each time
- [ ] Redirect to bank occurs successfully

#### 3. Payment Verification
- [ ] Success URL redirect works
- [ ] Failed payment shows appropriate message
- [ ] Manual verification works when URL params missing
- [ ] Webhook callback processes correctly
- [ ] Order status updates in database

#### 4. Edge Cases
- [ ] No bank selected error handling
- [ ] Invalid credentials error display
- [ ] Network timeout handling
- [ ] User cancels at bank page
- [ ] Duplicate payment prevention

### Test Data

For testing, use small amounts (RM 1.00 - RM 10.00) and test with:
- Different banks (Maybank, CIMB, Public Bank)
- Both success and cancel flows
- E-Wallet payments (if enabled)

---

## Production Checklist

Before going live, ensure:

### Security
- [ ] API calls proxied through backend (for consumer apps)
- [ ] Auth Token stored securely (environment variables)
- [ ] Webhook signature verification implemented
- [ ] HTTPS enabled on all endpoints
- [ ] Input validation on customer details

### Reliability
- [ ] Error handling for all API calls
- [ ] Logging for payment transactions
- [ ] Retry logic for verification failures
- [ ] Timeout handling (30-60 seconds)
- [ ] Database transactions for order updates

### User Experience
- [ ] Loading indicators during API calls
- [ ] Clear error messages
- [ ] Mobile-responsive design
- [ ] Success/failure pages styled
- [ ] Email confirmations sent

### Compliance
- [ ] Privacy policy updated
- [ ] Terms of service mention payment provider
- [ ] Receipt generation
- [ ] Refund process documented

---

## Complete Integration Example (React)

Here's a complete React component implementing all the steps:

```jsx
import React, { useState, useEffect } from 'react';

const LeanXCheckout = ({ orderDetails, onSuccess, onCancel }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const LEANX_CONFIG = {
    authToken: process.env.REACT_APP_LEANX_AUTH_TOKEN,
    collectionUuid: process.env.REACT_APP_LEANX_COLLECTION_UUID,
    apiUrl: 'https://api.leanx.io/api/v1/merchant'
  };

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    setError('');

    try {
      const combinations = [
        { type: 'WEB_PAYMENT', model: 1 },
        { type: 'WEB_PAYMENT', model: 2 },
        { type: 'DIGITAL_PAYMENT', model: 1 },
        { type: 'DIGITAL_PAYMENT', model: 2 }
      ];

      const results = await Promise.all(
        combinations.map(combo =>
          fetch(`${LEANX_CONFIG.apiUrl}/list-payment-services`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': LEANX_CONFIG.authToken
            },
            body: JSON.stringify({
              payment_type: combo.type,
              payment_status: 'active',
              payment_model_reference_id: combo.model
            })
          })
          .then(res => res.json())
          .then(data => parsePaymentServices(data, combo.type))
          .catch(() => [])
        )
      );

      const allBanks = results.flat();
      const uniqueBanks = Array.from(
        new Map(allBanks.map(b => [b.payment_service_id, b])).values()
      );

      setBanks(uniqueBanks);

      if (uniqueBanks.length === 0) {
        setError('No payment methods available. Please contact support.');
      }
    } catch (err) {
      setError('Failed to load payment methods. Please refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parsePaymentServices = (data, type) => {
    let extracted = [];

    if (Array.isArray(data.data)) {
      extracted = data.data;
    } else if (data.data?.payment_services) {
      extracted = data.data.payment_services;
    } else if (data.data?.list?.data?.[0]) {
      const first = data.data.list.data[0];
      extracted = first[type] || [];
    }

    return extracted.map(bank => ({
      payment_service_id: bank.payment_service_id,
      payment_service_name: (bank.name || bank.payment_service_name).replace(/ B2B$/i, '').trim(),
      type,
      icon: type === 'WEB_PAYMENT' ? '🏦' : '💳'
    }));
  };

  const handlePayment = async () => {
    if (!selectedBank) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    const invoiceRef = `INV-${Date.now()}`;
    localStorage.setItem('last_invoice_ref', invoiceRef);

    try {
      const response = await fetch(
        `${LEANX_CONFIG.apiUrl}/create-bill-silent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': LEANX_CONFIG.authToken
          },
          body: JSON.stringify({
            collection_uuid: LEANX_CONFIG.collectionUuid,
            payment_service_id: selectedBank.payment_service_id,
            amount: orderDetails.amount.toFixed(2),
            invoice_ref: invoiceRef,
            full_name: orderDetails.customerName,
            email: orderDetails.customerEmail,
            phone_number: orderDetails.customerPhone,
            redirect_url: `${window.location.origin}/payment-return`,
            callback_url: `${window.location.origin}/api/payment-callback`
          })
        }
      );

      const data = await response.json();

      if (data.response_code === 2000 && data.data?.redirect_url) {
        window.location.href = data.data.redirect_url;
      } else {
        setError(data.message || data.description || 'Payment creation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leanx-checkout">
      <h2>Select Payment Method</h2>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {loading ? (
        <div className="loading">Loading payment methods...</div>
      ) : (
        <div className="bank-grid">
          {banks.map(bank => (
            <button
              key={bank.payment_service_id}
              className={`bank-option ${selectedBank?.payment_service_id === bank.payment_service_id ? 'selected' : ''}`}
              onClick={() => setSelectedBank(bank)}
            >
              <span className="bank-icon">{bank.icon}</span>
              <span className="bank-name">{bank.payment_service_name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="actions">
        <button onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={loading || !selectedBank}
          className="primary"
        >
          {loading ? 'Processing...' : `Pay RM ${orderDetails.amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default LeanXCheckout;
```

---

## Additional Resources

### Official Documentation
- LeanX Merchant Portal: [https://merchant.leanx.io](https://merchant.leanx.io)
- API Documentation: Contact LeanX support

### Payment Types Reference

| Type | Description | Common Providers |
|------|-------------|------------------|
| `WEB_PAYMENT` | FPX Online Banking | Maybank2u, CIMB Clicks, Public Bank, RHB Now, Hong Leong Connect |
| `DIGITAL_PAYMENT` | E-Wallets | Touch 'n Go, GrabPay, Boost, ShopeePay |
| `GLOBAL_CARD_PAYMENT` | Credit/Debit Cards | Visa, Mastercard (requires separate setup) |

### Payment Models

| Model ID | Type | Description |
|----------|------|-------------|
| `1` | B2C | Business to Consumer (personal bank accounts) |
| `2` | B2B | Business to Business (corporate accounts) |

---

## Support

For implementation issues:
1. Check the error logs and response payloads
2. Verify credentials in LeanX Portal
3. Test with the manual verification endpoint
4. Contact LeanX support with invoice references

---

**Document Version:** 1.0
**Last Updated:** 2026-01-13
**Tested With:** LeanX API v1
