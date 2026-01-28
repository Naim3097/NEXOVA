import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Google OAuth Integration
 * Manages per-user OAuth tokens for Google Sheets access
 */

const ENCRYPTION_KEY = process.env.OAUTH_ENCRYPTION_KEY || '';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data (tokens)
 */
export function encryptToken(token: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('OAUTH_ENCRYPTION_KEY must be 32 characters');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data (tokens)
 */
export function decryptToken(encryptedData: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('OAUTH_ENCRYPTION_KEY must be 32 characters');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Get OAuth2 client configuration
 */
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(state: string): string {
  const oauth2Client = getOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    prompt: 'consent', // Force consent screen to get refresh token
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar.events.owned',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state, // CSRF protection
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}> {
  const oauth2Client = getOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Failed to obtain tokens');
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expiry_date
      ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
      : 3600,
    scope: tokens.scope || '',
    token_type: tokens.token_type || 'Bearer',
  };
}

/**
 * Get user info from Google
 */
export async function getUserInfo(accessToken: string): Promise<{
  email: string;
  name: string;
  picture?: string;
}> {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return {
    email: data.email || '',
    name: data.name || '',
    picture: data.picture || undefined,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  encryptedRefreshToken: string
): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const refreshToken = decryptToken(encryptedRefreshToken);
  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error('Failed to refresh access token');
  }

  return {
    access_token: credentials.access_token,
    expires_in: credentials.expiry_date
      ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
      : 3600,
  };
}

/**
 * Store user OAuth tokens in database
 */
export async function storeUserTokens(
  userId: string,
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  },
  userInfo: {
    email: string;
    name: string;
    picture?: string;
  }
): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const encryptedAccessToken = encryptToken(tokens.access_token);
  const encryptedRefreshToken = encryptToken(tokens.refresh_token);

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await supabase.from('user_integrations').upsert(
    {
      user_id: userId,
      integration_type: 'google_sheets',
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      token_expires_at: expiresAt.toISOString(),
      scope: tokens.scope,
      metadata: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        connected_at: new Date().toISOString(),
      },
      is_active: true,
      last_used_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,integration_type',
    }
  );
}

/**
 * Get user's Google OAuth tokens from database
 */
export async function getUserTokens(userId: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  metadata: any;
} | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('integration_type', 'google_sheets')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    access_token: decryptToken(data.access_token),
    refresh_token: decryptToken(data.refresh_token),
    token_expires_at: data.token_expires_at,
    metadata: data.metadata,
  };
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(
  userId: string
): Promise<string | null> {
  const tokens = await getUserTokens(userId);

  if (!tokens) {
    return null;
  }

  // Check if token is expired or about to expire (5 min buffer)
  const expiresAt = new Date(tokens.token_expires_at);
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes

  if (expiresAt.getTime() - now.getTime() < bufferMs) {
    // Token expired or about to expire, refresh it
    try {
      const encryptedRefreshToken = encryptToken(tokens.refresh_token);
      const refreshed = await refreshAccessToken(encryptedRefreshToken);

      // Update database with new access token
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);

      await supabase
        .from('user_integrations')
        .update({
          access_token: encryptToken(refreshed.access_token),
          token_expires_at: newExpiresAt.toISOString(),
          last_used_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('integration_type', 'google_sheets');

      return refreshed.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  return tokens.access_token;
}

/**
 * Disconnect user's Google Sheets integration
 */
export async function disconnectGoogleSheets(userId: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from('user_integrations')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('integration_type', 'google_sheets');
}
