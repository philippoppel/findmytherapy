import { redirect } from 'next/navigation';
import { auth } from '../../lib/auth';
import { DashboardFallbackContent } from './DashboardFallbackContent';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Redirect based on role to the correct dashboard
  if (session.user.role === 'THERAPIST') {
    redirect('/dashboard/therapist');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client');
  }

  // Fallback for unknown roles
  return (
    <DashboardFallbackContent
      email={session.user.email}
      role={session.user.role}
      userId={session.user.id}
      firstName={session.user.firstName}
      lastName={session.user.lastName}
    />
  );
}
