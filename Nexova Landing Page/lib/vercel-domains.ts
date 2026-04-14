/**
 * Vercel Domains API Utility
 *
 * This module handles programmatic domain management via Vercel's REST API
 * for multi-tenant SaaS custom domain support.
 *
 * @see https://vercel.com/docs/rest-api/reference/endpoints/projects/add-a-domain-to-a-project
 */

const VERCEL_API_URL = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

// Base domain for subdomain format
// e.g., subdomain.nexova.my
const APP_DOMAIN = 'nexova.my';

export interface VercelDomainVerification {
  type: string;
  domain: string;
  value: string;
  reason: string;
}

export interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  verified: boolean;
  verification?: VercelDomainVerification[];
  redirect?: string | null;
  redirectStatusCode?: number | null;
  gitBranch?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface VercelDomainConfig {
  configuredBy?: string;
  nameservers?: string[];
  serviceType?: string;
  cnames?: string[];
  aValues?: string[];
  conflicts?: Array<{
    name: string;
    type: string;
    value: string;
  }>;
  acceptedChallenges?: string[];
  misconfigured: boolean;
}

export interface AddDomainResult {
  success: boolean;
  domain?: VercelDomainResponse;
  config?: VercelDomainConfig;
  error?: string;
  dnsRecords?: {
    type: string;
    name: string;
    value: string;
  }[];
}

/**
 * Get the team query parameter if VERCEL_TEAM_ID is set
 */
function getTeamParam(): string {
  return VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
}

/**
 * Add a single domain to the Vercel project (internal helper)
 */
async function addSingleDomainToVercel(
  domain: string,
  redirectTo?: string
): Promise<{
  success: boolean;
  data?: VercelDomainResponse;
  error?: string;
}> {
  const body: { name: string; redirect?: string; redirectStatusCode?: number } =
    { name: domain };

  // If redirectTo is specified, configure as a redirect domain
  if (redirectTo) {
    body.redirect = redirectTo;
    body.redirectStatusCode = 308; // Permanent redirect
  }

  const response = await fetch(
    `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains${getTeamParam()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    // Handle specific error cases
    if (data.error?.code === 'domain_already_in_use') {
      // Check if it belongs to our project already
      const status = await getDomainStatus(domain);
      if (status.exists) {
        return {
          success: true,
          data: status as unknown as VercelDomainResponse,
        };
      }
      return {
        success: false,
        error: 'This domain is already in use by another Vercel project.',
      };
    }
    if (data.error?.code === 'invalid_domain') {
      return {
        success: false,
        error: 'Invalid domain format. Please enter a valid domain name.',
      };
    }
    return {
      success: false,
      error: data.error?.message || 'Failed to add domain to Vercel.',
    };
  }

  return { success: true, data };
}

/**
 * Get the alternate domain variant (www vs non-www)
 */
export function getAlternateDomain(domain: string): string | null {
  if (domain.startsWith('www.')) {
    // www.example.com -> example.com
    return domain.replace('www.', '');
  }

  // Check if it's an apex domain (e.g., example.com)
  const parts = domain.split('.');
  if (parts.length === 2) {
    // example.com -> www.example.com
    return `www.${domain}`;
  }

  // For deeper subdomains like app.example.com, don't add alternate
  return null;
}

/**
 * Add a custom domain to the Vercel project
 * Automatically adds both www and non-www variants for better user experience
 */
export async function addDomainToVercel(
  domain: string
): Promise<AddDomainResult> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      error: 'Vercel API credentials not configured. Please contact support.',
    };
  }

  try {
    // Add the primary domain
    const primaryResult = await addSingleDomainToVercel(domain);

    if (!primaryResult.success) {
      return {
        success: false,
        error: primaryResult.error,
      };
    }

    // Add the alternate domain variant (www <-> non-www) as a redirect
    const alternateDomain = getAlternateDomain(domain);
    if (alternateDomain) {
      // Add alternate domain that redirects to the primary
      const alternateResult = await addSingleDomainToVercel(
        alternateDomain,
        domain
      );
      if (!alternateResult.success) {
        // Log but don't fail - the primary domain was added successfully
        console.warn(
          `Failed to add alternate domain ${alternateDomain}:`,
          alternateResult.error
        );
      }
    }

    // Get domain configuration to show proper DNS records
    const config = await getDomainConfig(domain);

    // Build DNS records instructions
    const dnsRecords = buildDnsInstructions(
      domain,
      primaryResult.data!,
      config
    );

    // Add DNS records for alternate domain if it exists
    if (alternateDomain) {
      const isAlternateApex = !alternateDomain.startsWith('www.');
      if (isAlternateApex) {
        dnsRecords.push({
          type: 'A',
          name: '@',
          value: '76.76.21.21',
        });
      } else {
        dnsRecords.push({
          type: 'CNAME',
          name: 'www',
          value: 'cname.vercel-dns.com',
        });
      }
    }

    return {
      success: true,
      domain: primaryResult.data,
      config: config || undefined,
      dnsRecords,
    };
  } catch (error) {
    console.error('Error adding domain to Vercel:', error);
    return {
      success: false,
      error: 'Failed to connect to Vercel API. Please try again.',
    };
  }
}

/**
 * Ensure the alternate domain variant exists in Vercel
 * This is used to retroactively add missing domain variants for existing domains
 */
export async function ensureAlternateDomainExists(
  domain: string
): Promise<{ success: boolean; alternateDomain?: string }> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { success: false };
  }

  const alternateDomain = getAlternateDomain(domain);
  if (!alternateDomain) {
    return { success: true }; // No alternate needed for deep subdomains
  }

  try {
    // Check if alternate domain already exists
    const alternateStatus = await getDomainStatus(alternateDomain);
    if (alternateStatus.exists) {
      return { success: true, alternateDomain };
    }

    // Add the alternate domain as a redirect to the primary
    const result = await addSingleDomainToVercel(alternateDomain, domain);
    if (result.success) {
      console.log(`Added alternate domain ${alternateDomain} -> ${domain}`);
    }

    return { success: result.success, alternateDomain };
  } catch (error) {
    console.error('Error ensuring alternate domain exists:', error);
    return { success: false };
  }
}

/**
 * Remove a single domain from the Vercel project (internal helper)
 */
async function removeSingleDomainFromVercel(
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(
    `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains/${encodeURIComponent(domain)}${getTeamParam()}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    // Not found is okay - already removed
    if (data.error?.code === 'not_found') {
      return { success: true };
    }
    return {
      success: false,
      error: data.error?.message || 'Failed to remove domain from Vercel.',
    };
  }

  return { success: true };
}

/**
 * Remove a custom domain from the Vercel project
 * Also removes the alternate domain variant (www <-> non-www) if it exists
 */
export async function removeDomainFromVercel(
  domain: string
): Promise<{ success: boolean; error?: string }> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      error: 'Vercel API credentials not configured.',
    };
  }

  try {
    // Remove primary domain
    const primaryResult = await removeSingleDomainFromVercel(domain);

    // Also try to remove alternate domain variant
    const alternateDomain = getAlternateDomain(domain);
    if (alternateDomain) {
      await removeSingleDomainFromVercel(alternateDomain);
      // Ignore errors for alternate - it might not exist
    }

    return primaryResult;
  } catch (error) {
    console.error('Error removing domain from Vercel:', error);
    return {
      success: false,
      error: 'Failed to connect to Vercel API.',
    };
  }
}

/**
 * Verify a domain on Vercel (after user has configured DNS)
 */
export async function verifyDomainOnVercel(domain: string): Promise<{
  success: boolean;
  verified: boolean;
  error?: string;
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      verified: false,
      error: 'Vercel API credentials not configured.',
    };
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains/${encodeURIComponent(domain)}/verify${getTeamParam()}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        verified: false,
        error: data.error?.message || 'Failed to verify domain.',
      };
    }

    return {
      success: true,
      verified: data.verified === true,
    };
  } catch (error) {
    console.error('Error verifying domain on Vercel:', error);
    return {
      success: false,
      verified: false,
      error: 'Failed to connect to Vercel API.',
    };
  }
}

/**
 * Get domain configuration from Vercel
 */
export async function getDomainConfig(
  domain: string
): Promise<VercelDomainConfig | null> {
  if (!VERCEL_TOKEN) {
    return null;
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v6/domains/${encodeURIComponent(domain)}/config${getTeamParam()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting domain config:', error);
    return null;
  }
}

/**
 * Get domain status from Vercel project
 */
export async function getDomainStatus(domain: string): Promise<{
  exists: boolean;
  verified: boolean;
  verification?: VercelDomainVerification[];
  config?: VercelDomainConfig;
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { exists: false, verified: false };
  }

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains/${encodeURIComponent(domain)}${getTeamParam()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return { exists: false, verified: false };
    }

    const data = await response.json();
    const config = await getDomainConfig(domain);

    return {
      exists: true,
      verified: data.verified === true,
      verification: data.verification,
      config: config || undefined,
    };
  } catch (error) {
    console.error('Error getting domain status:', error);
    return { exists: false, verified: false };
  }
}

/**
 * Build DNS instructions based on domain type and Vercel response
 */
function buildDnsInstructions(
  domain: string,
  domainData: VercelDomainResponse,
  config: VercelDomainConfig | null
): { type: string; name: string; value: string }[] {
  const records: { type: string; name: string; value: string }[] = [];
  const isApex = domain === domainData.apexName; // Root domain (no subdomain)

  if (isApex) {
    // For apex/root domains (e.g., example.com), use A record
    records.push({
      type: 'A',
      name: '@',
      value: '76.76.21.21',
    });
  } else {
    // For subdomains (e.g., www.example.com), use CNAME
    const subdomain = domain.replace(`.${domainData.apexName}`, '');
    records.push({
      type: 'CNAME',
      name: subdomain,
      value: 'cname.vercel-dns.com',
    });
  }

  // Add TXT verification record if domain is not yet verified
  if (
    !domainData.verified &&
    domainData.verification &&
    domainData.verification.length > 0
  ) {
    const txtVerification = domainData.verification.find(
      (v) => v.type === 'TXT'
    );
    if (txtVerification) {
      records.push({
        type: 'TXT',
        name: '_vercel',
        value: txtVerification.value,
      });
    }
  }

  return records;
}

/**
 * Convert subdomain to domain format
 * e.g., "kurtagorilla" → "kurtagorilla.nexova.my"
 */
export function getSubdomainAlias(subdomain: string): string {
  return `${subdomain}.${APP_DOMAIN}`;
}

/**
 * Extract subdomain from domain format
 * e.g., "kurtagorilla.nexova.my" → "kurtagorilla"
 */
export function extractSubdomainFromAlias(domain: string): string | null {
  const suffix = `.${APP_DOMAIN}`;
  if (domain.endsWith(suffix)) {
    return domain.slice(0, -suffix.length);
  }
  return null;
}

/**
 * Add a subdomain alias to the Vercel project
 * This creates a subdomain like: subdomain.nexova.my
 */
export async function addSubdomainAlias(subdomain: string): Promise<{
  success: boolean;
  domain?: string;
  error?: string;
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.warn(
      'Vercel API credentials not configured. Subdomain alias not created.'
    );
    // Return success anyway - the subdomain will still work via middleware rewrite
    // once we have a custom domain or Vercel credentials configured
    return {
      success: true,
      domain: getSubdomainAlias(subdomain),
    };
  }

  const domain = getSubdomainAlias(subdomain);

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains${getTeamParam()}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Domain already exists is okay - might be re-claiming same subdomain
      if (data.error?.code === 'domain_already_in_use') {
        // Check if it's our project
        const status = await getDomainStatus(domain);
        if (status.exists) {
          return { success: true, domain };
        }
        return {
          success: false,
          error: 'This subdomain is already in use.',
        };
      }
      if (data.error?.code === 'invalid_domain') {
        return {
          success: false,
          error: 'Invalid subdomain format.',
        };
      }
      return {
        success: false,
        error: data.error?.message || 'Failed to create subdomain alias.',
      };
    }

    return { success: true, domain };
  } catch (error) {
    console.error('Error adding subdomain alias:', error);
    return {
      success: false,
      error: 'Failed to connect to Vercel API.',
    };
  }
}

/**
 * Remove a subdomain alias from the Vercel project
 */
export async function removeSubdomainAlias(subdomain: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    // Return success if not configured - nothing to remove
    return { success: true };
  }

  const domain = getSubdomainAlias(subdomain);

  try {
    const response = await fetch(
      `${VERCEL_API_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains/${encodeURIComponent(domain)}${getTeamParam()}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      // Not found is okay - already removed
      if (data.error?.code === 'not_found') {
        return { success: true };
      }
      return {
        success: false,
        error: data.error?.message || 'Failed to remove subdomain alias.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing subdomain alias:', error);
    return {
      success: false,
      error: 'Failed to connect to Vercel API.',
    };
  }
}
