# Comprehensive Lean.x Payment Gateway Integration Guide

## 1. Context & Objective
The goal of this integration is to enable the **Canvas Builder** to process payments natively using the **Lean.x** gateway. Unlike standard integrations that redirect users to a generic payment landing page, this implementation uses the **"Silent Bill"** method. This allows the builder to:
1.  Fetch and display the bank list directly within the builder's UI (Checkout Modal).
2.  Allow the user to select their preferred bank (Maybank, CIMB, etc.).
3.  Redirect the user *directly* to that bank's login page, bypassing intermediate screens.

This provides a "White Label" feel for merchants using the platform.

---

## 2. Integration Architecture

### 2.1 Component Structure
The integration logic is primarily housed in `app.jsx`, distributed across two main components:
*   **`PaymentsPanel`**: Where the merchant inputs their API credentials (UUID, Auth Token). Handles validation and persistence.
*   **`CheckoutModal`**: The runtime component that fetches the bank list using the stored credentials and executes the payment transaction.

### 2.2 Data Persistence
Since this is a client-side builder application, we persist sensitive credentials in the browser's `localStorage`.
*   **Storage Key:** `leanx_settings`
*   **Data Structure:**
    ```json
    {
      "enabled": true,
      "mode": "live", // 'test' or 'live'
      "collectionUuid": "...",
      "authToken": "...",
      "hashKey": "..."
    }
    ```
*   **Security Implication:** In a pure frontend app, keys are exposed to the user. This is acceptable here because the *user* is the *merchant* configuring their own store. In a production consumer app, these requests should be proxied through a backend.

---

## 3. The "Auto-Detection" Bank Fetching Strategy (Core Logic)

### 3.1 The Problem: API Fragmentation & "Zero Active Banks"
During development, we discovered a significant fragmentation in the Lean.x API response structures:
1.  **B2C Accounts** (Model ID 1) return a flat array of banks.
2.  **B2B Accounts** (Model ID 2) return a deeply nested object structure.
3.  **Payment Types** (FPX/Web vs E-Wallet/Digital) are separate endpoints/flags.

If a merchant inputs valid credentials but queries the wrong "Model ID" (e.g., querying B2C when they are a B2B merchant), the API returns success (200 OK) but an empty bank list. This led to "0 Active Bank" errors despite valid keys.

### 3.2 The Solution: Parallel "Shotgun" Querying
Instead of forcing the merchant to select technical details (Model ID or Account Type), we implemented an intelligent **Auto-Detection System**.

When the Checkout Modal opens, the application simultaneously queries **4 distinct API combinations** using `Promise.all`:

| Request | Payment Type | Model ID | Target |
| :--- | :--- | :--- | :--- |
| 1 | `WEB_PAYMENT` | `1` | FPX (Online Banking) for B2C |
| 2 | `WEB_PAYMENT` | `2` | FPX (Online Banking) for B2B |
| 3 | `DIGITAL_PAYMENT` | `1` | E-Wallets for B2C |
| 4 | `DIGITAL_PAYMENT` | `2` | E-Wallets for B2B |

### 3.3 Deep Parsing Logic (Code Deep Dive)
The most critical part of the integration is parsing the fragmented responses. We implemented a robust parser that can handle both standard and nested JSON shapes.

**The Code Implementation:**
```javascript
// Inside fetchBanks() in CheckoutModal

const combinations = [ /* The 4 combinations above */ ];

await Promise.all(combinations.map(async (combo) => {
    // 1. Fetch data
    const res = await fetch(apiUrl, { ... });
    const data = await res.json();
    
    // 2. Parser Logic
    let extracted = [];
    
    // CASE A: Standard/Flat Response (Common for B2C)
    if (Array.isArray(data.data)) {
        extracted = data.data; 
    }
    // CASE B: First-level Object Wrapper
    else if (data.data?.payment_services) {
        extracted = data.data.payment_services;
    }
    // CASE C: Deep Nested List (Common for B2B / Enterprise)
    // Structure: data.data.list.data[0].WEB_PAYMENT
    else if (data.data?.list?.data && Array.isArray(data.data.list.data)) {
        const firstItem = data.data.list.data[0];
        if (firstItem) {
            // Dynamically grab key based on request type
            if (combo.type === 'WEB_PAYMENT') extracted = firstItem.WEB_PAYMENT;
            else if (combo.type === 'DIGITAL_PAYMENT') extracted = firstItem.DIGITAL_PAYMENT;
        }
    }

    // 3. Normalization & UI Cleaning
    if (extracted.length > 0) {
        const tagged = extracted.map(b => ({
            payment_service_id: b.payment_service_id,
            // STRIP SUFFIX: Converts "Maybank2u B2B" -> "Maybank2u"
            payment_service_name: (b.name || b.payment_service_name).replace(/ B2B$/i, '').trim(),
            type: combo.type, 
            icon: combo.type === 'WEB_PAYMENT' ? 'ri-bank-line' : 'ri-wallet-3-line'
        }));
        allBanks = [...allBanks, ...tagged];
    }
}));
```

---

## 4. Transaction Flow: The "Silent Bill"

Once the user selects a bank, the application executes the transaction. This is a single-step process from the frontend perspective.

### 4.1 Request Payload
**Endpoint:** `POST https://api.leanx.io/api/v1/merchant/create-bill-silent`

**Payload Construction:**
```javascript
const payload = {
    "collection_uuid": leanxSettings.collectionUuid, // From Settings
    "payment_service_id": selectedBank.id,           // From User Selection
    "amount": product.price,                         // From Product Data
    "invoice_ref": `INV-${Date.now()}`,              // Auto-generated unique ID
    "full_name": formData.name,                      // From Checkout Form
    "email": formData.email,
    "phone_number": formData.phone,
    "redirect_url": window.location.href,            // Helper to return user here
    "callback_url": "..."                            // (Optional in this demo)
};
```

### 4.2 Handling the Redirect & Return (Verification Strategy)
The API responds with a `redirect_url` pointing to the Bank. We append `?payment_return=true` to our own return URL to detect when the user comes back.

**The "Fall-back" Verification Logic:**
Sometimes the redirect URL from the bank drops query parameters (like `status=1`). To ensure reliability, we implemented a 2-step check:

1.  **Step 1: URL Params:** Check for `status=1` or `status=SUCCESS` in the URL.
2.  **Step 2: Manual API Check (Fallback):** If URL params are missing, we use the `invoice_ref` (stored in localStorage before payment) to query the API directly.

```javascript
// POST https://api.leanx.io/api/v1/merchant/manual-checking-transaction?invoice_no=...
const res = await fetch(verifyUrl, { method: 'POST', ... });
if (data.data.transaction_details.invoice_status === 'SUCCESS') {
   // Mark as Success
}
```

### 4.3 Payment Result UI (Success/Fail)
Once the status is confirmed, the application overlays a dedicated result view (`PaymentResultView`) over the builder interface:

*   **Success State:** Displays a green success icon and a "Return to Builder" button. This confirms money has been received.
*   **Failure State:** Displays a red error icon and a "Try Again" button.
*   **Debug Feature:** Crucially, the Failure screen includes a **Debug Info** box. This displays the raw JSON data from the verification process (e.g., specific error messages from the bank or Lean.x), allowing developers to diagnose issues like "Insufficient Funds" or "Cancelled by User" immediately.

---

## 5. Troubleshooting & Status Codes

### Common Issues Solved
1.  **Error: "0 Active Banks"**
    *   **Cause:** Auth Token is valid, but the requested channel (e.g., FPX B2C) is empty.
    *   **Fix:** Our Auto-Detect system solves this by trying *all* channels. If you still see this, the merchant account actually has 0 active banks in the Lean.x dashboard.

2.  **Error: "Validation Failed" (JSON)**
    *   **Cause:** `payment_model_reference_id` is missing or mismatched.
    *   **Fix:** We hardcode `model: 1` and `model: 2` in the parallel fetcher loops to ensure we hit the correct validation eventually.

3.  **UI Issue: Duplicate Banks**
    *   **Cause:** Sometimes "Maybank" appears in both B2C and B2B lists if a merchant has hybrid access.
    *   **Fix:** We deduplicate the final list based on `payment_service_id`.

---

## 6. Glossary of Lean.x Terminology
*   **WEB_PAYMENT:** Refers to FPX / Online Banking (Maybank2u, CIMB Clicks).
*   **DIGITAL_PAYMENT:** Refers to E-Wallets (TnG, GrabPay, Boost).
*   **Collection UUID:** A unique identifier for a specific "store" or revenue bucket within a Lead.x merchant account.
*   **Silent Bill:** A specific API mode where the payment page is skipped, and the URL provided points directly to the bank's login screen.
