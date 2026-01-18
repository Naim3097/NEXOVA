import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

// Helper to get valid OAuth client with token refresh
async function getValidOAuth2Client(userId: string) {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('ga4_access_token, ga4_refresh_token, ga4_token_expiry')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw new Error('GA4 credentials not found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/ga4/callback`
  );

  oauth2Client.setCredentials({
    access_token: profile.ga4_access_token,
    refresh_token: profile.ga4_refresh_token,
    expiry_date: profile.ga4_token_expiry ? new Date(profile.ga4_token_expiry).getTime() : undefined,
  });

  // Check if token needs refresh
  if (profile.ga4_token_expiry && new Date(profile.ga4_token_expiry) < new Date()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // Update database with new tokens
    await supabase
      .from('profiles')
      .update({
        ga4_access_token: credentials.access_token,
        ga4_token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
      })
      .eq('id', userId);
  }

  return oauth2Client;
}

// GET: List all GA4 properties for the connected account
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if GA4 is connected
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ga4_connected, ga4_property_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.ga4_connected) {
      return NextResponse.json(
        { error: 'Google Analytics not connected' },
        { status: 400 }
      );
    }

    // Get valid OAuth client
    const oauth2Client = await getValidOAuth2Client(user.id);

    // Initialize Analytics Admin API
    const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });

    // Get all accounts
    const accountsResponse = await analyticsAdmin.accounts.list();
    const accounts = accountsResponse.data.accounts || [];

    // Get properties for each account
    const properties: Array<{
      id: string;
      name: string;
      displayName: string;
      accountName: string;
      websiteUrl?: string;
    }> = [];

    for (const account of accounts) {
      if (!account.name) continue;

      const propertiesResponse = await analyticsAdmin.properties.list({
        filter: `parent:${account.name}`,
      });

      const accountProperties = propertiesResponse.data.properties || [];
      for (const property of accountProperties) {
        if (property.name && property.displayName) {
          properties.push({
            id: property.name, // e.g., "properties/435136067"
            name: property.name,
            displayName: property.displayName,
            accountName: account.displayName || 'Unknown Account',
            websiteUrl: property.propertyType === 'PROPERTY_TYPE_ORDINARY'
              ? undefined
              : undefined,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      properties,
      currentPropertyId: profile.ga4_property_id,
    });
  } catch (error) {
    console.error('Error fetching GA4 properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Update the selected GA4 property
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Update the selected property
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ga4_property_id: propertyId })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      propertyId,
    });
  } catch (error) {
    console.error('Error updating GA4 property:', error);
    return NextResponse.json(
      { error: 'Failed to update property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
