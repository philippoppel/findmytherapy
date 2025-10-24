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
    <div className="max-w-4xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-900">Sicherheit</h1>
        <p className="text-neutral-600">
          Aktiviere Zwei-Faktor-Authentifizierung (TOTP), um dein Konto zusätzlich zu schützen.
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <SecuritySettings email={user?.email ?? session.user.email} totpEnabled={Boolean(user?.twoFASecret)} />
      </div>
    </div>
  );
}
