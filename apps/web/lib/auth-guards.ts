import { redirect } from 'next/navigation';
import { auth } from './auth';
import type { UserRole } from '@/lib/prisma';

type RequireRoleOptions = {
  redirectTo?: string;
};

export const requireSession = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return session;
};

export const requireRoles = async (roles: UserRole[], options: RequireRoleOptions = {}) => {
  const session = await requireSession();
  const role = session.user.role as UserRole;

  if (!roles.includes(role)) {
    redirect(options.redirectTo ?? '/login?error=unauthorized');
  }

  return session;
};

export const requireTherapist = () => requireRoles(['THERAPIST']);

export const requireAdmin = () => requireRoles(['ADMIN']);

export const requireClient = () => requireRoles(['CLIENT']);
