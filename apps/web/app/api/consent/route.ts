import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/consent
 * Save user consent for data processing
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scope, source, metadata } = body;

    // Validate scope
    const validScopes = ['DOSSIER_SHARING', 'DATA_PROCESSING', 'COMMUNICATION'];
    if (!validScopes.includes(scope)) {
      return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
    }

    // Check if consent already exists
    const existingConsent = await prisma.clientConsent.findFirst({
      where: {
        clientId: session.user.id,
        scope,
        status: 'GRANTED',
      },
    });

    if (existingConsent) {
      // Update existing consent with new metadata
      const updatedConsent = await prisma.clientConsent.update({
        where: { id: existingConsent.id },
        data: {
          metadata: metadata || existingConsent.metadata,
          source: source || existingConsent.source,
        },
      });

      return NextResponse.json({
        success: true,
        consent: updatedConsent,
        message: 'Consent updated',
      });
    }

    // Create new consent
    const consent = await prisma.clientConsent.create({
      data: {
        clientId: session.user.id,
        scope,
        status: 'GRANTED',
        source: source || 'web',
        metadata: metadata || {},
      },
    });

    return NextResponse.json({
      success: true,
      consent,
      message: 'Consent saved',
    });
  } catch (error) {
    console.error('Error saving consent:', error);
    return NextResponse.json({ error: 'Failed to save consent' }, { status: 500 });
  }
}

/**
 * GET /api/consent
 * Get user consents
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    const where: {
      clientId: string;
      status: string;
      scope?: string;
    } = {
      clientId: session.user.id,
      status: 'GRANTED',
    };

    if (scope) {
      where.scope = scope;
    }

    const consents = await prisma.clientConsent.findMany({
      where,
      orderBy: {
        grantedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      consents,
    });
  } catch (error) {
    console.error('Error fetching consents:', error);
    return NextResponse.json({ error: 'Failed to fetch consents' }, { status: 500 });
  }
}

/**
 * DELETE /api/consent
 * Revoke consent
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const consentId = searchParams.get('id');

    if (!scope && !consentId) {
      return NextResponse.json({ error: 'Either scope or id is required' }, { status: 400 });
    }

    const where: {
      clientId: string;
      id?: string;
      scope?: string;
    } = {
      clientId: session.user.id,
    };

    if (consentId) {
      where.id = consentId;
    } else if (scope) {
      where.scope = scope;
    }

    // Update consent status to REVOKED
    const revokedConsents = await prisma.clientConsent.updateMany({
      where: {
        ...where,
        status: 'GRANTED',
      },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Consent revoked',
      count: revokedConsents.count,
    });
  } catch (error) {
    console.error('Error revoking consent:', error);
    return NextResponse.json({ error: 'Failed to revoke consent' }, { status: 500 });
  }
}
