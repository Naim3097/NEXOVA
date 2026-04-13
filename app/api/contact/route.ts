import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function escapeHtml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const sanitized = {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 320),
      phone: phone ? phone.trim().slice(0, 20) : null,
      service: service ? service.trim().slice(0, 100) : null,
      message: message.trim().slice(0, 2000),
    };

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@nexova.my',
      to: 'sales@nexovadigital.com',
      replyTo: sanitized.email,
      subject: `New Inquiry${sanitized.service ? `: ${sanitized.service}` : ''} — ${sanitized.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%); color: white; padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">New Contact Inquiry</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 10px 10px;">
              <p><strong>Name:</strong> ${escapeHtml(sanitized.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(sanitized.email)}</p>
              ${sanitized.phone ? `<p><strong>Phone:</strong> ${escapeHtml(sanitized.phone)}</p>` : ''}
              ${sanitized.service ? `<p><strong>Service:</strong> ${escapeHtml(sanitized.service)}</p>` : ''}
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${escapeHtml(sanitized.message)}</div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Contact email error:', error);
      return NextResponse.json(
        { error: 'Failed to send inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
