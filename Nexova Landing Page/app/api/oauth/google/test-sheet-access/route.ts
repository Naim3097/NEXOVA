import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateSheetAccess, getSheetInfo } from '@/lib/google-sheets';

/**
 * Test endpoint to verify Google Sheets access
 * Access: /api/oauth/google/test-sheet-access?sheetUrl=YOUR_SHEET_URL
 */
export async function GET(request: Request) {
  try {
    // Get authenticated user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get sheet URL from query params
    const { searchParams } = new URL(request.url);
    const sheetUrl = searchParams.get('sheetUrl');

    if (!sheetUrl) {
      return NextResponse.json(
        { error: 'Missing sheetUrl parameter' },
        { status: 400 }
      );
    }

    // Test sheet access
    const accessResult = await validateSheetAccess(sheetUrl, user.id);

    if (!accessResult.valid) {
      return NextResponse.json({
        success: false,
        error: accessResult.error,
        sheetId: accessResult.sheetId,
      }, { status: 403 });
    }

    // Get sheet info
    const infoResult = await getSheetInfo(sheetUrl, user.id);

    return NextResponse.json({
      success: true,
      message: 'Sheet access verified!',
      sheetId: accessResult.sheetId,
      sheetInfo: infoResult,
    });

  } catch (error) {
    console.error('Test sheet access error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
