# Building a LeanX Payment Settings Page - Step-by-Step Guide

## Table of Contents
1. [Overview](#overview)
2. [Page Structure](#page-structure)
3. [HTML Implementation](#html-implementation)
4. [CSS Styling](#css-styling)
5. [JavaScript Functionality](#javascript-functionality)
6. [Testing Integration](#testing-integration)
7. [Complete Code Example](#complete-code-example)

---

## Overview

This guide shows you how to create a payment settings configuration page where users can:
- Enable/disable the LeanX payment gateway
- Select environment (Test/Live)
- Enter API credentials (Collection UUID, Auth Token, Hash Key)
- Save settings to localStorage
- Launch a test checkout to verify the integration

### Features
- Toggle switch for enabling payment gateway
- Form validation
- Local storage persistence
- Test checkout button
- Clean, professional UI matching the screenshot

---

## Page Structure

The payment settings page consists of these key components:

```
┌─────────────────────────────────────────┐
│  Payment Settings                       │
│                    [Save] [Test Checkout]│
├─────────────────────────────────────────┤
│                                          │
│  [Icon] LeanX Gateway            [Toggle]│
│         Secure FPX & Bank processing.    │
│                                          │
│  Environment:        Collection UUID:    │
│  [Live Production ▼] [Dc-...]           │
│                                          │
│  Auth Token:                             │
│  [LP-.................................]  │
│                                          │
│  Hash Key:                               │
│  [c2d2................................]  │
│                                          │
│  ℹ️ Ready to Transact                    │
│  This configuration allows you to...     │
│                                          │
└─────────────────────────────────────────┘
```

---

## HTML Implementation

### Complete HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeanX Payment Settings</title>
    <link rel="stylesheet" href="payment-settings.css">
    <!-- Optional: RemixIcon for icons -->
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
</head>
<body>
    <div class="settings-container">
        <!-- Header -->
        <div class="settings-header">
            <h1 class="settings-title">Payment Settings</h1>
            <div class="settings-actions">
                <button id="saveBtn" class="btn btn-secondary">
                    <i class="ri-save-line"></i>
                    Save Settings
                </button>
                <button id="testCheckoutBtn" class="btn btn-primary">
                    <i class="ri-play-circle-line"></i>
                    Launch Test Checkout
                </button>
            </div>
        </div>

        <!-- Settings Card -->
        <div class="settings-card">
            <!-- Gateway Header with Toggle -->
            <div class="gateway-header">
                <div class="gateway-info">
                    <div class="gateway-icon">
                        <i class="ri-secure-payment-line"></i>
                    </div>
                    <div class="gateway-text">
                        <h3>LeanX Gateway</h3>
                        <p>Secure FPX & Bank processing.</p>
                    </div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="enableGateway" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Configuration Form (shown when enabled) -->
            <div id="configForm" class="config-form">
                <div class="form-row">
                    <!-- Environment -->
                    <div class="form-group">
                        <label for="environment">Environment</label>
                        <select id="environment" class="form-select">
                            <option value="test">Test Mode (Sandbox)</option>
                            <option value="live" selected>Live Production</option>
                        </select>
                    </div>

                    <!-- Collection UUID -->
                    <div class="form-group">
                        <label for="collectionUuid">Collection UUID</label>
                        <input
                            type="text"
                            id="collectionUuid"
                            class="form-input"
                            placeholder="Dc-..."
                        >
                    </div>
                </div>

                <!-- Auth Token -->
                <div class="form-group">
                    <label for="authToken">Auth Token</label>
                    <textarea
                        id="authToken"
                        class="form-textarea"
                        rows="3"
                        placeholder="LP-..."
                    ></textarea>
                </div>

                <!-- Hash Key -->
                <div class="form-group">
                    <label for="hashKey">Hash Key</label>
                    <input
                        type="text"
                        id="hashKey"
                        class="form-input"
                        placeholder="c2d2..."
                    >
                </div>

                <!-- Info Box -->
                <div class="info-box">
                    <i class="ri-information-line"></i>
                    <div>
                        <strong>Ready to Transact</strong>
                        <p>This configuration allows you to fetch bank lists directly and process payments via the Lean.x API.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="payment-settings.js"></script>
</body>
</html>
```

---

## CSS Styling

### Complete CSS (payment-settings.css)

```css
/* Reset & Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f9fafb;
    color: #1f2937;
    padding: 40px 20px;
}

/* Container */
.settings-container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Header */
.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.settings-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
}

.settings-actions {
    display: flex;
    gap: 12px;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn i {
    font-size: 18px;
}

.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

.btn-primary {
    background: #6366f1;
    color: white;
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25);
}

.btn-primary:hover {
    background: #4f46e5;
    box-shadow: 0 6px 10px rgba(99, 102, 241, 0.35);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Settings Card */
.settings-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Gateway Header */
.gateway-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #f3f4f6;
}

.gateway-info {
    display: flex;
    gap: 16px;
    align-items: center;
}

.gateway-icon {
    width: 56px;
    height: 56px;
    background: #eef2ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
    font-size: 28px;
}

.gateway-text h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
}

.gateway-text p {
    font-size: 14px;
    color: #6b7280;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 56px;
    height: 32px;
    flex-shrink: 0;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: 0.3s;
    border-radius: 34px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: #111827;
}

input:checked + .toggle-slider:before {
    transform: translateX(24px);
}

/* Configuration Form */
.config-form {
    animation: slideDown 0.3s ease-out;
}

.config-form.hidden {
    display: none;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.form-input,
.form-select,
.form-textarea {
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #1f2937;
    transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-textarea {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    resize: vertical;
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: #9ca3af;
}

/* Info Box */
.info-box {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #dbeafe;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    color: #1e40af;
    font-size: 14px;
    margin-top: 24px;
}

.info-box i {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
}

.info-box strong {
    display: block;
    margin-bottom: 4px;
}

.info-box p {
    color: #1e3a8a;
    opacity: 0.9;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
    .settings-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .settings-actions {
        width: 100%;
    }

    .settings-actions .btn {
        flex: 1;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .gateway-header {
        flex-direction: column;
        gap: 20px;
    }
}

/* Notification Toast (optional) */
.toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInUp 0.3s ease-out;
    z-index: 1000;
}

.toast.error {
    background: #ef4444;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## JavaScript Functionality

### Complete JavaScript (payment-settings.js)

```javascript
// DOM Elements
const enableGateway = document.getElementById('enableGateway');
const configForm = document.getElementById('configForm');
const environmentSelect = document.getElementById('environment');
const collectionUuidInput = document.getElementById('collectionUuid');
const authTokenInput = document.getElementById('authToken');
const hashKeyInput = document.getElementById('hashKey');
const saveBtn = document.getElementById('saveBtn');
const testCheckoutBtn = document.getElementById('testCheckoutBtn');

// LocalStorage key
const STORAGE_KEY = 'leanx_payment_settings';

// Initialize: Load saved settings
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Toggle gateway enable/disable
    enableGateway.addEventListener('change', (e) => {
        if (e.target.checked) {
            configForm.classList.remove('hidden');
        } else {
            configForm.classList.add('hidden');
        }
    });

    // Save settings button
    saveBtn.addEventListener('click', saveSettings);

    // Test checkout button
    testCheckoutBtn.addEventListener('click', launchTestCheckout);

    // Auto-save on input change (optional)
    [environmentSelect, collectionUuidInput, authTokenInput, hashKeyInput].forEach(input => {
        input.addEventListener('blur', autoSave);
    });
}

// Load Settings from LocalStorage
function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const settings = JSON.parse(saved);

            // Populate form fields
            enableGateway.checked = settings.enabled !== false; // default to true
            environmentSelect.value = settings.mode || 'live';
            collectionUuidInput.value = settings.collectionUuid || '';
            authTokenInput.value = settings.authToken || '';
            hashKeyInput.value = settings.hashKey || '';

            // Show/hide form based on enabled state
            if (!enableGateway.checked) {
                configForm.classList.add('hidden');
            }

            console.log('Settings loaded successfully');
        } else {
            console.log('No saved settings found');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showToast('Failed to load settings', 'error');
    }
}

// Save Settings to LocalStorage
function saveSettings() {
    try {
        // Validate required fields if gateway is enabled
        if (enableGateway.checked) {
            const collectionUuid = collectionUuidInput.value.trim();
            const authToken = authTokenInput.value.trim();
            const hashKey = hashKeyInput.value.trim();

            if (!collectionUuid || !authToken || !hashKey) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Validate format (basic)
            if (!collectionUuid.startsWith('Dc-') && !collectionUuid.startsWith('CL-')) {
                showToast('Invalid Collection UUID format', 'error');
                return;
            }

            if (!authToken.startsWith('LP-')) {
                showToast('Invalid Auth Token format', 'error');
                return;
            }
        }

        // Create settings object
        const settings = {
            enabled: enableGateway.checked,
            mode: environmentSelect.value,
            collectionUuid: collectionUuidInput.value.trim(),
            authToken: authTokenInput.value.trim(),
            hashKey: hashKeyInput.value.trim(),
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        // Show success message
        showToast('Settings saved successfully!', 'success');

        console.log('Settings saved:', settings);

    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Failed to save settings', 'error');
    }
}

// Auto-save (optional feature)
function autoSave() {
    // Only auto-save if settings already exist
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
        saveSettings();
    }
}

// Launch Test Checkout
function launchTestCheckout() {
    try {
        // Load current settings
        const settings = {
            enabled: enableGateway.checked,
            mode: environmentSelect.value,
            collectionUuid: collectionUuidInput.value.trim(),
            authToken: authTokenInput.value.trim(),
            hashKey: hashKeyInput.value.trim()
        };

        // Validate
        if (!settings.enabled) {
            showToast('Please enable the payment gateway first', 'error');
            return;
        }

        if (!settings.collectionUuid || !settings.authToken) {
            showToast('Please fill in Collection UUID and Auth Token', 'error');
            return;
        }

        // Save settings first
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        // Open test checkout
        // Option 1: Open modal (if you have a modal implementation)
        // openCheckoutModal();

        // Option 2: Navigate to test page
        window.location.href = 'test-checkout.html';

        // Option 3: Log to console (for debugging)
        console.log('Test Checkout launched with settings:', settings);

    } catch (error) {
        console.error('Error launching test checkout:', error);
        showToast('Failed to launch test checkout', 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `
        <i class="ri-${type === 'error' ? 'error-warning' : 'checkbox-circle'}-line"></i>
        <span>${message}</span>
    `;

    // Add to document
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export settings for use in other pages
function getPaymentSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
}

// Make available globally
window.LeanXSettings = {
    get: getPaymentSettings,
    save: saveSettings
};
```

---

## Testing Integration

### Create a Test Checkout Page (test-checkout.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Checkout - LeanX</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb;
            padding: 40px 20px;
        }
        .checkout-container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .checkout-header {
            text-align: center;
            margin-bottom: 32px;
        }
        .bank-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }
        .bank-btn {
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
        }
        .bank-btn:hover {
            border-color: #6366f1;
            background: #eef2ff;
        }
        .bank-btn.selected {
            border-color: #6366f1;
            background: #dbeafe;
        }
        .pay-btn {
            width: 100%;
            padding: 16px;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
        .pay-btn:hover {
            background: #4f46e5;
        }
        .pay-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .loading {
            text-align: center;
            padding: 20px;
        }
        .error {
            background: #fee2e2;
            color: #991b1b;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        .settings-info {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="checkout-container">
        <div class="checkout-header">
            <h2>Test Checkout</h2>
            <p style="color: #6b7280; font-size: 14px;">Amount: RM 10.00</p>
        </div>

        <div class="settings-info" id="settingsInfo"></div>

        <div id="errorBox" class="error" style="display: none;"></div>

        <div id="loadingBox" class="loading" style="display: none;">
            Loading payment methods...
        </div>

        <div id="bankList" class="bank-grid"></div>

        <button id="payBtn" class="pay-btn" disabled>
            Pay RM 10.00
        </button>
    </div>

    <script>
        // Get settings from localStorage
        const settings = JSON.parse(localStorage.getItem('leanx_payment_settings'));

        // Display settings info
        document.getElementById('settingsInfo').innerHTML = `
            <strong>Using Settings:</strong><br>
            Mode: ${settings?.mode || 'N/A'}<br>
            UUID: ${settings?.collectionUuid?.substring(0, 10)}...
        `;

        let selectedBank = null;

        // Fetch banks on load
        fetchBanks();

        async function fetchBanks() {
            if (!settings || !settings.authToken) {
                showError('No payment settings found. Please configure settings first.');
                return;
            }

            document.getElementById('loadingBox').style.display = 'block';

            try {
                const apiUrl = 'https://api.leanx.io/api/v1/merchant/list-payment-services';

                // Try multiple combinations
                const combinations = [
                    { type: 'WEB_PAYMENT', model: 1 },
                    { type: 'WEB_PAYMENT', model: 2 },
                    { type: 'DIGITAL_PAYMENT', model: 1 },
                    { type: 'DIGITAL_PAYMENT', model: 2 }
                ];

                const results = await Promise.all(
                    combinations.map(combo =>
                        fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': settings.authToken
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

                displayBanks(uniqueBanks);

            } catch (error) {
                showError('Failed to fetch banks: ' + error.message);
            } finally {
                document.getElementById('loadingBox').style.display = 'none';
            }
        }

        function parsePaymentServices(data, type) {
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
                type
            }));
        }

        function displayBanks(banks) {
            const container = document.getElementById('bankList');

            if (banks.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">No banks available</p>';
                return;
            }

            container.innerHTML = banks.map(bank => `
                <button class="bank-btn" onclick="selectBank(${bank.payment_service_id}, '${bank.payment_service_name}')">
                    ${bank.payment_service_name}
                </button>
            `).join('');
        }

        function selectBank(id, name) {
            selectedBank = { payment_service_id: id, payment_service_name: name };

            // Update UI
            document.querySelectorAll('.bank-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');

            // Enable pay button
            document.getElementById('payBtn').disabled = false;
        }

        function showError(message) {
            const errorBox = document.getElementById('errorBox');
            errorBox.textContent = message;
            errorBox.style.display = 'block';
        }

        // Pay button handler
        document.getElementById('payBtn').addEventListener('click', async () => {
            if (!selectedBank) {
                showError('Please select a payment method');
                return;
            }

            const invoiceRef = `TEST-${Date.now()}`;
            localStorage.setItem('last_invoice_ref', invoiceRef);

            const payload = {
                collection_uuid: settings.collectionUuid,
                payment_service_id: selectedBank.payment_service_id,
                amount: '10.00',
                invoice_ref: invoiceRef,
                full_name: 'Test User',
                email: 'test@example.com',
                phone_number: '0123456789',
                redirect_url: window.location.origin + '/payment-return.html',
                callback_url: window.location.origin + '/api/callback'
            };

            try {
                const response = await fetch(
                    'https://api.leanx.io/api/v1/merchant/create-bill-silent',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': settings.authToken
                        },
                        body: JSON.stringify(payload)
                    }
                );

                const data = await response.json();

                if (data.response_code === 2000 && data.data?.redirect_url) {
                    // Success - redirect to bank
                    window.location.href = data.data.redirect_url;
                } else {
                    showError('Payment creation failed: ' + (data.message || 'Unknown error'));
                    console.error(data);
                }

            } catch (error) {
                showError('Network error: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## Complete Code Example

### All-in-One Single File Version

For quick testing, here's a single-file version with everything included:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeanX Payment Settings</title>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        /* [Include all CSS from above here] */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            padding: 40px 20px;
        }
        /* [... rest of CSS ...] */
    </style>
</head>
<body>
    <!-- [Include all HTML from above here] -->

    <script>
        // [Include all JavaScript from above here]
    </script>
</body>
</html>
```

---

## Testing Your Implementation

### Step-by-Step Testing Guide

1. **Open the Settings Page**
   - Load `payment-settings.html` in your browser

2. **Enter Your Credentials**
   - Collection UUID: `Dc-XXXXXXXX-Lx`
   - Auth Token: `LP-XXXXXXX-MM|...`
   - Hash Key: `c2d2...`

3. **Click "Save Settings"**
   - Should see success toast notification
   - Settings saved to localStorage

4. **Click "Launch Test Checkout"**
   - Opens test checkout page
   - Fetches available banks
   - Shows bank selection grid

5. **Select a Bank**
   - Click on any bank button
   - Button should highlight

6. **Click "Pay"**
   - Creates payment bill
   - Redirects to bank page
   - Complete payment there

7. **Verify Return**
   - After bank payment, redirected back
   - Check payment status

### Troubleshooting

| Issue | Solution |
|-------|----------|
| No banks showing | Check auth token, try both test and live mode |
| CORS error | Need to proxy through backend or use browser extension |
| Settings not saving | Check browser console for localStorage errors |
| Test button disabled | Fill in all required fields first |

---

## Advanced Features

### Add Real-Time Validation

```javascript
// Add to payment-settings.js

authTokenInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value && !value.startsWith('LP-')) {
        authTokenInput.style.borderColor = '#ef4444';
    } else {
        authTokenInput.style.borderColor = '#d1d5db';
    }
});

collectionUuidInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value && !value.match(/^(Dc-|CL-)/)) {
        collectionUuidInput.style.borderColor = '#ef4444';
    } else {
        collectionUuidInput.style.borderColor = '#d1d5db';
    }
});
```

### Add Export/Import Settings

```javascript
function exportSettings() {
    const settings = localStorage.getItem(STORAGE_KEY);
    if (!settings) {
        showToast('No settings to export', 'error');
        return;
    }

    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leanx-settings.json';
    a.click();
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                localStorage.setItem(STORAGE_KEY, event.target.result);
                loadSettings();
                showToast('Settings imported successfully', 'success');
            } catch (error) {
                showToast('Invalid settings file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
```

---

## Next Steps

After setting up the payment settings page:

1. **Integrate with Main App**: Link the settings page to your main application
2. **Add Backend Proxy**: For production, proxy API calls through your backend
3. **Implement Webhooks**: Set up callback endpoint to receive payment notifications
4. **Add Analytics**: Track successful/failed transactions
5. **Error Logging**: Implement comprehensive error tracking

---

## Resources

- [LeanX Payment Integration Guide](./LEANX_PAYMENT_INTEGRATION_GUIDE.md)
- [RemixIcon Documentation](https://remixicon.com/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Document Version:** 1.0
**Last Updated:** 2026-01-13
**Tested With:** Chrome 120+, Firefox 120+, Safari 17+
