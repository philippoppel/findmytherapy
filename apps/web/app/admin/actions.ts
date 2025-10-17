'use server';

import { revalidatePath } from 'next/cache';
import { prisma, TherapistStatus } from '@mental-health/db';
import { requireAdmin } from '../../lib/auth-guards';

const VALID_STATUSES = new Set<TherapistStatus>(['PENDING', 'VERIFIED', 'REJECTED']);

const isTherapistStatus = (value: string): value is TherapistStatus =>
  VALID_STATUSES.has(value as TherapistStatus);

export async function updateTherapistStatus(formData: FormData) {
  await requireAdmin();

  const profileId = formData.get('profileId');
  const status = formData.get('status');
  const adminNotes = formData.get('adminNotes');

  if (typeof profileId !== 'string' || typeof status !== 'string' || !isTherapistStatus(status)) {
    throw new Error('Ungültiges Formular für Status-Update');
  }

  const notesValue =
    typeof adminNotes === 'string' ? adminNotes.trim().slice(0, 2000) || null : null;

  await prisma.therapistProfile.update({
    where: { id: profileId },
    data: {
      status,
      adminNotes: notesValue,
      isPublic: status === 'VERIFIED',
    },
  });

  revalidatePath('/admin');
}
