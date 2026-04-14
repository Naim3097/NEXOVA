# Vercel Deployment Guide

## 1. Environment Variables
Your deployment failed because of missing environment variables and a 'crypto' module issue.

Please go to your Vercel Project Settings > Environment Variables and add the following:

### Required
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Found in Project Settings > API)

### Google OAuth (If using Google Sheets integration)
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `OAUTH_ENCRYPTION_KEY`: A random 32-character string for encrypting tokens. You can generate one with `openssl rand -hex 16` or just type 32 random characters.

## 2. Fixes Applied
- **Fixed `crypto` error**: Updated `next.config.js` to handle Node.js specific modules properly during the build.
- **Fixed `supabaseUrl` error**: Updated `app/api/admin/update-subscription/route.ts` to only initialize Supabase Admin client when the request runs, preventing build-time crashes.

## 3. Next Steps
1. Add the variables in Vercel.
2. Push the changes to GitHub.
3. Vercel will trigger a new deployment automatically.
