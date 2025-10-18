import { redirect } from 'next/navigation';

import type { UserRole } from '@mental-health/db';
import { requireSession } from '../../lib/auth-guards';

export default async function DashboardRouterPage() {
  const session = await requireSession();
  const role = session.user.role as UserRole;

  if (role === 'THERAPIST') {
    redirect('/dashboard/therapist');
  }

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  redirect('/dashboard/client');
}
