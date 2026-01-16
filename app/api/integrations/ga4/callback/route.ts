import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/ga4/callback`
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the user ID
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=${error}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=missing_code`
      );
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get GA4 properties
    const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });

    let propertyId: string | null = null;
    try {
      const accountsResponse = await analyticsAdmin.accounts.list();

      if (accountsResponse.data.accounts && accountsResponse.data.accounts.length > 0) {
        const firstAccount = accountsResponse.data.accounts[0];
        const propertiesResponse = await analyticsAdmin.properties.list({
          filter: `parent:${firstAccount.name}`,
        });

        if (propertiesResponse.data.properties && propertiesResponse.data.properties.length > 0) {
          propertyId = propertiesResponse.data.properties[0].name || null;
        }
      }
    } catch (apiError) {
      console.error('Error fetching GA4 properties:', apiError);
      // Continue anyway, user can manually enter property ID later if needed
    }

    // Save tokens to database
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ga4_connected: true,
        ga4_property_id: propertyId,
        ga4_access_token: tokens.access_token,
        ga4_refresh_token: tokens.refresh_token,
        ga4_token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        ga4_connected_at: new Date().toISOString(),
      })
      .eq('id', state);

    if (updateError) {
      console.error('Error saving GA4 tokens:', updateError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=save_failed`
      );
    }

    // Redirect back to integrations page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?ga4_connected=true`
    );
  } catch (error) {
    console.error('Error in GA4 callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=callback_failed`
    );
  }
}
