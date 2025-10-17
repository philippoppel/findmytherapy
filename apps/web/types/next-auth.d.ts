import 'next-auth';
import 'next-auth/jwt';
import type { UserRole } from '@mental-health/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      locale: string;
      twoFAEnabled: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    locale: string;
    twoFASecret?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    locale?: string;
    twoFAEnabled?: boolean;
  }
}
