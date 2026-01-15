# Google Sheets OAuth Integration Setup Guide

This guide will help you set up per-user Google Sheets integration using OAuth 2.0, allowing each user to connect their own Google account.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Google Cloud Console Setup](#google-cloud-console-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Testing the Integration](#testing-the-integration)
7. [How It Works](#how-it-works)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Google Sheets OAuth integration allows:
- **Per-user authentication**: Each user connects their own Google account
- **Automatic syncing**: Lead form submissions automatically sync to users' Google Sheets
- **No sharing required**: Users don't need to share sheets with service accounts
- **Full control**: Users can revoke access anytime
- **Secure**: Tokens are encrypted and stored securely

---

## ✅ Prerequisites

- Google Cloud Console account
- Supabase project
- Node.js 18+ installed
- Access to modify environment variables

---

## 🚀 Google Cloud Console Setup

### Step 1: Create/Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown (top left)
3. Click **"New Project"** or select an existing one
4. Name your project (e.g., "Page Builder OAuth")
5. Click **"Create"**

### Step 2: Enable Google Sheets API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and click **"Enable"**
4. Also enable **"Google People API"** (for user info)

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: Your app name (e.g., "Product Page Builder")
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**

6. **Add Scopes**:
   - Click **"Add or Remove Scopes"**
   - Add these scopes:
     - `https://www.googleapis.com/auth/spreadsheets`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Click **"Update"**
   - Click **"Save and Continue"**

7. **Test Users** (if in Testing mode):
   - Add test user emails
   - Click **"Save and Continue"**

8. Click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in the details:
   - **Name**: "Page Builder Web Client"
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/oauth/google/callback` (development)
     - `https://yourdomain.com/api/oauth/google/callback` (production)
5. Click **"Create"**
6. **Copy** your **Client ID** and **Client Secret** (you'll need these!)

---

## 🔐 Environment Variables

### 1. Generate Encryption Key

The encryption key must be exactly 32 characters. Generate it using one of these methods:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64').substring(0, 32))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -base64 32 | cut -c1-32
```

### 2. Add to .env.local

Add these variables to your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret-here
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
OAUTH_ENCRYPTION_KEY=your-32-character-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For production**, update to:
```env
GOOGLE_OAUTH_REDIRECT_URI=https://yourdomain.com/api/oauth/google/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🗄️ Database Setup

The database migration has already been applied (`20260116000000_add_google_oauth_integration.sql`).

It creates the `user_integrations` table to store:
- OAuth tokens (encrypted)
- User metadata (email, name, picture)
- Token expiration dates
- Connection status

---

## 🧪 Testing the Integration

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Navigate to Settings

Go to: `http://localhost:3000/dashboard/settings/payments`

### 3. Connect Google Sheets

1. Scroll to the **"Google Sheets"** section
2. Click **"Connect Google Sheets"**
3. You'll be redirected to Google's OAuth consent screen
4. Select your Google account
5. Review the permissions:
   - View and manage your spreadsheets
   - View your email address
   - See your personal info
6. Click **"Allow"**
7. You'll be redirected back to the settings page
8. You should see: ✅ **"Successfully connected to Google Sheets!"**

### 4. Test with a Lead Form

1. Create or edit a project
2. Add a **Lead Form** element
3. In the properties panel:
   - Enable **"Enable Google Sheets"**
   - Enter a Google Sheet URL or ID
   - (The sheet should be in your connected Google account)
4. Publish your page
5. Submit a test lead
6. Check your Google Sheet - the lead should appear!

---

## 🔍 How It Works

### Flow Diagram

```
┌─────────┐     1. Click Connect      ┌──────────────┐
│  User   │ ──────────────────────────▶│ Your App     │
└─────────┘                             └──────────────┘
                                              │
                                              │ 2. Redirect to Google
                                              ▼
                                        ┌──────────────┐
                                        │ Google OAuth │
                                        └──────────────┘
                                              │
                                              │ 3. User authorizes
                                              ▼
┌─────────┐     4. Redirect with code  ┌──────────────┐
│  User   │ ◀──────────────────────────│ Google OAuth │
└─────────┘                             └──────────────┘
     │
     │ 5. Exchange code for tokens
     ▼
┌─────────────────────────────────────────────────────┐
│ Your App                                            │
│                                                     │
│  • Exchange code for access_token + refresh_token  │
│  • Encrypt tokens                                  │
│  • Store in database (user_integrations table)    │
│  • Get user info (email, name, picture)           │
└─────────────────────────────────────────────────────┘
     │
     │ 6. When lead submitted
     ▼
┌─────────────────────────────────────────────────────┐
│ Lead Submission                                     │
│                                                     │
│  • Get project owner's ID                          │
│  • Fetch their OAuth token from database          │
│  • Check if token expired                          │
│  • Refresh token if needed                         │
│  • Use token to write to Google Sheet             │
└─────────────────────────────────────────────────────┘
```

### Security Features

1. **Token Encryption**: All OAuth tokens are encrypted using AES-256-GCM
2. **CSRF Protection**: State parameter prevents cross-site request forgery
3. **Secure Storage**: Tokens stored in database with RLS policies
4. **Auto Refresh**: Expired tokens are automatically refreshed
5. **Scope Limitation**: Only requests minimum required permissions

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **"redirect_uri_mismatch" Error**

**Problem**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
- Check that your `GOOGLE_OAUTH_REDIRECT_URI` exactly matches the URI in Google Cloud Console
- Make sure it includes the full path: `/api/oauth/google/callback`
- Check for trailing slashes (they matter!)

#### 2. **"invalid_client" Error**

**Problem**: Client ID or Client Secret is incorrect.

**Solution**:
- Double-check your `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET`
- Make sure there are no extra spaces or newlines
- Regenerate credentials if needed

#### 3. **"Access denied" When Writing to Sheet**

**Problem**: User doesn't have access to the specified Google Sheet.

**Solution**:
- Make sure the sheet is in the user's Google account
- Check that the sheet URL/ID is correct
- Try creating a new sheet in the connected account

#### 4. **"OAUTH_ENCRYPTION_KEY must be 32 characters"**

**Problem**: Encryption key is not exactly 32 characters.

**Solution**:
- Regenerate the key using the commands in the Environment Variables section
- Make sure the key is exactly 32 characters (not more, not less)

#### 5. **Tokens Not Refreshing**

**Problem**: Access tokens expire and aren't being refreshed.

**Solution**:
- Check server logs for refresh errors
- Make sure the `refresh_token` was saved (user must authorize with `prompt=consent`)
- User may need to reconnect their Google account

### Debugging Tips

1. **Check Server Logs**: Look for OAuth-related errors in your terminal
2. **Check Browser Console**: Look for redirect issues or network errors
3. **Check Database**: Verify tokens are being stored in `user_integrations` table
4. **Test OAuth Flow**: Use Google's OAuth 2.0 Playground to test your credentials

### Getting Help

If you're still having issues:
1. Check the GitHub Issues
2. Review Google's OAuth documentation
3. Contact support with:
   - Error message
   - Steps to reproduce
   - Server logs (remove sensitive info!)

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

## 🎉 Success!

Once everything is set up, users can:
- ✅ Connect their Google account in seconds
- ✅ Use any Google Sheet they have access to
- ✅ Automatically sync lead form submissions
- ✅ Disconnect anytime from settings

**No more sharing sheets with service accounts!** 🎊
