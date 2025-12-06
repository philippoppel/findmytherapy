import { requireTherapist } from '@/lib/auth-guards';
import { PayoutsContent } from './PayoutsContent';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

export default async function PayoutsPage() {
  await requireTherapist();

  return <PayoutsContent />;
}
