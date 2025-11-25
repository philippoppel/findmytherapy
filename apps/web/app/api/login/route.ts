import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import { env } from '@mental-health/config';

const privilegedRoles = new Set(['THERAPIST', 'ADMIN']);

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    console.log('Raw request body:', text);

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

    // Create JWT token
    const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      locale: user.locale || 'de-AT',
      twoFAEnabled: Boolean(user.twoFASecret),
      firstName: user.firstName,
      lastName: user.lastName,
      marketingOptIn: user.marketingOptIn,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    // Set cookie
    const cookieName =
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
