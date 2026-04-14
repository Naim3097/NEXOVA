import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { appendLeadToSheet } from '@/lib/google-sheets';

/**
 * Public endpoint for lead form submission
 * No authentication required - this is called from published pages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      project_id,
      element_id,
      customer_name,
      customer_email,
      customer_phone,
      message,
      custom_fields,
    } = body;

    // Validation
    if (!project_id || !element_id || !customer_name || !customer_email) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['project_id', 'element_id', 'customer_name', 'customer_email'],
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key (bypass RLS for insert)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get project details and user_id
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id, id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      console.error('Project not found:', projectError);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get element configuration to check for Google Sheets
    const { data: element, error: elementError } = await supabase
      .from('elements')
      .select('props')
      .eq('id', element_id)
      .eq('project_id', project_id)
      .single();

    if (elementError || !element) {
      console.error('Element not found:', elementError);
      return NextResponse.json(
        { error: 'Lead form element not found' },
        { status: 404 }
      );
    }

    // Extract metadata
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown';
    const user_agent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        user_id: project.user_id,
        project_id: project_id,
        element_id: element_id,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim().toLowerCase(),
        customer_phone: customer_phone?.trim() || null,
        message: message?.trim() || null,
        custom_fields: custom_fields || {},
        ip_address: ip_address,
        user_agent: user_agent,
        referrer: referrer,
        status: 'new',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // Check for duplicate email
      if (insertError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          {
            error: 'You have already submitted this form',
            code: 'DUPLICATE_SUBMISSION',
          },
          { status: 409 }
        );
      }

      console.error('Error inserting lead:', insertError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    // Google Sheets integration (if enabled)
    let sheetsResult = null;
    let sheetsDebugInfo: any = null;
    const props = element.props;

    console.log('Google Sheets config:', {
      enabled: props.google_sheets_enabled,
      hasUrl: !!props.google_sheets_url,
      url: props.google_sheets_url?.substring(0, 50) + '...',
      userId: project.user_id,
    });

    if (props.google_sheets_enabled && props.google_sheets_url) {
      try {
        // Use the project owner's credentials for Google Sheets access
        sheetsResult = await appendLeadToSheet(
          props.google_sheets_url,
          {
            timestamp: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
            name: customer_name,
            email: customer_email,
            phone: customer_phone || '',
            message: message || '',
            ip_address: ip_address,
            referrer: referrer,
          },
          project.user_id // Pass the project owner's user ID
        );

        if (!sheetsResult.success) {
          console.error('Google Sheets append failed:', sheetsResult.error);
          sheetsDebugInfo = {
            attempted: true,
            success: false,
            error: sheetsResult.error,
          };
          // Don't fail the whole request, just log it
        } else {
          sheetsDebugInfo = {
            attempted: true,
            success: true,
          };
        }
      } catch (sheetError) {
        console.error('Google Sheets error:', sheetError);
        sheetsDebugInfo = {
          attempted: true,
          success: false,
          error: sheetError instanceof Error ? sheetError.message : 'Unknown error',
        };
        // Don't fail the whole request
      }
    } else {
      sheetsDebugInfo = {
        attempted: false,
        reason: !props.google_sheets_enabled ? 'Not enabled' : 'No URL configured',
      };
    }

    // Track analytics event
    try {
      await supabase.from('analytics_events').insert({
        project_id: project_id,
        event_type: 'lead_submission',
        session_id: 'unknown', // Can be enhanced later
        metadata: {
          element_id: element_id,
          lead_id: lead.id,
          has_phone: !!customer_phone,
          has_message: !!message,
          google_sheets_enabled: !!props.google_sheets_enabled,
          google_sheets_success: sheetsResult?.success,
        },
      });
    } catch (analyticsError) {
      // Non-critical, continue
      console.error('Analytics error:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your information has been submitted.',
      lead_id: lead.id,
      google_sheets_synced: sheetsResult?.success || false,
      debug: process.env.NODE_ENV === 'development' ? sheetsDebugInfo : undefined,
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
