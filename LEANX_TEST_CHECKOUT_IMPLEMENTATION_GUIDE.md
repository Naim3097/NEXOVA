# LeanX Test Checkout Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture Options](#architecture-options)
3. [Option 1: Modal Implementation](#option-1-modal-implementation)
4. [Option 2: Separate Page Implementation](#option-2-separate-page-implementation)
5. [Bank Fetching Logic](#bank-fetching-logic)
6. [Payment Processing](#payment-processing)
7. [Return & Verification](#return--verification)
8. [Complete Examples](#complete-examples)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The "Launch Test Checkout" feature allows you to test your LeanX payment integration by:
1. Loading saved payment settings from localStorage
2. Fetching available banks/payment methods from LeanX API
3. Displaying a checkout interface with bank selection
4. Creating a test payment transaction
5. Redirecting to the bank for authentication
6. Verifying payment status on return

### User Flow

```
[Settings Page]
    → Click "Launch Test Checkout"
    → [Checkout Modal/Page Opens]
    → Fetches Banks
    → User Selects Bank
    → Click "Pay Now"
    → Redirect to Bank
    → Complete Payment
    → Return to Success/Fail Page
```

---

## Architecture Options

### Option 1: Modal Implementation
**Best for:** Single-page applications, testing within the same page

**Pros:**
- No page reload
- Better UX (stays in context)
- Can integrate with existing modals

**Cons:**
- More complex state management
- Redirect will still leave the page

### Option 2: Separate Page Implementation
**Best for:** Simple setups, standalone testing

**Pros:**
- Simpler implementation
- Easier to debug
- Can be bookmarked

**Cons:**
- Page navigation required
- Need to pass settings between pages

---

## Option 1: Modal Implementation

### Step 1: Add Modal HTML

Add this to your `payment-settings.html` (after the settings card):

```html
<!-- Test Checkout Modal -->
<div id="testCheckoutModal" class="modal-overlay" style="display: none;">
    <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
            <div>
                <h2 class="modal-title">Test Checkout</h2>
                <p class="modal-subtitle">Test Amount: <strong>RM 10.00</strong></p>
            </div>
            <button id="closeModal" class="close-button">
                <i class="ri-close-line"></i>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
            <!-- Settings Info -->
            <div class="settings-preview">
                <div class="settings-preview-item">
                    <span class="label">Environment:</span>
                    <span id="modalEnvironment" class="value">-</span>
                </div>
                <div class="settings-preview-item">
                    <span class="label">Collection UUID:</span>
                    <span id="modalCollectionUuid" class="value">-</span>
                </div>
            </div>

            <!-- Loading State -->
            <div id="modalLoading" class="loading-state">
                <i class="ri-loader-4-line animate-spin"></i>
                <p>Fetching payment methods...</p>
            </div>

            <!-- Error Message -->
            <div id="modalError" class="error-message" style="display: none;">
                <i class="ri-error-warning-line"></i>
                <span id="modalErrorText"></span>
            </div>

            <!-- Bank Selection Grid -->
            <div id="bankSelectionContainer" style="display: none;">
                <label class="section-label">Select Payment Method</label>
                <div id="bankGrid" class="bank-grid">
                    <!-- Banks will be populated here -->
                </div>
            </div>

            <!-- Customer Info (Optional) -->
            <div id="customerInfoContainer" style="display: none;">
                <label class="section-label">Customer Details (Test)</label>
                <div class="customer-form">
                    <input type="text" id="customerName" class="form-input" placeholder="Full Name" value="Test User">
                    <input type="email" id="customerEmail" class="form-input" placeholder="Email" value="test@example.com">
                    <input type="tel" id="customerPhone" class="form-input" placeholder="Phone" value="0123456789">
                </div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
            <button id="cancelCheckout" class="btn btn-secondary">
                Cancel
            </button>
            <button id="processPayment" class="btn btn-primary" disabled>
                <i class="ri-secure-payment-line"></i>
                Pay RM 10.00
            </button>
        </div>
    </div>
</div>
```

### Step 2: Add Modal CSS

Add this to your CSS file:

```css
/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Modal Container */
.modal-container {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Modal Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
}

.modal-subtitle {
    font-size: 14px;
    color: #6b7280;
}

.close-button {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: #f3f4f6;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-button:hover {
    background: #e5e7eb;
    color: #111827;
}

.close-button i {
    font-size: 24px;
}

/* Modal Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

/* Settings Preview */
.settings-preview {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
}

.settings-preview-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
}

.settings-preview-item .label {
    color: #6b7280;
    font-weight: 500;
}

.settings-preview-item .value {
    color: #111827;
    font-family: monospace;
    font-weight: 600;
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
}

.loading-state i {
    font-size: 32px;
    margin-bottom: 12px;
    color: #6366f1;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    font-size: 14px;
}

.error-message i {
    font-size: 20px;
    flex-shrink: 0;
}

/* Section Label */
.section-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
}

/* Bank Grid */
.bank-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
}

.bank-card {
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
}

.bank-card:hover {
    border-color: #6366f1;
    background: #f5f3ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.1);
}

.bank-card.selected {
    border-color: #6366f1;
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.bank-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #6366f1;
}

.bank-card.selected .bank-icon {
    background: #6366f1;
    color: white;
}

.bank-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
}

.bank-type {
    font-size: 10px;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.5px;
}

/* Customer Form */
.customer-form {
    display: grid;
    gap: 12px;
    margin-bottom: 20px;
}

/* Modal Footer */
.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.modal-footer .btn {
    min-width: 120px;
}

/* Responsive */
@media (max-width: 640px) {
    .modal-container {
        max-width: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .bank-grid {
        grid-template-columns: 1fr;
    }
}
```

### Step 3: Add Modal JavaScript

Add this to your JavaScript file:

```javascript
// Modal State
let modalState = {
    isOpen: false,
    banks: [],
    selectedBank: null,
    settings: null
};

// Modal Elements
const modal = document.getElementById('testCheckoutModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelCheckoutBtn = document.getElementById('cancelCheckout');
const processPaymentBtn = document.getElementById('processPayment');
const testCheckoutBtn = document.getElementById('testCheckoutBtn');

// Setup Modal Event Listeners
function setupModalListeners() {
    // Open modal
    testCheckoutBtn.addEventListener('click', openTestCheckout);

    // Close modal
    closeModalBtn.addEventListener('click', closeTestCheckout);
    cancelCheckoutBtn.addEventListener('click', closeTestCheckout);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTestCheckout();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalState.isOpen) {
            closeTestCheckout();
        }
    });

    // Process payment
    processPaymentBtn.addEventListener('click', handlePaymentProcess);
}

// Open Test Checkout Modal
async function openTestCheckout() {
    // Load settings
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!settings || !settings.enabled) {
        showToast('Please enable and configure payment gateway first', 'error');
        return;
    }

    if (!settings.authToken || !settings.collectionUuid) {
        showToast('Missing required credentials', 'error');
        return;
    }

    // Save settings to state
    modalState.settings = settings;
    modalState.isOpen = true;

    // Show modal
    modal.style.display = 'flex';

    // Display settings info
    document.getElementById('modalEnvironment').textContent =
        settings.mode === 'live' ? 'Live Production' : 'Test Mode';
    document.getElementById('modalCollectionUuid').textContent =
        settings.collectionUuid.substring(0, 15) + '...';

    // Fetch banks
    await fetchBanksForModal();
}

// Close Test Checkout Modal
function closeTestCheckout() {
    modal.style.display = 'none';
    modalState.isOpen = false;
    modalState.selectedBank = null;

    // Reset UI
    document.getElementById('modalLoading').style.display = 'flex';
    document.getElementById('modalError').style.display = 'none';
    document.getElementById('bankSelectionContainer').style.display = 'none';
    document.getElementById('customerInfoContainer').style.display = 'none';
    processPaymentBtn.disabled = true;
}

// Fetch Banks for Modal
async function fetchBanksForModal() {
    const loadingEl = document.getElementById('modalLoading');
    const errorEl = document.getElementById('modalError');
    const bankContainer = document.getElementById('bankSelectionContainer');
    const customerContainer = document.getElementById('customerInfoContainer');

    // Show loading
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    bankContainer.style.display = 'none';

    try {
        const apiUrl = 'https://api.leanx.io/api/v1/merchant/list-payment-services';

        // Query all combinations in parallel
        const combinations = [
            { type: 'WEB_PAYMENT', model: 1, label: 'FPX B2C' },
            { type: 'WEB_PAYMENT', model: 2, label: 'FPX B2B' },
            { type: 'DIGITAL_PAYMENT', model: 1, label: 'E-Wallet B2C' },
            { type: 'DIGITAL_PAYMENT', model: 2, label: 'E-Wallet B2B' }
        ];

        const results = await Promise.all(
            combinations.map(combo =>
                fetchPaymentServices(apiUrl, modalState.settings.authToken, combo)
            )
        );

        // Flatten and deduplicate
        const allBanks = results.flat();
        const uniqueBanks = Array.from(
            new Map(allBanks.map(bank => [bank.payment_service_id, bank])).values()
        );

        modalState.banks = uniqueBanks;

        if (uniqueBanks.length === 0) {
            throw new Error('No active payment methods found. Please check your LeanX Portal settings.');
        }

        // Hide loading, show banks
        loadingEl.style.display = 'none';
        bankContainer.style.display = 'block';
        customerContainer.style.display = 'block';

        // Render bank grid
        renderBankGrid(uniqueBanks);

    } catch (error) {
        console.error('Error fetching banks:', error);

        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        document.getElementById('modalErrorText').textContent = error.message;
    }
}

// Fetch Payment Services Helper
async function fetchPaymentServices(apiUrl, authToken, combo) {
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

        // Parse response based on structure
        let banks = [];

        if (Array.isArray(data.data)) {
            banks = data.data;
        } else if (data.data?.payment_services) {
            banks = data.data.payment_services;
        } else if (data.data?.list?.data?.[0]) {
            const firstItem = data.data.list.data[0];
            if (combo.type === 'WEB_PAYMENT' && firstItem.WEB_PAYMENT) {
                banks = firstItem.WEB_PAYMENT;
            } else if (combo.type === 'DIGITAL_PAYMENT' && firstItem.DIGITAL_PAYMENT) {
                banks = firstItem.DIGITAL_PAYMENT;
            }
        }

        // Normalize bank data
        return banks.map(bank => ({
            payment_service_id: bank.payment_service_id,
            payment_service_name: (bank.name || bank.payment_service_name)
                .replace(/ B2B$/i, '')
                .trim(),
            type: combo.type,
            icon: combo.type === 'WEB_PAYMENT' ? 'ri-bank-line' : 'ri-wallet-3-line'
        }));

    } catch (error) {
        console.warn(`Failed to fetch ${combo.label}:`, error);
        return [];
    }
}

// Render Bank Grid
function renderBankGrid(banks) {
    const bankGrid = document.getElementById('bankGrid');

    bankGrid.innerHTML = banks.map(bank => `
        <div class="bank-card" data-bank-id="${bank.payment_service_id}">
            <div class="bank-icon">
                <i class="${bank.icon}"></i>
            </div>
            <div class="bank-name">${bank.payment_service_name}</div>
            <div class="bank-type">${bank.type.replace('_', ' ')}</div>
        </div>
    `).join('');

    // Add click handlers
    bankGrid.querySelectorAll('.bank-card').forEach(card => {
        card.addEventListener('click', () => {
            const bankId = parseInt(card.dataset.bankId);
            selectBank(bankId);
        });
    });
}

// Select Bank
function selectBank(bankId) {
    // Find bank
    const bank = modalState.banks.find(b => b.payment_service_id === bankId);
    if (!bank) return;

    modalState.selectedBank = bank;

    // Update UI
    document.querySelectorAll('.bank-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-bank-id="${bankId}"]`).classList.add('selected');

    // Enable payment button
    processPaymentBtn.disabled = false;
}

// Handle Payment Process
async function handlePaymentProcess() {
    if (!modalState.selectedBank) {
        showToast('Please select a payment method', 'error');
        return;
    }

    // Disable button
    processPaymentBtn.disabled = true;
    processPaymentBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Processing...';

    try {
        // Get customer details
        const customerName = document.getElementById('customerName').value.trim() || 'Test User';
        const customerEmail = document.getElementById('customerEmail').value.trim() || 'test@example.com';
        const customerPhone = document.getElementById('customerPhone').value.trim() || '0123456789';

        // Generate invoice reference
        const invoiceRef = `TEST-${Date.now()}`;

        // Store invoice for later verification
        localStorage.setItem('last_invoice_ref', invoiceRef);

        // Prepare payload
        const payload = {
            collection_uuid: modalState.settings.collectionUuid,
            payment_service_id: modalState.selectedBank.payment_service_id,
            amount: '10.00',
            invoice_ref: invoiceRef,
            full_name: customerName,
            email: customerEmail,
            phone_number: customerPhone,
            redirect_url: `${window.location.origin}${window.location.pathname}?payment_return=true`,
            callback_url: `${window.location.origin}/api/payment-callback`
        };

        console.log('Creating payment with payload:', payload);

        // Create payment
        const response = await fetch(
            'https://api.leanx.io/api/v1/merchant/create-bill-silent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': modalState.settings.authToken
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        console.log('Payment creation response:', data);

        if (data.response_code === 2000 && data.data?.redirect_url) {
            // Success - redirect to bank
            showToast('Redirecting to bank...', 'success');

            setTimeout(() => {
                window.location.href = data.data.redirect_url;
            }, 1000);
        } else {
            throw new Error(data.message || data.description || 'Payment creation failed');
        }

    } catch (error) {
        console.error('Payment error:', error);

        showToast(error.message, 'error');

        // Re-enable button
        processPaymentBtn.disabled = false;
        processPaymentBtn.innerHTML = '<i class="ri-secure-payment-line"></i> Pay RM 10.00';
    }
}

// Initialize modal listeners when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupModalListeners();
});
```

---

## Option 2: Separate Page Implementation

### Create test-checkout.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Checkout - LeanX</title>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .checkout-container {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .checkout-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            text-align: center;
        }

        .checkout-header h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }

        .checkout-header .amount {
            font-size: 42px;
            font-weight: 700;
            margin: 16px 0;
        }

        .checkout-header .description {
            opacity: 0.9;
            font-size: 14px;
        }

        .checkout-body {
            padding: 32px;
        }

        .settings-info {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 13px;
        }

        .settings-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .settings-info-row:last-child {
            margin-bottom: 0;
        }

        .settings-info-label {
            color: #166534;
            font-weight: 600;
        }

        .settings-info-value {
            color: #15803d;
            font-family: monospace;
        }

        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }

        .loading-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        }

        .loading-state i {
            font-size: 48px;
            color: #667eea;
            margin-bottom: 16px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .error-box {
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 16px;
            border-radius: 8px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 24px;
        }

        .error-box i {
            font-size: 24px;
            flex-shrink: 0;
        }

        .bank-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 32px;
        }

        .bank-card {
            padding: 20px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }

        .bank-card:hover {
            border-color: #667eea;
            background: #f5f3ff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .bank-card.selected {
            border-color: #667eea;
            background: #eef2ff;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .bank-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 12px;
            border-radius: 12px;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #667eea;
        }

        .bank-card.selected .bank-icon {
            background: #667eea;
            color: white;
        }

        .bank-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
            font-size: 14px;
        }

        .bank-type {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .customer-form {
            margin-bottom: 32px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }

        .btn {
            flex: 1;
            padding: 16px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }

        .btn-secondary:hover {
            background: #e5e7eb;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        .security-badge {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        @media (max-width: 640px) {
            .bank-grid {
                grid-template-columns: 1fr;
            }

            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="checkout-container">
        <!-- Header -->
        <div class="checkout-header">
            <h1>Test Checkout</h1>
            <div class="amount">RM 10.00</div>
            <div class="description">Testing LeanX Payment Integration</div>
        </div>

        <!-- Body -->
        <div class="checkout-body">
            <!-- Settings Info -->
            <div class="settings-info">
                <div class="settings-info-row">
                    <span class="settings-info-label">Environment:</span>
                    <span id="envDisplay" class="settings-info-value">-</span>
                </div>
                <div class="settings-info-row">
                    <span class="settings-info-label">Collection UUID:</span>
                    <span id="uuidDisplay" class="settings-info-value">-</span>
                </div>
                <div class="settings-info-row">
                    <span class="settings-info-label">Status:</span>
                    <span id="statusDisplay" class="settings-info-value">Loading...</span>
                </div>
            </div>

            <!-- Loading -->
            <div id="loadingState" class="loading-state">
                <i class="ri-loader-4-line"></i>
                <div>Fetching payment methods...</div>
            </div>

            <!-- Error -->
            <div id="errorBox" class="error-box" style="display: none;">
                <i class="ri-error-warning-line"></i>
                <div>
                    <strong>Error</strong>
                    <p id="errorMessage"></p>
                </div>
            </div>

            <!-- Content (hidden initially) -->
            <div id="checkoutContent" style="display: none;">
                <!-- Bank Selection -->
                <div>
                    <div class="section-title">Select Payment Method</div>
                    <div id="bankGrid" class="bank-grid">
                        <!-- Banks populated here -->
                    </div>
                </div>

                <!-- Customer Form -->
                <div class="customer-form">
                    <div class="section-title">Customer Details</div>
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="customerName" class="form-input" value="Test User">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" id="customerEmail" class="form-input" value="test@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" id="customerPhone" class="form-input" value="0123456789">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="window.location.href='payment-settings.html'">
                        <i class="ri-arrow-left-line"></i>
                        Back to Settings
                    </button>
                    <button id="payButton" class="btn btn-primary" disabled>
                        <i class="ri-secure-payment-line"></i>
                        Pay Now
                    </button>
                </div>

                <!-- Security Badge -->
                <div class="security-badge">
                    <i class="ri-shield-check-line"></i>
                    Secured by LeanX Payment Gateway
                </div>
            </div>
        </div>
    </div>

    <script>
        // [JavaScript code will be added in the next section]
    </script>
</body>
</html>
```

### Add JavaScript for Separate Page

Add this inside the `<script>` tag:

```javascript
const STORAGE_KEY = 'leanx_payment_settings';

let state = {
    settings: null,
    banks: [],
    selectedBank: null
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Load settings
    const settings = loadSettings();

    if (!settings) {
        showError('No payment settings found. Please configure settings first.');
        setTimeout(() => {
            window.location.href = 'payment-settings.html';
        }, 3000);
        return;
    }

    state.settings = settings;

    // Display settings info
    displaySettingsInfo(settings);

    // Fetch banks
    await fetchBanks();

    // Setup pay button
    document.getElementById('payButton').addEventListener('click', processPayment);
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        const settings = JSON.parse(saved);

        if (!settings.enabled || !settings.authToken || !settings.collectionUuid) {
            return null;
        }

        return settings;
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

function displaySettingsInfo(settings) {
    document.getElementById('envDisplay').textContent =
        settings.mode === 'live' ? 'Live Production' : 'Test Mode';
    document.getElementById('uuidDisplay').textContent =
        settings.collectionUuid.substring(0, 20) + '...';
}

async function fetchBanks() {
    try {
        document.getElementById('statusDisplay').textContent = 'Fetching banks...';

        const apiUrl = 'https://api.leanx.io/api/v1/merchant/list-payment-services';

        const combinations = [
            { type: 'WEB_PAYMENT', model: 1 },
            { type: 'WEB_PAYMENT', model: 2 },
            { type: 'DIGITAL_PAYMENT', model: 1 },
            { type: 'DIGITAL_PAYMENT', model: 2 }
        ];

        const results = await Promise.all(
            combinations.map(combo => fetchPaymentServices(apiUrl, combo))
        );

        const allBanks = results.flat();
        const uniqueBanks = Array.from(
            new Map(allBanks.map(b => [b.payment_service_id, b])).values()
        );

        if (uniqueBanks.length === 0) {
            throw new Error('No active payment methods found');
        }

        state.banks = uniqueBanks;

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('checkoutContent').style.display = 'block';
        document.getElementById('statusDisplay').textContent = `${uniqueBanks.length} methods available`;

        // Render banks
        renderBanks(uniqueBanks);

    } catch (error) {
        console.error('Error fetching banks:', error);
        showError(error.message);
    }
}

async function fetchPaymentServices(apiUrl, combo) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': state.settings.authToken
            },
            body: JSON.stringify({
                payment_type: combo.type,
                payment_status: 'active',
                payment_model_reference_id: combo.model
            })
        });

        const data = await response.json();

        let banks = [];

        if (Array.isArray(data.data)) {
            banks = data.data;
        } else if (data.data?.payment_services) {
            banks = data.data.payment_services;
        } else if (data.data?.list?.data?.[0]) {
            const first = data.data.list.data[0];
            banks = first[combo.type] || [];
        }

        return banks.map(bank => ({
            payment_service_id: bank.payment_service_id,
            payment_service_name: (bank.name || bank.payment_service_name)
                .replace(/ B2B$/i, '')
                .trim(),
            type: combo.type,
            icon: combo.type === 'WEB_PAYMENT' ? 'ri-bank-line' : 'ri-wallet-3-line'
        }));

    } catch (error) {
        console.warn('Fetch failed for combo:', combo, error);
        return [];
    }
}

function renderBanks(banks) {
    const grid = document.getElementById('bankGrid');

    grid.innerHTML = banks.map(bank => `
        <div class="bank-card" data-bank-id="${bank.payment_service_id}">
            <div class="bank-icon">
                <i class="${bank.icon}"></i>
            </div>
            <div class="bank-name">${bank.payment_service_name}</div>
            <div class="bank-type">${bank.type.replace('_', ' ')}</div>
        </div>
    `).join('');

    // Add click listeners
    grid.querySelectorAll('.bank-card').forEach(card => {
        card.addEventListener('click', () => {
            selectBank(parseInt(card.dataset.bankId));
        });
    });
}

function selectBank(bankId) {
    const bank = state.banks.find(b => b.payment_service_id === bankId);
    if (!bank) return;

    state.selectedBank = bank;

    // Update UI
    document.querySelectorAll('.bank-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-bank-id="${bankId}"]`).classList.add('selected');

    // Enable pay button
    document.getElementById('payButton').disabled = false;
}

async function processPayment() {
    if (!state.selectedBank) {
        alert('Please select a payment method');
        return;
    }

    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    payButton.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> Processing...';

    try {
        const invoiceRef = `TEST-${Date.now()}`;
        localStorage.setItem('last_invoice_ref', invoiceRef);

        const payload = {
            collection_uuid: state.settings.collectionUuid,
            payment_service_id: state.selectedBank.payment_service_id,
            amount: '10.00',
            invoice_ref: invoiceRef,
            full_name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone_number: document.getElementById('customerPhone').value,
            redirect_url: `${window.location.origin}/payment-return.html`,
            callback_url: `${window.location.origin}/api/payment-callback`
        };

        const response = await fetch(
            'https://api.leanx.io/api/v1/merchant/create-bill-silent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': state.settings.authToken
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (data.response_code === 2000 && data.data?.redirect_url) {
            // Success - redirect
            window.location.href = data.data.redirect_url;
        } else {
            throw new Error(data.message || 'Payment creation failed');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('Error: ' + error.message);

        payButton.disabled = false;
        payButton.innerHTML = '<i class="ri-secure-payment-line"></i> Pay Now';
    }
}

function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorBox').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('statusDisplay').textContent = 'Error';
}
    </script>
</body>
</html>
```

---

## Return & Verification

### Create payment-return.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Status - LeanX</title>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .status-container {
            background: white;
            border-radius: 16px;
            padding: 48px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .status-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }

        .status-icon.success {
            background: #d1fae5;
            color: #047857;
        }

        .status-icon.failed {
            background: #fee2e2;
            color: #dc2626;
        }

        .status-icon.loading {
            background: #dbeafe;
            color: #2563eb;
        }

        .status-icon.loading i {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .status-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #111827;
        }

        .status-message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .transaction-details {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 32px;
            text-align: left;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #6b7280;
            font-size: 14px;
        }

        .detail-value {
            color: #111827;
            font-weight: 600;
            font-size: 14px;
            font-family: monospace;
        }

        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .btn {
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: #6366f1;
            color: white;
        }

        .btn-primary:hover {
            background: #4f46e5;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }

        .btn-secondary:hover {
            background: #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="status-container">
        <div id="statusIcon" class="status-icon loading">
            <i class="ri-loader-4-line"></i>
        </div>

        <h1 id="statusTitle" class="status-title">Verifying Payment...</h1>
        <p id="statusMessage" class="status-message">Please wait while we confirm your payment status.</p>

        <div id="transactionDetails" class="transaction-details" style="display: none;">
            <!-- Will be populated -->
        </div>

        <div id="actions" class="actions" style="display: none;">
            <button class="btn btn-secondary" onclick="window.location.href='test-checkout.html'">
                <i class="ri-arrow-left-line"></i>
                Try Again
            </button>
            <button class="btn btn-primary" onclick="window.location.href='payment-settings.html'">
                <i class="ri-home-4-line"></i>
                Back to Settings
            </button>
        </div>
    </div>

    <script>
        const STORAGE_KEY = 'leanx_payment_settings';

        async function verifyPayment() {
            try {
                // Check URL parameters first
                const params = new URLSearchParams(window.location.search);
                const status = params.get('status') || params.get('bill_status') || params.get('response_code');

                const successValues = ['1', '00', 'success', 'SUCCESS', '2000'];
                const isSuccess = successValues.some(val => status?.includes(val));

                if (isSuccess) {
                    showSuccess();
                    return;
                }

                // Fallback: Manual verification
                const invoiceRef = localStorage.getItem('last_invoice_ref');
                if (!invoiceRef) {
                    showFailed('No invoice reference found');
                    return;
                }

                const settings = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (!settings) {
                    showFailed('Settings not found');
                    return;
                }

                // Call verification API
                const verifyUrl = `https://api.leanx.io/api/v1/merchant/manual-checking-transaction?invoice_no=${invoiceRef}`;

                const response = await fetch(verifyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': settings.authToken
                    }
                });

                const data = await response.json();

                if (data?.data?.transaction_details?.invoice_status === 'SUCCESS') {
                    showSuccess(data.data.transaction_details);
                } else {
                    showFailed('Payment was not successful');
                }

                // Clean up
                localStorage.removeItem('last_invoice_ref');

            } catch (error) {
                console.error('Verification error:', error);
                showFailed(error.message);
            }
        }

        function showSuccess(details = {}) {
            const statusIcon = document.getElementById('statusIcon');
            const statusTitle = document.getElementById('statusTitle');
            const statusMessage = document.getElementById('statusMessage');
            const transactionDetails = document.getElementById('transactionDetails');
            const actions = document.getElementById('actions');

            statusIcon.className = 'status-icon success';
            statusIcon.innerHTML = '<i class="ri-checkbox-circle-fill"></i>';

            statusTitle.textContent = 'Payment Successful!';
            statusMessage.textContent = 'Your test payment has been processed successfully.';

            if (details.invoice_no) {
                transactionDetails.innerHTML = `
                    <div class="detail-row">
                        <span class="detail-label">Invoice Number:</span>
                        <span class="detail-value">${details.invoice_no}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value">RM ${details.amount || '10.00'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">${details.invoice_status || 'SUCCESS'}</span>
                    </div>
                    ${details.fpx_transaction_id ? `
                    <div class="detail-row">
                        <span class="detail-label">Transaction ID:</span>
                        <span class="detail-value">${details.fpx_transaction_id}</span>
                    </div>
                    ` : ''}
                `;
                transactionDetails.style.display = 'block';
            }

            actions.style.display = 'flex';
        }

        function showFailed(message) {
            const statusIcon = document.getElementById('statusIcon');
            const statusTitle = document.getElementById('statusTitle');
            const statusMessage = document.getElementById('statusMessage');
            const actions = document.getElementById('actions');

            statusIcon.className = 'status-icon failed';
            statusIcon.innerHTML = '<i class="ri-close-circle-fill"></i>';

            statusTitle.textContent = 'Payment Failed';
            statusMessage.textContent = message || 'The payment was not completed. Please try again.';

            actions.style.display = 'flex';
        }

        // Run verification on load
        document.addEventListener('DOMContentLoaded', verifyPayment);
    </script>
</body>
</html>
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **CORS Error** | Browser blocking API calls | Use backend proxy or browser extension for testing |
| **No banks showing** | Invalid auth token or no active channels | Verify credentials in portal |
| **Modal not opening** | JavaScript errors | Check browser console for errors |
| **Payment creation fails** | Invalid collection UUID | Verify UUID matches portal exactly |
| **Return page shows wrong status** | URL parameters missing | Use manual verification fallback |

### Debug Checklist

1. **Check localStorage:**
   ```javascript
   console.log(localStorage.getItem('leanx_payment_settings'));
   ```

2. **Check API responses:**
   ```javascript
   // Add to fetchPaymentServices function
   console.log('API Response:', data);
   ```

3. **Check selected bank:**
   ```javascript
   console.log('Selected bank:', modalState.selectedBank);
   ```

4. **Check payment payload:**
   ```javascript
   // Add before fetch in handlePaymentProcess
   console.log('Payment payload:', payload);
   ```

---

## Next Steps

After implementing the test checkout:

1. **Test Different Banks**: Try multiple banks to ensure all work
2. **Test E-Wallets**: If enabled, test digital payment methods
3. **Test Failed Payments**: Cancel at bank to test failure flow
4. **Add Error Logging**: Implement comprehensive error tracking
5. **Production Integration**: Move to backend API proxy

---

**Document Version:** 1.0
**Last Updated:** 2026-01-13
**Tested With:** Chrome 120+, Firefox 120+, Safari 17+
