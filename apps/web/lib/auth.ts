import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import EmailProvider from 'next-auth/providers/email';
// import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma, type UserRole } from '@/lib/prisma';
import { env } from '@mental-health/config';
// import { sendMagicLinkEmail } from './email';
import { verifyTotpCode } from './totp';
import { cookies } from 'next/headers';
import { jwtDecrypt, EncryptJWT } from 'jose';

const privilegedRoles = new Set(['THERAPIST', 'ADMIN']);

// Helper function to create consistent 32-byte secret for JWT encryption
async function getEncryptionSecret(): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const secretBytes = encoder.encode(env.NEXTAUTH_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
  return new Uint8Array(hashBuffer);
}

type ExtendedUser = {
  id?: string;
  email?: string | null;
  role?: string | null;
  locale?: string | null;
  twoFASecret?: string | null;
  twoFAEnabled?: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  marketingOptIn?: boolean | null;
};

const isExtendedUser = (value: unknown): value is ExtendedUser => typeof value === 'object' && value !== null;

const authConfig: NextAuthConfig = {
  secret: env.NEXTAUTH_SECRET,
  trustHost: true,
  skipCSRFCheck: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    // Use custom encode/decode to match our custom login endpoint's encryption
    encode: async ({ token, secret: _secret }) => {
      if (!token) {
        throw new Error('No token to encode');
      }

      const encryptionSecret = await getEncryptionSecret();

      return await new EncryptJWT(token)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .encrypt(encryptionSecret);
    },
    decode: async ({ token, secret: _secret }) => {
      if (!token) {
        return null;
      }

      try {
        const encryptionSecret = await getEncryptionSecret();
        const { payload } = await jwtDecrypt(token, encryptionSecret);
        return payload;
      } catch (error) {
        console.error('JWT decode error:', error);
        return null;
      }
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  // adapter: PrismaAdapter(prisma), // Removed: incompatible with Credentials + JWT in NextAuth v5 Beta
  providers: [
    // EmailProvider - temporarily disabled (requires adapter)
    // EmailProvider({
    //   id: 'email',
    //   name: 'Magic Link',
    //   from: env.EMAIL_FROM,
    //   server: {
    //     host: env.EMAIL_SMTP_HOST,
    //     port: env.EMAIL_SMTP_PORT,
    //     secure: env.EMAIL_SMTP_PORT === 465,
    //     auth:
    //       env.EMAIL_SMTP_USER && env.EMAIL_SMTP_PASS
    //         ? {
    //             user: env.EMAIL_SMTP_USER,
    //             pass: env.EMAIL_SMTP_PASS,
    //           }
    //         : undefined,
    //   },
    //   maxAge: 10 * 60,
    //   async sendVerificationRequest({ identifier, url }) {
    //     await sendMagicLinkEmail({ email: identifier, url });
    //   },
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totp: { label: 'TOTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('INVALID_CREDENTIALS');
        }

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          throw new Error('INVALID_CREDENTIALS');
        }

        const passwordValid = await compare(String(credentials.password), user.passwordHash);

        if (!passwordValid) {
          throw new Error('INVALID_CREDENTIALS');
        }

        const requiresTotp = privilegedRoles.has(user.role) && !!user.twoFASecret;

        if (requiresTotp) {
          if (!credentials.totp) {
            throw new Error('TOTP_REQUIRED');
          }

          const isValidTotp = await verifyTotpCode(String(credentials.totp), user.twoFASecret!);

          if (!isValidTotp) {
            throw new Error('TOTP_INVALID');
          }
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          locale: user.locale,
          twoFAEnabled: Boolean(user.twoFASecret),
          firstName: user.firstName,
          lastName: user.lastName,
          marketingOptIn: user.marketingOptIn,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      // Allow all sign-ins for now
      // Note: EmailProvider with 2FA check is disabled
      return true;
    },
    async jwt({ token, user }) {
      if (isExtendedUser(user)) {
        if (typeof user.id === 'string') {
          token.sub = user.id;
        }
        if (typeof user.email === 'string') {
          token.email = user.email;
        }
        if (typeof user.role === 'string') {
          token.role = user.role;
        }
        if (typeof user.locale === 'string') {
          token.locale = user.locale;
        }
        const twoFAEnabled = 'twoFAEnabled' in user ? user.twoFAEnabled : undefined;
        const twoFASecret = 'twoFASecret' in user ? user.twoFASecret : undefined;
        token.twoFAEnabled = typeof twoFAEnabled !== 'undefined' ? Boolean(twoFAEnabled) : Boolean(twoFASecret);
        if ('firstName' in user && typeof user.firstName === 'string') {
          token.firstName = user.firstName;
        }
        if ('lastName' in user && typeof user.lastName === 'string') {
          token.lastName = user.lastName;
        }
        if ('marketingOptIn' in user && typeof user.marketingOptIn !== 'undefined') {
          token.marketingOptIn = Boolean(user.marketingOptIn);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token.sub as string) ?? session.user.id;
        session.user.email = (token.email as string) ?? session.user.email ?? '';
        session.user.role = (token.role as UserRole) ?? 'CLIENT';
        session.user.locale = (token.locale as string) ?? 'de-AT';
        session.user.twoFAEnabled = Boolean(token.twoFAEnabled);
        session.user.firstName =
          typeof token.firstName === 'string' ? token.firstName : session.user.firstName ?? null;
        session.user.lastName =
          typeof token.lastName === 'string' ? token.lastName : session.user.lastName ?? null;
        session.user.marketingOptIn =
          typeof token.marketingOptIn === 'boolean'
            ? token.marketingOptIn
            : session.user.marketingOptIn ?? false;
      }

      return session;
    },
  },
};

export const { handlers, auth: nextAuthAuth, signIn, signOut } = NextAuth(authConfig);

// Custom auth function that can read our JWE tokens
export async function auth() {
  // First try NextAuth's built-in auth
  try {
    const session = await nextAuthAuth();
    if (session) return session;
  } catch {
    // NextAuth failed, try custom token
  }

  // Try to read our custom JWE token
  try {
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token';

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;

    if (!token || !env.NEXTAUTH_SECRET) {
      return null;
    }

    // Use SHA-256 hash of secret to get exactly 32 bytes (Web Crypto API)
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(env.NEXTAUTH_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
    const secret = new Uint8Array(hashBuffer);

    const { payload } = await jwtDecrypt(token, secret);

    // Convert payload to session format
    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        role: payload.role as UserRole,
        locale: (payload.locale as string) || 'de-AT',
        twoFAEnabled: Boolean(payload.twoFAEnabled),
        firstName: payload.firstName as string | null,
        lastName: payload.lastName as string | null,
        marketingOptIn: Boolean(payload.marketingOptIn),
      },
      expires: new Date((payload.exp as number) * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export const getSession = () => auth();
