import { google } from 'googleapis';
import { getValidAccessToken } from './oauth/google-oauth';

/**
 * Google Sheets Integration for Lead Forms
 * Supports both:
 * 1. Per-user OAuth (recommended) - each user connects their own Google account
 * 2. Service account (legacy) - single service account for all users
 */

interface LeadData {
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  [key: string]: any; // Custom fields
}

/**
 * Extract Google Sheet ID from various URL formats
 * Supports:
 * - https://docs.google.com/spreadsheets/d/SHEET_ID/edit
 * - https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
 * - SHEET_ID (direct ID)
 */
export function extractSheetId(input: string): string | null {
  if (!input) return null;

  // If it's already just an ID (no slashes or dots)
  if (!/[\/\.]/.test(input) && input.length > 20) {
    return input;
  }

  // Extract from full URL
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Validate that a sheet ID/URL is accessible
 */
export async function validateSheetAccess(
  sheetIdOrUrl: string,
  userId?: string
): Promise<{
  valid: boolean;
  sheetId: string | null;
  error?: string;
}> {
  const sheetId = extractSheetId(sheetIdOrUrl);

  if (!sheetId) {
    return {
      valid: false,
      sheetId: null,
      error: 'Invalid Google Sheet URL or ID',
    };
  }

  try {
    const auth = await getGoogleAuth(userId);
    const sheets = google.sheets({ version: 'v4', auth });

    // Try to get sheet metadata to verify access
    await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    return {
      valid: true,
      sheetId,
    };
  } catch (error: any) {
    console.error('Sheet validation error:', error);

    let errorMessage = 'Unable to access Google Sheet';
    if (error.code === 404) {
      errorMessage = 'Sheet not found. Make sure the sheet exists and is accessible.';
    } else if (error.code === 403) {
      errorMessage = 'Access denied. Please make sure you have access to this sheet.';
    }

    return {
      valid: false,
      sheetId,
      error: errorMessage,
    };
  }
}

/**
 * Get authenticated Google Sheets client
 * Supports both per-user OAuth and service account
 */
async function getGoogleAuth(userId?: string) {
  // Try to use per-user OAuth first (if userId provided)
  if (userId) {
    try {
      const accessToken = await getValidAccessToken(userId);
      if (accessToken) {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        return oauth2Client;
      }
    } catch (error) {
      console.warn('Failed to get user OAuth token, falling back to service account:', error);
    }
  }

  // Fall back to service account (legacy)
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google authentication not configured. Please connect your Google account or configure service account credentials.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

/**
 * Initialize sheet with headers if empty
 */
async function ensureHeaders(
  sheets: any,
  spreadsheetId: string,
  sheetName: string = 'Sheet1'
): Promise<void> {
  try {
    // Check if sheet has data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z1`,
    });

    // If first row is empty, add headers
    if (!response.data.values || response.data.values.length === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Phone',
        'Message',
        'Status',
        'IP Address',
        'Referrer',
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headers],
        },
      });

      // Format header row (bold, background color)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.2,
                      blue: 0.2,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0,
                      },
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      });
    }
  } catch (error) {
    console.error('Error ensuring headers:', error);
    // Non-critical error, continue anyway
  }
}

/**
 * Append lead data to Google Sheet
 */
export async function appendLeadToSheet(
  sheetIdOrUrl: string,
  leadData: LeadData,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const sheetId = extractSheetId(sheetIdOrUrl);

  if (!sheetId) {
    return {
      success: false,
      error: 'Invalid Google Sheet URL or ID',
    };
  }

  try {
    const auth = await getGoogleAuth(userId);
    const sheets = google.sheets({ version: 'v4', auth });

    // Ensure sheet has headers
    await ensureHeaders(sheets, sheetId);

    // Prepare row data
    const row = [
      leadData.timestamp,
      leadData.name,
      leadData.email,
      leadData.phone || '',
      leadData.message || '',
      'New', // Default status
      leadData.ip_address || '',
      leadData.referrer || '',
    ];

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row],
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error appending to Google Sheet:', error);

    let errorMessage = 'Failed to append data to Google Sheet';
    if (error.code === 404) {
      errorMessage = 'Sheet not found';
    } else if (error.code === 403) {
      errorMessage = 'Access denied. Please make sure you have access to this sheet.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get sheet info (title, sheet names)
 */
export async function getSheetInfo(
  sheetIdOrUrl: string,
  userId?: string
): Promise<{
  success: boolean;
  title?: string;
  sheets?: string[];
  error?: string;
}> {
  const sheetId = extractSheetId(sheetIdOrUrl);

  if (!sheetId) {
    return {
      success: false,
      error: 'Invalid Google Sheet URL or ID',
    };
  }

  try {
    const auth = await getGoogleAuth(userId);
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    return {
      success: true,
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map((sheet) => sheet.properties?.title || 'Untitled'),
    };
  } catch (error: any) {
    console.error('Error getting sheet info:', error);

    let errorMessage = 'Unable to access Google Sheet';
    if (error.code === 404) {
      errorMessage = 'Sheet not found';
    } else if (error.code === 403) {
      errorMessage = 'Access denied. Please make sure you have access to this sheet.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
