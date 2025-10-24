import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecrypt } from 'jose';

export async function GET(request: NextRequest) {
  try {
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token';

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;

    if (!token || !process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(null);
    }

    // Use SHA-256 hash of secret to get exactly 32 bytes (Web Crypto API)
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(process.env.NEXTAUTH_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
    const secret = new Uint8Array(hashBuffer);

    const { payload } = await jwtDecrypt(token, secret);

    // Return session in NextAuth format
    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        locale: payload.locale || 'de-AT',
        twoFAEnabled: Boolean(payload.twoFAEnabled),
        firstName: payload.firstName,
        lastName: payload.lastName,
        marketingOptIn: Boolean(payload.marketingOptIn),
      },
      expires: new Date((payload.exp as number) * 1000).toISOString(),
    });
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.json(null);
  }
}
