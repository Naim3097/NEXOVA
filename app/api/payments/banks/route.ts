import { NextRequest, NextResponse } from 'next/server';
import { getLeanXBankList } from '@/lib/leanx';

/**
 * GET /api/payments/banks
 * Fetch available banks for LeanX Silent Bill payment method
 */
export async function GET(request: NextRequest) {
  try {
    // Get LeanX configuration from environment
    const authToken = process.env.LEANX_AUTH_TOKEN;
    const collectionUuid = process.env.LEANX_COLLECTION_UUID;

    if (!authToken || !collectionUuid) {
      return NextResponse.json(
        {
          success: false,
          error: 'LeanX configuration missing',
        },
        { status: 500 }
      );
    }

    // Fetch banks from LeanX
    const result = await getLeanXBankList({
      authToken,
      collectionUuid,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to fetch bank list',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      banks: result.banks,
    });

  } catch (error) {
    console.error('Bank list fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
