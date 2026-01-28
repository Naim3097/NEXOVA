/**
 * Admin utilities and configuration
 */

// Admin email whitelist - only these emails can access admin dashboard
const ADMIN_EMAILS = [
  'ahm.zafran99@gmail.com',
  'ahm.zafran@gmail.com',
  'sales@nexovadigital.com',
];

/**
 * Check if an email is in the admin whitelist
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get list of admin emails (for reference/debugging)
 */
export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}
