import { google } from 'googleapis';
import { getValidAccessToken } from './oauth/google-oauth';

interface BookingEventData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerRemark?: string;
  bookingDate: string; // ISO date string YYYY-MM-DD
  timeSlot: string; // HH:MM
  serviceName: string;
  servicePrice?: number;
  currency?: string;
  duration: number; // minutes
  bookingRef: string;
}

/**
 * Create a Google Calendar event for a booking
 */
export async function createCalendarEvent(
  userId: string,
  bookingData: BookingEventData
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const accessToken = await getValidAccessToken(userId);

    if (!accessToken) {
      return {
        success: false,
        error: 'Google account not connected or token expired',
      };
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse booking date and time
    const [year, month, day] = bookingData.bookingDate.split('-').map(Number);
    const [hours, minutes] = bookingData.timeSlot.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(
      startDate.getTime() + bookingData.duration * 60 * 1000
    );

    // Build description
    const descriptionParts = [
      `Booking Reference: ${bookingData.bookingRef}`,
      `Customer: ${bookingData.customerName}`,
      `Email: ${bookingData.customerEmail}`,
    ];

    if (bookingData.customerPhone) {
      descriptionParts.push(`Phone: ${bookingData.customerPhone}`);
    }

    if (bookingData.servicePrice && bookingData.servicePrice > 0) {
      const currency = bookingData.currency || 'MYR';
      const price =
        currency === 'MYR'
          ? `RM ${bookingData.servicePrice.toFixed(2)}`
          : `${currency} ${bookingData.servicePrice.toFixed(2)}`;
      descriptionParts.push(`Price: ${price}`);
    }

    if (bookingData.customerRemark) {
      descriptionParts.push(`\nNotes: ${bookingData.customerRemark}`);
    }

    descriptionParts.push(`\nDuration: ${bookingData.duration} minutes`);

    const event = {
      summary: `${bookingData.serviceName} - ${bookingData.customerName}`,
      description: descriptionParts.join('\n'),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Asia/Kuala_Lumpur',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Kuala_Lumpur',
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: 30 }],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return {
      success: true,
      eventId: response.data.id || undefined,
    };
  } catch (error: any) {
    console.error('Error creating Google Calendar event:', error);

    let errorMessage = 'Failed to create calendar event';
    if (error.code === 401) {
      errorMessage =
        'Google authentication expired. Please reconnect your Google account.';
    } else if (error.code === 403) {
      errorMessage =
        'Calendar access denied. Please reconnect your Google account with calendar permissions.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
