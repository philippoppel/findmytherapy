import { requireRoles } from '../../../lib/auth-guards';
import { prisma } from '@mental-health/db';
import { SecuritySettings } from '../../../components/security/totp-settings';

const ALLOWED_ROLES: import('@mental-health/db').UserRole[] = ['THERAPIST', 'ADMIN'];

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Sicherheit</h1>
        <p className="text-gray-600">
          Aktiviere Zwei-Faktor-Authentifizierung (TOTP), um dein Konto zusätzlich zu schützen.
        </p>
      </header>

      <SecuritySettings email={user?.email ?? session.user.email} totpEnabled={Boolean(user?.twoFASecret)} />
    </div>
  );
}
