import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { EncryptJWT } from 'jose';
import { env } from '@mental-health/config';

const privilegedRoles = new Set(['THERAPIST', 'ADMIN']);

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();

    // Fix escaped exclamation marks from curl/bash
    const fixedText = text.replace(/\\!/g, '!');

    const body = JSON.parse(fixedText);
    const { email, password, totp } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const emailLower = String(email).toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const passwordValid = await compare(String(password), user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const requiresTotp = privilegedRoles.has(user.role) && !!user.twoFASecret;

    if (requiresTotp && !totp) {
      return NextResponse.json({ error: 'TOTP_REQUIRED' }, { status: 401 });
    }

    // Create session token payload
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      locale: user.locale || 'de-AT',
      twoFAEnabled: Boolean(user.twoFASecret),
      firstName: user.firstName,
      lastName: user.lastName,
      marketingOptIn: user.marketingOptIn,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    };

    // Create JWE token (encrypted JWT) - compatible with NextAuth
    // Use a 32-byte key for A256GCM encryption (Web Crypto API)
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(env.NEXTAUTH_SECRET);

    // Create a SHA-256 hash to get exactly 32 bytes
    const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
    const secret = new Uint8Array(hashBuffer);

    const token = await new EncryptJWT(tokenPayload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .encrypt(secret);

    // Set cookie with the same name NextAuth uses
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token';

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
