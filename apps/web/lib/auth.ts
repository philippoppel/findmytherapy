import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma, type UserRole } from '@mental-health/db';
import { env } from '@mental-health/config';
import { sendMagicLinkEmail } from './email';
import { verifyTotpCode } from './totp';

const privilegedRoles = new Set(['THERAPIST', 'ADMIN']);

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
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      id: 'email',
      name: 'Magic Link',
      from: env.EMAIL_FROM,
      server: {
        host: env.EMAIL_SMTP_HOST,
        port: env.EMAIL_SMTP_PORT,
        secure: env.EMAIL_SMTP_PORT === 465,
        auth:
          env.EMAIL_SMTP_USER && env.EMAIL_SMTP_PASS
            ? {
                user: env.EMAIL_SMTP_USER,
                pass: env.EMAIL_SMTP_PASS,
              }
            : undefined,
      },
      maxAge: 10 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await sendMagicLinkEmail({ email: identifier, url });
      },
    }),
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
    async signIn({ user, account }) {
      if (!account) {
        return true;
      }

      if (account.provider === 'email' && isExtendedUser(user)) {
        const role = typeof user.role === 'string' ? user.role : undefined;
        if (role && privilegedRoles.has(role) && user.twoFASecret) {
          throw new Error('EMAIL_TWO_FACTOR_DISABLED');
        }
      }

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

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const getSession = () => auth();
