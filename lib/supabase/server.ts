import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Create Supabase client for server-side use with user auth
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// Lazy create Supabase admin client
// Only use this on the server for admin operations
export function getSupabaseAdmin() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
}

// Legacy export for compatibility (lazy initialization)
let _supabaseAdmin: any = null;
export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = getSupabaseAdmin();
    }
    return _supabaseAdmin[prop];
  }
});
