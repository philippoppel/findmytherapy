import 'next-auth';
import 'next-auth/jwt';
import type { UserRole } from '@/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      locale: string;
      twoFAEnabled: boolean;
      firstName?: string | null;
      lastName?: string | null;
      marketingOptIn?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    locale: string;
    twoFASecret?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    marketingOptIn?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    locale?: string;
    twoFAEnabled?: boolean;
    firstName?: string | null;
    lastName?: string | null;
    marketingOptIn?: boolean;
  }
}
