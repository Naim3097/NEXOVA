import { Resend } from 'resend';

export interface FormSubmissionEmailData {
  projectName: string;
  formId: string;
  submissionData: Record<string, any>;
  submittedAt: string;
  ipAddress: string;
}

// Lazy initialize Resend client
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Send email notification when a form is submitted
 */
export async function sendFormSubmissionNotification(
  recipientEmail: string,
  data: FormSubmissionEmailData
): Promise<{ success: boolean; error?: string }> {
  // Skip if no API key is configured
  const resend = getResendClient();
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return { success: false, error: 'Email not configured' };
  }

  try {
    // Format submission data for email
    const formattedData = Object.entries(data.submissionData)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join('<br>');

    // Send email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: recipientEmail,
      subject: `New Form Submission: ${data.projectName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .info-row {
                margin-bottom: 15px;
              }
              .submission-data {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Form Submission</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <strong>Project:</strong> ${data.projectName}
              </div>
              <div class="info-row">
                <strong>Form ID:</strong> ${data.formId}
              </div>
              <div class="info-row">
                <strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}
              </div>
              <div class="info-row">
                <strong>IP Address:</strong> ${data.ipAddress}
              </div>

              <div class="submission-data">
                <h2 style="margin-top: 0; font-size: 18px;">Submission Details</h2>
                ${formattedData}
              </div>
            </div>
            <div class="footer">
              <p>This email was sent automatically from your Product Page Builder project.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
