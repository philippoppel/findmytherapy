import { requireRoles } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';
import { SecurityContent } from './SecurityContent';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const ALLOWED_ROLES: import('@/lib/prisma').UserRole[] = ['THERAPIST', 'ADMIN'];

export default async function SecurityPage() {
  const session = await requireRoles(ALLOWED_ROLES);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      twoFASecret: true,
    },
  });

  return (
    <SecurityContent
      email={user?.email ?? session.user.email}
      totpEnabled={Boolean(user?.twoFASecret)}
    />
  );
}
