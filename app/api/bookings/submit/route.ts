import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { appendLeadToSheet } from '@/lib/google-sheets';
import { createCalendarEvent } from '@/lib/google-calendar';

/**
 * Public endpoint for booking form submission
 * No authentication required - this is called from published pages
 * Handles:
 * 1. Customer information (name, phone, email)
 * 2. Booking details (date, time slot, service)
 * 3. Payment integration (optional)
 * 4. Google Sheets integration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      project_id,
      element_id,
      // Customer info
      customer_name,
      customer_phone,
      customer_email,
      customer_remark,
      // Booking details
      booking_date,
      time_slot,
      service_name,
      service_price,
      duration,
      // Payment info (optional)
      payment_status,
      transaction_id,
      payment_method,
    } = body;

    // Validation
    if (!project_id || !element_id) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['project_id', 'element_id'],
        },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        {
          error: 'Missing customer information',
          required: ['customer_name', 'customer_email'],
        },
        { status: 400 }
      );
    }

    if (!booking_date || !time_slot) {
      return NextResponse.json(
        {
          error: 'Missing booking details',
          required: ['booking_date', 'time_slot'],
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
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get element configuration to check for Google Sheets (optional - don't fail if not found)
    // Try to find element by ID first, then by type if ID fails (for template elements)
    let element: any = null;

    // First try exact ID match (for UUIDs)
    const { data: elementById } = await supabase
      .from('elements')
      .select('id, props')
      .eq('id', element_id)
      .eq('project_id', project_id)
      .single();

    if (elementById) {
      element = elementById;
    } else {
      // Fallback: find booking_form element by type for this project
      const { data: elementByType } = await supabase
        .from('elements')
        .select('id, props')
        .eq('type', 'booking_form')
        .eq('project_id', project_id)
        .limit(1)
        .single();

      if (elementByType) {
        element = elementByType;
      }
    }

    // Use element ID from database if found, otherwise use the provided element_id
    // Both bookings and leads tables use TEXT for element_id, so this is safe
    const actualElementId = element?.id || element_id;

    // Extract metadata - ensure valid IP or null for inet type columns
    const rawIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      null;
    // Extract first IP if multiple (x-forwarded-for can be comma-separated)
    const ip_address = rawIp ? rawIp.split(',')[0].trim() : null;
    const user_agent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    // Generate booking reference
    const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Insert booking into database
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id: project.user_id,
        project_id: project_id,
        element_id: actualElementId,
        booking_ref: bookingRef,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim().toLowerCase(),
        customer_phone: customer_phone?.trim() || null,
        customer_remark: customer_remark?.trim() || null,
        booking_date: booking_date,
        time_slot: time_slot,
        service_name: service_name || 'Booking',
        service_price: service_price || 0,
        duration: duration || 60,
        payment_status:
          payment_status || (service_price > 0 ? 'pending' : 'not_required'),
        transaction_id: transaction_id || null,
        payment_method: payment_method || null,
        status: 'confirmed',
        ip_address: ip_address,
        user_agent: user_agent,
        referrer: referrer,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // Check if bookings table doesn't exist - fall back to leads table
      if (insertError.code === '42P01') {
        // Table doesn't exist
        console.log('Bookings table not found, falling back to leads table');

        // Insert into leads table instead with booking data in custom_fields
        const { data: lead, error: leadInsertError } = await supabase
          .from('leads')
          .insert({
            user_id: project.user_id,
            project_id: project_id,
            element_id: actualElementId,
            customer_name: customer_name.trim(),
            customer_email: customer_email.trim().toLowerCase(),
            customer_phone: customer_phone?.trim() || null,
            message: `Booking: ${service_name || 'Appointment'} on ${booking_date} at ${time_slot}${customer_remark ? ` | Notes: ${customer_remark}` : ''}`,
            custom_fields: {
              booking_ref: bookingRef,
              booking_date: booking_date,
              time_slot: time_slot,
              service_name: service_name,
              service_price: service_price,
              duration: duration,
              payment_status: payment_status || 'not_required',
              transaction_id: transaction_id,
              customer_remark: customer_remark || null,
            },
            ip_address: ip_address,
            user_agent: user_agent,
            referrer: referrer,
            status: 'new',
            submitted_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (leadInsertError) {
          console.error('Error inserting booking as lead:', leadInsertError);
          return NextResponse.json(
            { error: 'Failed to save booking' },
            { status: 500 }
          );
        }

        // Continue with Google Sheets & Calendar integration using lead data (if element found)
        if (element?.props) {
          await Promise.all([
            handleGoogleSheetsIntegration(element.props, project.user_id, {
              bookingRef,
              customer_name,
              customer_email,
              customer_phone,
              customer_remark,
              booking_date,
              time_slot,
              service_name,
              service_price,
              duration,
              payment_status,
              ip_address,
              referrer,
            }),
            handleGoogleCalendarIntegration(element.props, project.user_id, {
              bookingRef,
              customer_name,
              customer_email,
              customer_phone,
              customer_remark,
              booking_date,
              time_slot,
              service_name,
              service_price,
              duration,
            }),
          ]);
        }

        // Track analytics event
        await trackAnalyticsEvent(
          supabase,
          project_id,
          actualElementId,
          lead?.id || bookingRef
        );

        return NextResponse.json({
          success: true,
          message: 'Your booking has been confirmed!',
          booking_ref: bookingRef,
          booking_id: lead?.id,
        });
      }

      console.error('Error inserting booking:', insertError);
      return NextResponse.json(
        { error: 'Failed to save booking' },
        { status: 500 }
      );
    }

    // Google Sheets & Calendar integration (if element found)
    if (element?.props) {
      await Promise.all([
        handleGoogleSheetsIntegration(element.props, project.user_id, {
          bookingRef,
          customer_name,
          customer_email,
          customer_phone,
          customer_remark,
          booking_date,
          time_slot,
          service_name,
          service_price,
          duration,
          payment_status,
          ip_address,
          referrer,
        }),
        handleGoogleCalendarIntegration(element.props, project.user_id, {
          bookingRef,
          customer_name,
          customer_email,
          customer_phone,
          customer_remark,
          booking_date,
          time_slot,
          service_name,
          service_price,
          duration,
        }),
      ]);
    }

    // Track analytics event
    await trackAnalyticsEvent(
      supabase,
      project_id,
      actualElementId,
      booking?.id || bookingRef
    );

    return NextResponse.json({
      success: true,
      message: 'Your booking has been confirmed!',
      booking_ref: bookingRef,
      booking_id: booking?.id,
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function for Google Sheets integration
async function handleGoogleSheetsIntegration(
  props: any,
  userId: string,
  bookingData: {
    bookingRef: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_remark?: string;
    booking_date: string;
    time_slot: string;
    service_name?: string;
    service_price?: number;
    duration?: number;
    payment_status?: string;
    ip_address: string;
    referrer: string;
  }
) {
  if (!props.google_sheets_enabled || !props.google_sheets_url) {
    return;
  }

  try {
    const remarkPart = bookingData.customer_remark
      ? ` | Notes: ${bookingData.customer_remark}`
      : '';
    const result = await appendLeadToSheet(
      props.google_sheets_url,
      {
        timestamp: new Date().toLocaleString('en-MY', {
          timeZone: 'Asia/Kuala_Lumpur',
        }),
        name: bookingData.customer_name,
        email: bookingData.customer_email,
        phone: bookingData.customer_phone || '',
        message: `Booking Ref: ${bookingData.bookingRef} | Service: ${bookingData.service_name || 'Appointment'} | Date: ${bookingData.booking_date} | Time: ${bookingData.time_slot} | Duration: ${bookingData.duration || 60}min | Price: ${bookingData.service_price || 0} | Payment: ${bookingData.payment_status || 'N/A'}${remarkPart}`,
        ip_address: bookingData.ip_address,
        referrer: bookingData.referrer,
      },
      userId
    );

    if (!result.success) {
      console.error('Google Sheets append failed:', result.error);
    }
  } catch (error) {
    console.error('Google Sheets error:', error);
  }
}

// Helper function for Google Calendar integration
async function handleGoogleCalendarIntegration(
  props: any,
  userId: string,
  bookingData: {
    bookingRef: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_remark?: string;
    booking_date: string;
    time_slot: string;
    service_name?: string;
    service_price?: number;
    currency?: string;
    duration?: number;
  }
) {
  if (!props.google_calendar_enabled) {
    return;
  }

  try {
    const result = await createCalendarEvent(userId, {
      customerName: bookingData.customer_name,
      customerEmail: bookingData.customer_email,
      customerPhone: bookingData.customer_phone,
      customerRemark: bookingData.customer_remark,
      bookingDate: bookingData.booking_date,
      timeSlot: bookingData.time_slot,
      serviceName: bookingData.service_name || 'Appointment',
      servicePrice: bookingData.service_price,
      currency: bookingData.currency,
      duration: bookingData.duration || 60,
      bookingRef: bookingData.bookingRef,
    });

    if (!result.success) {
      console.error('Google Calendar event creation failed:', result.error);
    }
  } catch (error) {
    console.error('Google Calendar error:', error);
  }
}

// Helper function to track analytics
async function trackAnalyticsEvent(
  supabase: any,
  projectId: string,
  elementId: string,
  bookingId: string
) {
  try {
    await supabase.from('analytics_events').insert({
      project_id: projectId,
      event_type: 'booking_submission',
      session_id: 'unknown',
      metadata: {
        element_id: elementId,
        booking_id: bookingId,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
